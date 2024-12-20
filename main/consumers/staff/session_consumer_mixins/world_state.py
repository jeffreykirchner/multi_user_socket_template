import logging

from datetime import datetime, timedelta

from django.core.cache import cache

from main.models import Session

class WorldStateMixin():
    '''
    world state mixin for staff session consumer
    '''

    async def store_world_state(self, force_store=False):
        '''
        update the world state
        '''

        if self.controlling_channel != self.channel_name:
            return

        logger = logging.getLogger(__name__)
        dt_now = datetime.now()

        #only store if at least 1 second has passed since last store
        if not force_store:
            last_store = self.world_state_local.get("last_store", None)

            if not last_store:
                return
            
            if isinstance(last_store, str):
                last_store = datetime.fromisoformat(last_store)

            if dt_now - last_store < timedelta(seconds=1):
                return
        
        self.world_state_local["last_store"] = dt_now

        #update cache
        # c = cache.get(f"session_{self.session_id}")
        # if c:
        #     c["world_state"] = self.world_state_local
        # else:
        #     logger.warning(f"store_world_state, session {self.session_id} not found in cache")

        # cache.set(f"session_{self.session_id}", c)

        #update database
        await Session.objects.filter(id=self.session_id).aupdate(world_state=self.world_state_local)

        #logger.info(f"store_world_state, session {self.session_id} updated")

       