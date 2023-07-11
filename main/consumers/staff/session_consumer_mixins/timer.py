import logging
import asyncio
import math

from datetime import datetime

from asgiref.sync import sync_to_async

from django.db import transaction

from main.models import Session
from main.models import SessionEvent

from main.globals import ExperimentPhase

class TimerMixin():
    '''
    timer mixin for staff session consumer
    '''

    async def start_timer(self, event):
        '''
        start or stop timer 
        '''
        logger = logging.getLogger(__name__)
        logger.info(f"start_timer {event}")

        if self.controlling_channel != self.channel_name:
            logger.warning(f"start_timer: not controlling channel")
            return

        if event["message_text"]["action"] == "start":
            if self.timer_running:
                logger.warning(f"start_timer: already started")
                return
            
            self.timer_running = True
        else:
            self.timer_running = False

        self.world_state_local["timer_running"] = self.timer_running
        self.world_state_local["timer_history"].append({"time": datetime.now(), "count": 0})
        Session.objects.filter(id=self.session_id).aupdate(world_state=self.world_state_local)

        if self.timer_running:
            result = {"timer_running" : True}
            await self.send_message(message_to_self=result, message_to_group=None,
                                    message_type=event['type'], send_to_client=True, send_to_group=False)
        
            #start continue timer
            # await self.channel_layer.send(
            #     self.channel_name,
            #     {
            #         'type': "continue_timer",
            #         'message_text': {},
            #     }
            # )
        else:
            #stop timer
            result = {"timer_running" : False}
            await self.send_message(message_to_self=result, message_to_group=None,
                                    message_type=event['type'], send_to_client=True, send_to_group=False)
        
        # logger.info(f"start_timer complete {event}")

    async def continue_timer(self, event):
        '''
        continue to next second of the experiment
        '''
        if self.controlling_channel != self.channel_name:
            return
        
        logger = logging.getLogger(__name__)
        # logger.info(f"continue_timer start")

        # if not self.timer_running:
        #     logger.info(f"continue_timer timer off")
        #     return

        stop_timer = False
        send_update = True

        result = {"earnings":{}}

        #check session over
        if self.world_state_local["current_period"] >= self.parameter_set_local["period_count"] and \
           self.world_state_local["time_remaining"] <= 1:

            self.world_state_local["current_period"] = self.parameter_set_local["period_count"]
            self.world_state_local["time_remaining"] = 0
            
            session = await Session.objects.aget(id=self.session_id)
            current_session_period = await session.session_periods.aget(period_number=self.world_state_local["current_period"])
            result["earnings"] = await current_session_period.store_earnings(self.world_state_local)

            self.world_state_local["current_experiment_phase"] = ExperimentPhase.NAMES
            stop_timer = True
           
        if self.world_state_local["current_experiment_phase"] != ExperimentPhase.NAMES:

            ts = datetime.now() - self.world_state_local["timer_history"][-1]["time"]

            #check if a full second has passed
            if self.world_state_local["timer_history"][-1]["count"] == math.floor(ts.seconds):
                send_update = False

            if send_update:
                self.world_state_local["timer_history"][-1]["count"] = math.floor(ts.seconds)

                total_time = 0
                for i in self.world_state_local["timer_history"]:
                    total_time += i["count"]

                current_period = math.floor(total_time / self.parameter_set_local["period_length"]) + 1
                time_remaining = self.parameter_set_local["period_length"] - (total_time % self.parameter_set_local["period_length"])

                self.world_state_local["time_remaining"] = time_remaining
                self.world_state_local["current_period"] = current_period

                #check if period over
                if self.world_state_local["time_remaining"] == 1:

                    current_period_id = str(self.world_state_local["session_periods_order"][self.world_state_local["current_period"]-1])

                    for i in self.world_state_local["session_players"]:
                        self.world_state_local["session_players"][i]["earnings"] += self.world_state_local["session_players"][i]["inventory"][current_period_id]

                        result["earnings"][i] = {}
                        result["earnings"][i]["total_earnings"] = self.world_state_local["session_players"][i]["earnings"]
                        result["earnings"][i]["period_earnings"] = self.world_state_local["session_players"][i]["inventory"][current_period_id]

        if send_update:
            #session status
            result["value"] = "success"
            result["stop_timer"] = stop_timer
            result["time_remaining"] = self.world_state_local["time_remaining"]
            result["current_period"] = self.world_state_local["current_period"]
            result["timer_running"] = self.world_state_local["timer_running"]
            result["started"] = self.world_state_local["started"]
            result["finished"] = self.world_state_local["finished"]
            result["current_experiment_phase"] = self.world_state_local["current_experiment_phase"]

            #current locations
            result["current_locations"] = {}
            for i in self.world_state_local["session_players"]:
                result["current_locations"][i] = self.world_state_local["session_players"][i]["current_location"]

            session_player_status = {}

            #decrement waiting and interaction time
            for p in self.world_state_local["session_players"]:
                session_player = self.world_state_local["session_players"][p]

                if session_player["cool_down"] > 0:
                    session_player["cool_down"] -= 1

                if session_player["interaction"] > 0:
                    session_player["interaction"] -= 1

                    if session_player["interaction"] == 0:
                        session_player["cool_down"] = self.parameter_set_local["cool_down_length"]
                
                if session_player["interaction"] == 0:
                    session_player["frozen"] = False
                    session_player["tractor_beam_target"] = None

                session_player_status[p] = {"interaction": session_player["interaction"], 
                                            "frozen": session_player["frozen"], 
                                            "cool_down": session_player["cool_down"],
                                            "tractor_beam_target" : session_player["tractor_beam_target"]}                
            
            result["session_player_status"] = session_player_status

            await Session.objects.filter(id=self.session_id).aupdate(world_state=self.world_state_local)
            await SessionEvent.objects.acreate(session_id=self.session_id, 
                                               type="timer_tick",
                                               period_number=self.world_state_local["current_period"],
                                               time_remaining=self.world_state_local["time_remaining"],
                                               data=self.world_state_local)
            
            await self.send_message(message_to_self=False, message_to_group=result,
                                    message_type="time", send_to_client=False, send_to_group=True)

        #if session is not over continue
        stop_timer = True
        if not stop_timer:

            loop = asyncio.get_event_loop()

            loop.call_later(0.33, asyncio.create_task, 
                            self.channel_layer.send(
                                self.channel_name,
                                {
                                    'type': "continue_timer",
                                    'message_text': {},
                                }
                            ))
        
        # logger.info(f"continue_timer end")

    async def update_time(self, event):
        '''
        update time phase
        '''

        event_data = event["group_data"]

        await self.send_message(message_to_self=event_data, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)