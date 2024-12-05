import logging

from datetime import datetime
from asgiref.sync import sync_to_async

from django.core.exceptions import ObjectDoesNotExist
from django.core.cache import cache

from main.models import Session

class GetSessionMixin():
    '''
    Get session mixin for staff session consumer
    '''

    async def get_session(self, event):
        '''
        return the session
        '''

        logger = logging.getLogger(__name__)
        # logger.info(f"get_session, thread sensitive {self.thread_sensitive}")

        self.connection_uuid = event["message_text"]["session_key"]
        self.connection_type = "staff"

        # cache.delete(f"session_{self.session_id}")
        result = cache.get(f"session_{self.session_id}")

        if result is None:
            result = await sync_to_async(take_get_session, thread_sensitive=self.thread_sensitive)(self.connection_uuid)       

        self.world_state_local = result["world_state"]
        self.session_players_local = {}
        
        if self.controlling_channel == self.channel_name and result["started"]:
            self.world_state_local["timer_history"].append({"time": datetime.now().strftime("%Y-%m-%dT%H:%M:%S.%f"),
                                                            "count": 0})
            await self.store_world_state(force_store=True)

        for p in result["session_players"]:
            session_player = result["session_players"][p]
            self.session_players_local[str(session_player["player_key"])] = {"id" : p}

        self.session_id = result["id"]
        self.parameter_set_local = result["parameter_set"]

        await self.send_message(message_to_self=result, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)
        
#local sync functions    
def take_get_session(session_key):
    '''
    return session with specified id
    param: session_key {uuid} session uuid
    '''
    session = None
    logger = logging.getLogger(__name__)

    try:        
        session = Session.objects.get(session_key=session_key)
        return session.json()
    except ObjectDoesNotExist:
        logger.warning(f"staff get_session session, not found: {session_key}")
        return {}