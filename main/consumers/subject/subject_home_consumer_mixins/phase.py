import logging
import json

from asgiref.sync import sync_to_async

from main.models import Session
from main.models import SessionPlayer

class PhaseMixin():
    '''
    phase update mixin for subject home consumer
    '''

    async def update_next_phase(self, event):
        '''
        update session phase
        '''

        result = json.loads(event["group_data"])

        await self.send_message(message_to_self=result, message_to_subjects=None, message_to_staff=None, 
                                message_type=event['type'], send_to_client=True, send_to_group=False)
        
# def take_update_next_phase(session_id, session_player_id):
#     '''
#     return information about next phase of experiment
#     '''

#     logger = logging.getLogger(__name__) 

#     try:
#         session = Session.objects.get(id=session_id)
#         session_player = SessionPlayer.objects.get(id=session_player_id)


#         return {"value" : "success",
#                 "session" : session_player.session.json_for_subject(session_player),
#                 "session_player" : session_player.json(),
#                 "session_players" : {p.id : p.json_for_subject(session_player) for p in session.session_players.all()},
#                 "session_players_order" : list(session.session_players.all().values_list('id', flat=True)),}

#     except ObjectDoesNotExist:
#         logger.warning(f"take_update_next_phase: session not found, session {session_id}, session_player_id {session_player_id}")
#         return {"value" : "fail", "result" : {}, "message" : "Update next phase error"}