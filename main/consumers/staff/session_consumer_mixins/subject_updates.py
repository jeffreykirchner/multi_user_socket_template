
import logging

from asgiref.sync import sync_to_async

from django.db import transaction
from django.db.models.fields.json import KT

from main.models import SessionPlayer
from main.models import Session
from main.models import SessionEvent
from django.utils.decorators import method_decorator

from datetime import datetime, timedelta

from main.globals import ExperimentPhase

import main

class SubjectUpdatesMixin():
    '''
    subject updates mixin for staff session consumer
    '''

    async def chat(self, event):
        '''
        take chat from client
        '''    
        if self.controlling_channel != self.channel_name:
            return    
       
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
                                           session_player_id=result["sender_id"],
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
            if not self.session_id:
                self.session_id = event["session_id"]

            logger.info(f"update_connection_status: event data {event}, channel name {self.channel_name}, group name {self.room_group_name}")

            if "session" in self.room_group_name:
                #connection from staff screen
                if event["connect_or_disconnect"] == "connect":
                    # session = await Session.objects.aget(id=self.session_id)
                    self.controlling_channel = event["sender_channel_name"]

                    if self.channel_name == self.controlling_channel:
                        logger.info(f"update_connection_status: controller {self.channel_name}, session id {self.session_id}")
                        await Session.objects.filter(id=self.session_id).aupdate(controlling_channel=self.controlling_channel) 
                        await self.send_message(message_to_self=None, message_to_group={"controlling_channel" : self.controlling_channel},
                                                message_type="set_controlling_channel", send_to_client=False, send_to_group=True)
                else:
                    #disconnect from staff screen
                    pass                   
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

    async def update_set_controlling_channel(self, event):
        '''
        only for subject screens
        '''
        pass

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
        if self.controlling_channel != self.channel_name:
            return
        
        # logger = logging.getLogger(__name__) 
        # logger.info(f"target_location_update: world state controller {self.controlling_channel} channel name {self.channel_name}")
        
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

            # target_locations = {}
            # current_locations = {}
            # for i in self.world_state_local["session_players"]:
            #     target_locations[i] = self.world_state_local["session_players"][i]["target_location"]
            #     current_locations[i] = self.world_state_local["session_players"][i]["current_location"]
            
            # data = {"target_locations" : target_locations, "current_locations" : current_locations}

            # await SessionEvent.objects.acreate(session_id=self.session_id, 
            #                                    session_player_id=player_id,
            #                                    type="target_locations",
            #                                    period_number=self.world_state_local["current_period"],
            #                                    time_remaining=self.world_state_local["time_remaining"],
            #                                    data=data)
        
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
        if self.controlling_channel != self.channel_name:
            return
        
        logger = logging.getLogger(__name__)

        error_message = []
        status = "success"
        
        try:
            message_text = event["message_text"]
            token_id = message_text["token_id"]
            period_id = message_text["period_id"]
            player_id = self.session_players_local[event["player_key"]]["id"]
        except:
            logger.info(f"collect_token: invalid data, {event['message_text']}")
            status = "fail"
            error_message.append({"id":"collect_token", "message": "Invalid data, try again."})
        
        if status == "success":
            if self.world_state_local['tokens'][str(period_id)][str(token_id)]['status'] != 'available':
                status = "fail"
                error_message.append({"id":"collect_token", "message": "Token already collected."})
        
        result = {"status" :status, "error_message" : error_message}

        if status == "success":
            self.world_state_local['tokens'][str(period_id)][str(token_id)]['status'] = player_id
            self.world_state_local['session_players'][str(player_id)]['inventory'][str(period_id)]+=1

            inventory = self.world_state_local['session_players'][str(player_id)]['inventory'][str(period_id)]

            await Session.objects.filter(id=self.session_id).aupdate(world_state=self.world_state_local)

            result["token_id"] = token_id
            result["period_id"] = period_id
            result["player_id"] = player_id
            result["inventory"] = inventory

            await SessionEvent.objects.acreate(session_id=self.session_id,
                                            session_player_id=player_id, 
                                            type="collect_token",
                                            period_number=self.world_state_local["current_period"],
                                            time_remaining=self.world_state_local["time_remaining"],
                                            data=result)

       
                 
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
        if self.controlling_channel != self.channel_name:
            return

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

        result = {"player_id" : player_id, "target_player_id" : target_player_id}

        await Session.objects.filter(id=self.session_id).aupdate(world_state=self.world_state_local)

        await SessionEvent.objects.acreate(session_id=self.session_id, 
                                           session_player_id=player_id,
                                           type="tractor_beam",
                                           period_number=self.world_state_local["current_period"],
                                           time_remaining=self.world_state_local["time_remaining"],
                                           data=result)

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
        if self.controlling_channel != self.channel_name:
            return
        
        logger = logging.getLogger(__name__)
        
        error_message = []
        status = "success"
        
        try:
            player_id = self.session_players_local[event["player_key"]]["id"]
            source_player = self.world_state_local['session_players'][str(player_id)]

            interaction = event["message_text"]["interaction"]
            direction = interaction["direction"]
            amount = interaction["amount"]
        except:
            logger.info(f"interaction: invalid data, {event['message_text']}")
            status = "fail"
            error_message.append({"id":"interaction", "message": "Invalid data, try again."})

        if status == "success":
            if source_player['interaction'] == 0:
                status = "fail"
                error_message = "No interaction in progress."
        
        result = {"source_player_id": player_id}

        if status != "fail":

            target_player_id = source_player['tractor_beam_target']
            target_player = self.world_state_local['session_players'][str(target_player_id)]

            # result = await sync_to_async(sync_interaction)(self.session_id, player_id, target_player_id, interaction["direction"], interaction["amount"])

            source_player = self.world_state_local['session_players'][str(player_id)]
            target_player = self.world_state_local['session_players'][str(target_player_id)]

            session = await Session.objects.aget(id=self.session_id)
            current_session = await session.aget_current_session_period()
            current_period_id = str(current_session.id)

            if direction == 'take':
                #take from target
                if target_player["inventory"][current_period_id] < amount:
                    status = "fail"
                    error_message = "They do not have enough tokens."
                else:
                    target_player["inventory"][current_period_id] -= amount
                    source_player["inventory"][current_period_id] += amount

                    result["target_player_change"] = f"-{amount}"
                    result["source_player_change"] = f"+{amount}"             
            else:
                #give to target
                if source_player["inventory"][current_period_id] < amount:
                    status = "fail"
                    error_message = "You do not have enough tokens."
                else:
                    source_player["inventory"][current_period_id] -= amount
                    target_player["inventory"][current_period_id] += amount

                    result["source_player_change"] = f"-{amount}"
                    result["target_player_change"] = f"+{amount}"

        result["status"] = status
        result["error_message"] = error_message

        if status != "fail":

            result["source_player_inventory"] = source_player["inventory"][current_period_id]
            result["target_player_inventory"] = target_player["inventory"][current_period_id]

            result["period"] = current_period_id
            result["direction"] = direction
            result["target_player_id"] = target_player_id

            #clear status
            source_player['interaction'] = 0
            target_player['interaction'] = 0

            source_player['frozen'] = False
            target_player['frozen'] = False

            source_player["cool_down"] = self.parameter_set_local["cool_down_length"]
            target_player["cool_down"] = self.parameter_set_local["cool_down_length"]

            source_player['tractor_beam_target'] = None

            await Session.objects.filter(id=self.session_id).aupdate(world_state=self.world_state_local)

            await SessionEvent.objects.acreate(session_id=self.session_id, 
                                               session_player_id=player_id,
                                               type="interaction",
                                               period_number=self.world_state_local["current_period"],
                                               time_remaining=self.world_state_local["time_remaining"],
                                               data=result)
        
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
        if self.controlling_channel != self.channel_name:
            return
        
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

        result = {"source_player_id" : player_id, "target_player_id" : target_player_id, "value" : "success"}

        await SessionEvent.objects.acreate(session_id=self.session_id, 
                                           session_player_id=player_id,
                                           type="cancel_interaction",
                                           period_number=self.world_state_local["current_period"],
                                           time_remaining=self.world_state_local["time_remaining"],
                                           data=result)

        await self.send_message(message_to_self=None, message_to_group=result,
                                message_type=event['type'], send_to_client=False, send_to_group=True)

    async def update_cancel_interaction(self, event):
        '''
        subject transfers tokens update
        '''
        event_data = event["group_data"]

        await self.send_message(message_to_self=event_data, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)
                                      
    

                                
        

