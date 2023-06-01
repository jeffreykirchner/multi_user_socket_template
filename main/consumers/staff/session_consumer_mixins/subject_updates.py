
import logging

from asgiref.sync import sync_to_async

from django.db import transaction
from django.db.models.fields.json import KT

from main.models import SessionPlayer
from main.models import Session
from main.models import SessionEvent

from datetime import datetime, timedelta

from main.globals import ExperimentPhase

class SubjectUpdatesMixin():
    '''
    subject updates mixin for staff session consumer
    '''

    async def chat(self, event):
        '''
        take chat from client
        '''        
       
        logger = logging.getLogger(__name__) 
        # logger.info(f"take chat: Session {self.session_id}, Player {self.session_player_id}, Data {data}")
        
        if not self.world_state_local["started"] or \
           self.world_state_local["finished"] or \
           self.world_state_local["current_experiment_phase"] != ExperimentPhase.RUN:
            logger.info(f"take chat: failed, session not started, finished, or not in run phase {self.world_state_local}")
            return
        
        result = {"value" : "success"}
        event_data = event["message_text"]
        
        result["text"] = event_data["text"]
        result["sender_id"] = self.session_players_local[event["player_key"]]["id"]

        await SessionEvent.objects.acreate(session_id=self.session_id, 
                                           type="chat",
                                           period_number=self.world_state_local["current_period"],
                                           time_remaining=self.world_state_local["time_remaining"],
                                           data=result)

        await self.send_message(message_to_self=None, message_to_group=result,
                                message_type=event['type'], send_to_client=False, send_to_group=True)

    async def update_chat(self, event):
        '''
        send chat to clients, if clients can view it
        '''
        event_data = event["group_data"]

        await self.send_message(message_to_self=event_data, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)

    async def update_connection_status(self, event):
        '''
        handle connection status update from group member
        '''
        logger = logging.getLogger(__name__) 
        event_data = event["data"]

        #update not from a client
        if event_data["value"] == "fail":
            logger.info(f"update_connection_status: event data {event}, channel name {self.channel_name}, group name {self.room_group_name}")

            if "session" in self.room_group_name:
                if event["connect_or_disconnect"] == "connect":
                    self.world_state_local["controller"] = event["sender_channel_name"]

                    if self.channel_name == event["sender_channel_name"]:
                        logger.info(f"update_connection_status: controller {self.channel_name}, session id {self.session_id}")
                        await Session.objects.filter(id=self.session_id).aupdate(world_state=self.world_state_local) 
                else:
                    if self.channel_name != event["sender_channel_name"]:
                        self.world_state_local["controller"] = self.channel_name
                        await Session.objects.filter(id=self.session_id).aupdate(world_state=self.world_state_local)
            return
        
        subject_id = event_data["result"]["id"]

        session_player = await SessionPlayer.objects.aget(id=subject_id)
        event_data["result"]["name"] = session_player.name
        event_data["result"]["student_id"] = session_player.student_id
        event_data["result"]["current_instruction"] = session_player.current_instruction
        event_data["result"]["survey_complete"] = session_player.survey_complete
        event_data["result"]["instructions_finished"] = session_player.instructions_finished

        await self.send_message(message_to_self=event_data, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)

    async def update_name(self, event):
        '''
        send update name notice to staff screens
        '''

        event_data = event["staff_data"]

        await self.send_message(message_to_self=event_data, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)

    async def update_next_instruction(self, event):
        '''
        send instruction status to staff
        '''

        event_data = event["staff_data"]

        await self.send_message(message_to_self=event_data, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)
    
    async def update_finish_instructions(self, event):
        '''
        send instruction status to staff
        '''

        event_data = event["staff_data"]

        await self.send_message(message_to_self=event_data, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)
    
    async def update_survey_complete(self, event):
        '''
        send survey complete update
        '''
        event_data = event["data"]

        await self.send_message(message_to_self=event_data, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)

    async def target_location_update(self, event):
        '''
        update target location from subject screen
        '''
        logger = logging.getLogger(__name__) 
        logger.info(f"target_location_update: world state controller {self.world_state_local['controller']} channel name {self.channel_name}")
        if self.world_state_local["controller"] != self.channel_name:
            return
        
        logger = logging.getLogger(__name__)
        
        event_data =  event["message_text"]

        try:
            target_location = event_data["target_location"]    
            current_location = event_data["current_location"]
        except KeyError:
            logger.info(f"target_location_update: invalid location, {event['message_text']}")
            return
            # result = {"value" : "fail", "result" : {"message" : "Invalid location."}}
        
        player_id = self.session_players_local[event["player_key"]]["id"]
        session_player = self.world_state_local["session_players"][str(player_id)]

        if session_player["frozen"] or session_player["tractor_beam_target"]:
            return

        session_player["target_location"] = target_location
        session_player["current_location"] = current_location

        last_update = datetime.strptime(self.world_state_local["last_update"], "%Y-%m-%d %H:%M:%S.%f")
        dt_now = datetime.now()

        if dt_now - last_update > timedelta(seconds=1):
            # logger.info("updating world state")
            self.world_state_local["last_update"] = str(dt_now)
            await Session.objects.filter(id=self.session_id).aupdate(world_state=self.world_state_local)
        
        result = {"value" : "success", 
                  "target_location" : target_location, 
                  "current_location" : current_location,
                  "session_player_id" : player_id}
        
        await self.send_message(message_to_self=None, message_to_group=result,
                                message_type=event['type'], send_to_client=False, send_to_group=True)

    async def update_target_location_update(self, event):
        '''
        update target location from subject screen
        '''

        event_data = event["group_data"]

        await self.send_message(message_to_self=event_data, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)

    async def collect_token(self, event):
        '''
        subject collects token
        '''
        logger = logging.getLogger(__name__)
        
        message_text = event["message_text"]
        token_id = message_text["token_id"]
        period_id = message_text["period_id"]
        player_id = self.session_players_local[event["player_key"]]["id"]

        # if not await sync_to_async(sync_collect_token)(self.session_id, period_id, token_id, player_id):
        #     logger.warning(f'collect_token: {message_text}, token {token_id} not available')
        #     return
        
        if self.world_state_local['tokens'][str(period_id)][str(token_id)]['status'] != 'available':
            return
        
        self.world_state_local['tokens'][str(period_id)][str(token_id)]['status'] = player_id
        self.world_state_local['session_players'][str(player_id)]['inventory'][str(period_id)]+=1

        inventory = self.world_state_local['session_players'][str(player_id)]['inventory'][str(period_id)]

        await Session.objects.filter(id=self.session_id).aupdate(world_state=self.world_state_local)
        await SessionEvent.objects.acreate(session_id=self.session_id, 
                                           type="collect_token",
                                           period_number=self.world_state_local["current_period"],
                                           time_remaining=self.world_state_local["time_remaining"],
                                           data={"token_id" : token_id, "period_id" : period_id, "player_id" : player_id, "inventory" : inventory})

        result = {"token_id" : token_id, "period_id" : period_id, "player_id" : player_id, "inventory" : inventory}

        #logger.warning(f'collect_token: {message_text}, token {token_id}')

        await self.send_message(message_to_self=None, message_to_group=result,
                                message_type=event['type'], send_to_client=False, send_to_group=True)

    async def update_collect_token(self, event):
        '''
        subject collects token update
        '''
        event_data = event["group_data"]

        await self.send_message(message_to_self=event_data, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)
    
    async def tractor_beam(self, event):
        '''
        subject activates tractor beam
        '''

        player_id = self.session_players_local[event["player_key"]]["id"]
        target_player_id = event["message_text"]["target_player_id"]

        source_player = self.world_state_local['session_players'][str(player_id)]
        target_player = self.world_state_local['session_players'][str(target_player_id)]

        # check if players are frozen
        if source_player['frozen'] or target_player['frozen']:
            return

        #check if either player has tractor beam enabled
        if source_player['tractor_beam_target'] or target_player['tractor_beam_target']:
            return
        
        #check if player is already interacting or cooling down.
        if source_player['interaction'] > 0 or source_player['cool_down'] > 0:
            return
        
        source_player['frozen'] = True
        target_player['frozen'] = True

        source_player['tractor_beam_target'] = target_player_id
        source_player['interaction'] = self.parameter_set_local['interaction_length']

        target_player['interaction'] = self.parameter_set_local['interaction_length']

        await Session.objects.filter(id=self.session_id).aupdate(world_state=self.world_state_local)

        await SessionEvent.objects.acreate(session_id=self.session_id, 
                                           type="tractor_beam",
                                           period_number=self.world_state_local["current_period"],
                                           time_remaining=self.world_state_local["time_remaining"],
                                           data={"player_id" : player_id, "target_player_id" : target_player_id,})

        result = {"player_id" : player_id, "target_player_id" : target_player_id}
        
        await self.send_message(message_to_self=None, message_to_group=result,
                                message_type=event['type'], send_to_client=False, send_to_group=True)

    async def update_tractor_beam(self, event):
        '''
        subject activates tractor beam update
        '''

        event_data = event["group_data"]

        await self.send_message(message_to_self=event_data, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)
        
    async def interaction(self, event):
        '''
        subject sends an interaction
        '''
        player_id = self.session_players_local[event["player_key"]]["id"]

        source_player = self.world_state_local['session_players'][str(player_id)]

        result = {"source_player_id": player_id, "value" : "success"}

        if source_player['interaction'] == 0:
            result["value"] = "fail"
            result["error_message"] = "No interaction in progress."
        
        if result["value"] != "fail":

            target_player_id = source_player['tractor_beam_target']
            target_player = self.world_state_local['session_players'][str(target_player_id)]

            interaction = event["message_text"]["interaction"]

            result = await sync_to_async(sync_interaction)(self.session_id, player_id, target_player_id, interaction["direction"], interaction["amount"])

            if result["value"] != "fail":

                #clear status
                source_player['interaction'] = 0
                target_player['interaction'] = 0

                source_player['frozen'] = False
                target_player['frozen'] = False

                source_player["cool_down"] = self.parameter_set_local["cool_down_length"]
                target_player["cool_down"] = self.parameter_set_local["cool_down_length"]

                source_player['tractor_beam_target'] = None

                source_player["inventory"][result["period"]] = result["source_player_inventory"]
                target_player["inventory"][result["period"]] = result["target_player_inventory"]

                await Session.objects.filter(id=self.session_id).aupdate(world_state=self.world_state_local)

            await SessionEvent.objects.acreate(session_id=self.session_id, 
                                        type="interaction",
                                        period_number=self.world_state_local["current_period"],
                                        time_remaining=self.world_state_local["time_remaining"],
                                        data={"interaction" : interaction, "result":result})
        
        await self.send_message(message_to_self=None, message_to_group=result,
                                message_type=event['type'], send_to_client=False, send_to_group=True)

    async def update_interaction(self, event):
        '''
        subject send an interaction update
        '''

        event_data = event["group_data"]

        await self.send_message(message_to_self=event_data, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)
    
    async def cancel_interaction(self, event):
        '''
        subject transfers tokens
        '''
        player_id = self.session_players_local[event["player_key"]]["id"]

        source_player = self.world_state_local['session_players'][str(player_id)]

        if source_player['interaction'] == 0:
            return
        
        target_player_id = source_player['tractor_beam_target']
        target_player = self.world_state_local['session_players'][str(target_player_id)]

        source_player['interaction'] = 0
        target_player['interaction'] = 0

        source_player['frozen'] = False
        target_player['frozen'] = False

        source_player['tractor_beam_target'] = None

        await Session.objects.filter(id=self.session_id).aupdate(world_state=self.world_state_local)

        await SessionEvent.objects.acreate(session_id=self.session_id, 
                                        type="cancel_interaction",
                                        period_number=self.world_state_local["current_period"],
                                        time_remaining=self.world_state_local["time_remaining"],
                                        data={"player_id" : player_id, "target_player_id":target_player_id})

        result = {"source_player_id" : player_id, "target_player_id" : target_player_id, "value" : "success"}
        
        await self.send_message(message_to_self=None, message_to_group=result,
                                message_type=event['type'], send_to_client=False, send_to_group=True)

    async def update_cancel_interaction(self, event):
        '''
        subject transfers tokens update
        '''
        event_data = event["group_data"]

        await self.send_message(message_to_self=event_data, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)
        

#sync companion functions
def sync_collect_token(session_id, period_id, token_id, player_id):
    '''
    syncronous collect token transaction
    '''

    # world_state_filter=f"world_state__tokens__{period_id}__{token_id}__status"
    
    with transaction.atomic():
    
        session = Session.objects.select_for_update().get(id=session_id)

        if session.world_state['tokens'][str(period_id)][str(token_id)]['status'] != 'available':
            return False

        session.world_state['tokens'][str(period_id)][str(token_id)]['status'] = 'waiting'
        session.save()

    return True

def sync_interaction(session_id, source_player_id, target_player_id, direction, amount):
    '''
    syncronous interaction transaction
    '''

    # world_state_filter=f"world_state__tokens__{period_id}__{token_id}__status"
    
    result = {"value" : "success"}
    result["source_player_id"] = source_player_id
    result["target_player_id"] = target_player_id

    with transaction.atomic():
    
        session = Session.objects.select_for_update().get(id=session_id)

        source_player = session.world_state['session_players'][str(source_player_id)]
        target_player = session.world_state['session_players'][str(target_player_id)]

        current_period_id = str(session.get_current_session_period().id)

        if direction == 'take':
            #take from target
            if target_player["inventory"][current_period_id] < amount:
                result["value"] = "fail"
                result["error_message"] = "They do not have enough tokens."
                return result
            else:
                target_player["inventory"][current_period_id] -= amount
                source_player["inventory"][current_period_id] += amount

                result["target_player_change"] = f"-{amount}"
                result["source_player_change"] = f"+{amount}"             
        else:
            #give to target
            if source_player["inventory"][current_period_id] < amount:
                result["value"] = "fail"
                result["error_message"] = "You do not have enough tokens."
                return result
            else:
                source_player["inventory"][current_period_id] -= amount
                target_player["inventory"][current_period_id] += amount

                result["source_player_change"] = f"-{amount}"
                result["target_player_change"] = f"+{amount}"
                
        session.save()

    result["source_player_inventory"] = source_player["inventory"][current_period_id]
    result["target_player_inventory"] = target_player["inventory"][current_period_id]

    result["period"] = current_period_id
    result["direction"] = direction

    return result
                                      
    

                                
        

