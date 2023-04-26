
import logging

from asgiref.sync import sync_to_async

from django.db import transaction
from django.db.models.fields.json import KT

from main.models import SessionPlayer
from main.models import Session

from datetime import datetime, timedelta

class SubjectUpdatesMixin():
    '''
    subject updates mixin for staff session consumer
    '''

    async def update_chat(self, event):
        '''
        send chat to clients, if clients can view it
        '''
        event_data = event["staff_data"]

        await self.send_message(message_to_self=event_data, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)

    async def update_connection_status(self, event):
        '''
        handle connection status update from group member
        '''
        event_data = event["data"]

        #update not from a client
        if event_data["value"] == "fail":
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
        
    async def update_target_location_update(self, event):
        '''
        update target location from subject screen
        '''

        logger = logging.getLogger(__name__)
        
        event_data = event["staff_data"]
        
        self.world_state_local["session_players"][str(event_data["session_player_id"])]["target_location"] = event_data["target_location"]

        last_update = datetime.strptime(self.world_state_local["last_update"], "%Y-%m-%d %H:%M:%S.%f")
        dt_now = datetime.now()

        if dt_now - last_update > timedelta(seconds=1):
            # logger.info("updating world state")
            self.world_state_local["last_update"] = str(dt_now)
            await Session.objects.filter(id=self.session_id).aupdate(world_state=self.world_state_local)
        
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
        result = await SessionPlayer.objects.values('id').aget(player_key=event["player_key"])
        player_id = result['id']

        if not await sync_to_async(sync_collect_token)(self.session_id, period_id, token_id, player_id):
            logger.warning(f'collect_token: {message_text}, token {token_id} not available')
            return
        
        self.world_state_local['tokens'][str(period_id)][str(token_id)]['status'] = player_id

        await Session.objects.filter(id=self.session_id).aupdate(world_state=self.world_state_local)
        
        # stored_world_state = result['world_state']
        
        # token = stored_world_state['tokens'][str(period_id)][str(token_id)]

        # if token['status'] != 'available':
        #     logger.warning(f'collect_token: {message_text}, token {token} not available')
        #     return
        
        # variable_column = 'name'
        # search_type = 'contains'
        # filter = variable_column + '__' + search_type
        # info=members.filter(**{ filter:  })
        
        # await Session.objects.filter(id=self.session_id)
        #                      .filter(world_state__tokens__1__1__status="available")
        #             .aupdate(world_state=self.world_state_local)

        result = {"token_id" : token_id, "period_id" : period_id, "player_id" : player_id}

        await self.send_message(message_to_self=None, message_to_group=result,
                                message_type=event['type'], send_to_client=False, send_to_group=True)


    async def update_collect_token(self, event):
        '''
        subject collects token update
        '''
        event_data = event["group_data"]

        await self.send_message(message_to_self=event_data, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)
        

#sync companion functions
def sync_collect_token(session_id, period_id, token_id, player_id):
    '''
    syncronous collect token
    '''

    # world_state_filter=f"world_state__tokens__{period_id}__{token_id}__status"
    
    with transaction.atomic():
    
        session = Session.objects.select_for_update().get(id=session_id)

        if session.world_state['tokens'][str(period_id)][str(token_id)]['status'] != 'available':
            return False

        session.world_state['tokens'][str(period_id)][str(token_id)]['status'] = 'waiting'
        session.save()

    return True
                                      
    

                                
        

