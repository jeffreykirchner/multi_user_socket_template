import logging
import asyncio

from asgiref.sync import sync_to_async

from django.db import transaction

from main.models import Session

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

        if event["message_text"]["action"] == "start":
            self.timer_running = True
        else:
            self.timer_running = False

        result = await sync_to_async(take_start_timer)(self.session_id, event["message_text"])

        # #Send reply to sending channel
        if self.timer_running == True:
            await self.send_message(message_to_self=result, message_to_group=None,
                                    message_type=event['type'], send_to_client=True, send_to_group=False)
        
        await self.send_message(message_to_self=False, message_to_group=result,
                                message_type="time", send_to_client=False, send_to_group=True)

        if result["value"] == "success" and event["message_text"]["action"] == "start":
            #start continue timer
            await self.channel_layer.send(
                self.channel_name,
                {
                    'type': "continue_timer",
                    'message_text': {},
                }
            )
        else:
            logger.warning(f"start_timer fail: {result}")
        
        logger.info(f"start_timer complete {event}")

    async def continue_timer(self, event):
        '''
        continue to next second of the experiment
        '''
        logger = logging.getLogger(__name__)
        # logger.info(f"continue_timer start")

        if not self.timer_running:
            logger.info(f"continue_timer timer off")
            return

        if not self.timer_running:
            logger.info(f"continue_timer timer off")
            return

        result = await sync_to_async(take_do_period_timer, thread_sensitive=False)(self.session_id)

        if result["value"] == "success":

            session_player_status = {}

            #decrement waiting and iteration time
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

            await self.send_message(message_to_self=False, message_to_group=result,
                                    message_type="time", send_to_client=False, send_to_group=True)

            #if session is not over continue
            if not result["stop_timer"]:

                loop = asyncio.get_event_loop()

                loop.call_later(1, asyncio.create_task, 
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

def take_start_timer(session_id, data):
    '''
    start timer
    '''   
    logger = logging.getLogger(__name__) 
    logger.info(f"Start timer {data}")

    action = data["action"]

    with transaction.atomic():
        session = Session.objects.select_for_update().get(id=session_id)

        if session.timer_running and action=="start":
            
            logger.warning(f"Start timer: already started")
            return {"value" : "fail", "result" : {"message":"timer already running"}}

        if action == "start":
            session.timer_running = True
        else:
            session.timer_running = False

        session.save()

    return {"value" : "success", "result" : session.json_for_timer()}

def take_do_period_timer(session_id):
    '''
    do period timer actions
    '''
    logger = logging.getLogger(__name__)

    session = Session.objects.get(id=session_id)

    if session.timer_running == False or session.finished:
        return_json = {"value" : "fail", "result" : {"message" : "session no longer running"}}
    else:
        return_json = session.do_period_timer()

    # logger.info(f"take_do_period_timer: {return_json}")

    return return_json