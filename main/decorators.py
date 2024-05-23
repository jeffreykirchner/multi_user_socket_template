import logging

from django.core.exceptions import PermissionDenied
from django.core.exceptions import ObjectDoesNotExist

from main.models import Session
from main.models import SessionPlayer

from channels.db import database_sync_to_async

def user_is_owner(function):
    def wrap(request, *args, **kwargs):      
        logger = logging.getLogger(__name__) 
        logger.info(f"user_is_owner {args} {kwargs}")

        session = Session.objects.only("creator","collaborators").get(id=kwargs['pk'])

        if request.user == session.creator or \
           request.user.is_superuser or \
           request.user in session.collaborators.all() :

            return function(request, *args, **kwargs)
        else:
            raise PermissionDenied

    return wrap

def user_is_super(function):
    def wrap(request, *args, **kwargs):      
        
        if request.user.is_superuser:
            return function(request, *args, **kwargs)
        else:
            raise PermissionDenied

    return wrap

def check_sesison_started_ws(function):

    async def wrap(self, *args, **kwargs):      
    
        session_started = await database_sync_to_async(get_session_started)(self.session_player_id)

        if session_started:
            return await function(self, *args, **kwargs)
        else:
            logger = logging.getLogger(__name__) 
            logger.warning("check_sesison_started_ws: session not started")
            return
    
    def get_session_started(session_player_id):
        try:
            session_player = SessionPlayer.objects.get(id=session_player_id)  

            return session_player.session.started
        except ObjectDoesNotExist :
            logger = logging.getLogger(__name__) 
            logger.warn(f"get_session_started: Session not found")
            return False

    return wrap

def check_message_for_me(function):
    async def wrap(self, *args, **kwargs):      
        #logger = logging.getLogger(__name__) 
        #logger.info(f"check_message_for_me {args} {kwargs}")

        target_list = args[0].get('target_list', None)

        if target_list:
            #logger.info(f"check_message_for_me target list found")
            if self.session_player_id in target_list:
                #logger.info(f"check_message_for_me target in list")
                return await function(self, *args, **kwargs)
            else:
                #logger.info(f"check_message_for_me target not in list")
                return
            
        return await function(self, *args, **kwargs)

    return wrap