
import logging
import sys

from asgiref.sync import sync_to_async
from django.core.exceptions import  ObjectDoesNotExist

from main.models import SessionPlayer

class GetSessionMixin():
    '''
    Get session mixin for subject home consumer
    '''
    async def get_session(self, event):
            '''
            return a list of sessions
            '''
            logger = logging.getLogger(__name__) 
            # logger.info(f"Get Session {event}, thread sensitive {self.thread_sensitive}")

            self.connection_uuid = event["message_text"]["player_key"]
            self.connection_type = "subject"

            #get session id for subject
            try:
                session_player = await SessionPlayer.objects.select_related('session').aget(player_key=self.connection_uuid)
                self.session_id = session_player.session.id
                self.session_player_id = session_player.id
                self.controlling_channel =  session_player.session.controlling_channel
            except ObjectDoesNotExist:
                result = {"session" : None, "session_player" : None}
            else:        
                result = await sync_to_async(take_get_session_subject, thread_sensitive=self.thread_sensitive)(self.session_player_id)                

            await self.send_message(message_to_self=result, message_to_subjects=None, message_to_staff=None, 
                                    message_type=event['type'], send_to_client=True, send_to_group=False)
    
    async def update_start_experiment(self, event):
        '''
        start experiment on subjects
        '''
        
        result = await sync_to_async(take_get_session_subject, thread_sensitive=self.thread_sensitive)(self.session_player_id)

        await self.send_message(message_to_self=result, message_to_subjects=None, message_to_staff=None, 
                                message_type=event['type'], send_to_client=True, send_to_group=False)
    
    async def update_reset_experiment(self, event):
        '''
        reset experiment on subjects
        '''

        #get session json object
        result = await sync_to_async(take_get_session_subject, thread_sensitive=self.thread_sensitive)(self.session_player_id)

        await self.send_message(message_to_self=result, message_to_subjects=None, message_to_staff=None, 
                                message_type=event['type'], send_to_client=True, send_to_group=False)
        
    async def update_refresh_screens(self, event):
        '''
        refresh staff screen
        '''
        result = await sync_to_async(take_get_session_subject, thread_sensitive=self.thread_sensitive)(self.session_player_id)

        await self.send_message(message_to_self=result, message_to_subjects=None, message_to_staff=None, 
                                message_type=event['type'], send_to_client=True, send_to_group=False)

def take_get_session_subject(session_player_id):
    '''
    get session info for subject
    '''

    logger = logging.getLogger(__name__) 
    # logger.info(f'take_get_session_subject: id {session_player_id}')

    try:
        session_player = SessionPlayer.objects.get(id=session_player_id)

        return {"session" : session_player.session.json_for_subject(session_player), 
                "session_player" : session_player.json(),
                "value" : "success"}

    except ObjectDoesNotExist:
        return {"session" : None, 
                "session_player" : None,
                "value" : "fail"}