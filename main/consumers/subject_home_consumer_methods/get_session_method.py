
import logging

from asgiref.sync import sync_to_async
from django.core.exceptions import  ObjectDoesNotExist

from main.models import SessionPlayer
from main.consumers.lib import register_method

__methods__ = [] # self is a DataStore
register_method = register_method(__methods__)

@register_method
async def get_session(self, event):
        '''
        return a list of sessions
        '''
        logger = logging.getLogger(__name__) 
        logger.info(f"Get Session {event}")

        self.connection_uuid = event["message_text"]["playerKey"]
        self.connection_type = "subject"

        #get session id for subject
        session_player = await SessionPlayer.objects.select_related('session').aget(player_key=self.connection_uuid)
        self.session_id = session_player.session.id
        self.session_player_id = session_player.id

        # await self.update_local_info(event)

        result = await sync_to_async(take_get_session_subject, thread_sensitive=False)(self.session_player_id)

        await self.send_message(message_to_self=result, message_to_subjects=None, message_to_staff=None, 
                                message_type=event['type'], send_to_client=True, send_to_group=False)

def take_get_session_subject(session_player_id):
    '''
    get session info for subject
    '''
    #session_id = data["session_id"]
    #uuid = data["uuid"]

    #session = Session.objects.get(id=session_id)
    try:
        session_player = SessionPlayer.objects.get(id=session_player_id)

        return {"session" : session_player.session.json_for_subject(session_player), 
                "session_player" : session_player.json() }

    except ObjectDoesNotExist:
        return {"session" : None, 
                "session_player" : None}