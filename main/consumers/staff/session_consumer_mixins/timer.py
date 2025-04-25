import logging
import math
import json

from datetime import datetime
from decimal import Decimal

from main.models import Session
from main.models import SessionEvent

from main.globals import ExperimentPhase
from main.globals import round_up

class TimerMixin():
    '''
    timer mixin for staff session consumer
    '''

    async def start_timer(self, event):
        '''
        start or stop timer 
        '''
        logger = logging.getLogger(__name__)
        # logger.info(f"start_timer {event}")

        if self.controlling_channel != self.channel_name:
            logger.warning(f"start_timer: not controlling channel")
            return

        if event["message_text"]["action"] == "start":            
            self.world_state_local["timer_running"] = True

            self.world_state_local["timer_history"].append({"time": datetime.now().strftime("%Y-%m-%dT%H:%M:%S.%f"),
                                                        "count": 0})
        else:
            self.world_state_local["timer_running"] = False

        
        await self.store_world_state(force_store=True)

        # if self.world_state_local["timer_running"]:
        #     result = {"timer_running" : True}
        #     await self.send_message(message_to_self=result, message_to_group=None,
        #                             message_type=event['type'], send_to_client=True, send_to_group=False)
        
        #     #start continue timer
        #     # await self.channel_layer.send(
        #     #     self.channel_name,
        #     #     {
        #     #         'type': "continue_timer",
        #     #         'message_text': {},
        #     #     }
        #     # )
        # else:
            #stop timer
        result = {"timer_running" : self.world_state_local["timer_running"]}
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
        #logger.info(f"continue_timer: start")

        if not self.world_state_local["timer_running"]:
            # logger.info(f"continue_timer timer off")
            await self.send_message(message_to_self=True, message_to_group=None,
                                    message_type="stop_timer_pulse", send_to_client=True, send_to_group=False)
            return

        stop_timer = False
        send_update = True
        period_is_over = False

        result = {"earnings":{}}

        #check session over
        if self.world_state_local["current_period"] > self.parameter_set_local["period_count"] or \
            (self.world_state_local["current_period"] == self.parameter_set_local["period_count"] and
             self.world_state_local["time_remaining"] <= 1):

            self.world_state_local["current_period"] = self.parameter_set_local["period_count"]
            self.world_state_local["time_remaining"] = 0
            self.world_state_local["timer_running"] = False
            
            self.world_state_local["current_experiment_phase"] = ExperimentPhase.NAMES
            stop_timer = True

            period_is_over = True

            #store final period earnings    
            last_period_id = self.world_state_local["session_periods_order"][self.world_state_local["current_period"] - 1]
            last_period_id_s = str(last_period_id)
            last_period = self.world_state_local["session_periods"][last_period_id_s]

            last_period["consumption_completed"] = True
            
            for i in self.world_state_local["session_players"]:
                period_earnings = (self.world_state_local["session_players"][i]["inventory"][last_period_id_s] * 
                                           Decimal(self.parameter_set_local["token_cents_value"]))
                
                self.world_state_local["session_players"][i]["earnings"] += period_earnings

                result["earnings"][i] = {}
                result["earnings"][i]["total_earnings"] = self.world_state_local["session_players"][i]["earnings"]/100
                result["earnings"][i]["period_earnings"] = period_earnings
            
            await self.store_world_state(force_store=True)
           
        if self.world_state_local["current_experiment_phase"] != ExperimentPhase.NAMES:

            ts = datetime.now() - datetime.strptime(self.world_state_local["timer_history"][-1]["time"],"%Y-%m-%dT%H:%M:%S.%f")

            #check if a full second has passed
            if self.world_state_local["timer_history"][-1]["count"] == math.floor(ts.seconds):
                send_update = False

            if send_update:
                ts = datetime.now() - datetime.strptime(self.world_state_local["timer_history"][-1]["time"],"%Y-%m-%dT%H:%M:%S.%f")

                self.world_state_local["timer_history"][-1]["count"] = math.floor(ts.seconds)

                total_time = 0  #total time elapsed
                for i in self.world_state_local["timer_history"]:
                    total_time += i["count"]

                #find current period
                current_period = 1
                temp_time = 0          #total of period lengths through current period.
                for i in range(1, self.parameter_set_local["period_count"]+1):
                    temp_time += self.parameter_set_local["period_length"]

                    #add break times
                    if i % self.parameter_set_local["break_frequency"] == 0:
                        temp_time += self.parameter_set_local["break_length"]
                    
                    if temp_time > total_time:
                        break
                    else:
                        current_period += 1

                #time remaining in period
                time_remaining = temp_time - total_time

                # if current_period == 2 and time_remaining ==10:
                #     '''test code'''
                #     pass

                self.world_state_local["time_remaining"] = time_remaining
                self.world_state_local["current_period"] = current_period
                
                if current_period > 1:
                    last_period_id = self.world_state_local["session_periods_order"][current_period - 2]
                    last_period_id_s = str(last_period_id)
                    last_period = self.world_state_local["session_periods"][last_period_id_s]

                    period_is_over = not last_period["consumption_completed"]

                #check if period over
                if period_is_over:

                    session = await Session.objects.aget(id=self.session_id)
                    current_period = await session.aget_current_session_period()

                    last_period["consumption_completed"] = True
                    
                    for i in self.world_state_local["session_players"]:

                        period_earnings = Decimal(self.world_state_local["session_players"][i]["inventory"][last_period_id_s]) * \
                                          Decimal(self.parameter_set_local["token_cents_value"])

                        self.world_state_local["session_players"][i]["earnings"] = Decimal(self.world_state_local["session_players"][i]["earnings"]) + period_earnings

                        result["earnings"][i] = {}
                        result["earnings"][i]["total_earnings"] = self.world_state_local["session_players"][i]["earnings"]
                        result["earnings"][i]["period_earnings"] = period_earnings
                        
                        current_period.summary_data[i]["earnings"] = result["earnings"][i]["period_earnings"]

                    await current_period.asave()

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
            result["period_is_over"] = period_is_over

            #locations
            result["current_locations"] = {}
            result["target_locations"] = {}
            for i in self.world_state_local["session_players"]:
                result["current_locations"][i] = self.world_state_local["session_players"][i]["current_location"]
                result["target_locations"][i] = self.world_state_local["session_players"][i]["target_location"]

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

            self.session_events.append(SessionEvent(session_id=self.session_id, 
                                                    type="time",
                                                    period_number=self.world_state_local["current_period"],
                                                    time_remaining=self.world_state_local["time_remaining"],
                                                    data=result))
            
            await SessionEvent.objects.abulk_create(self.session_events, ignore_conflicts=True)

            self.session_events = []

            if stop_timer:
                self.world_state_local["timer_running"] = False

            await self.store_world_state(force_store=True)
            
            await self.send_message(message_to_self=False, message_to_group=result,
                                    message_type="time", send_to_client=False, send_to_group=True)

    async def update_time(self, event):
        '''
        update time phase
        '''

        event_data = json.loads(event["group_data"])

        await self.send_message(message_to_self=event_data, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)
        
    #async helpers
    