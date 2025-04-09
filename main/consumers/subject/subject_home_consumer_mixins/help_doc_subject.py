import logging
import json

from asgiref.sync import sync_to_async

from django.core.serializers.json import DjangoJSONEncoder

from main.models import Session
from main.models import SessionPlayer
from main.models import SessionEvent

import main

class GetHelpDocSubjectMixin():
    '''
    Get help doc subject mixin for subject home consumer
    '''
    async def help_doc_subject(self, event):
        '''
        take help doc request
        '''        

        try:
            message_text = event["message_text"]
            title = message_text["title"]

            session_player = await SessionPlayer.objects.select_related('parameter_set_player__instruction_set','session').aget(player_key=self.connection_uuid)
            instruction_set = session_player.parameter_set_player.instruction_set
            help_doc_subject = await instruction_set.help_docs_subject.all().aget(title=title)
            text =  await sync_to_async(session_player.process_instruction_text, thread_sensitive=False)(help_doc_subject.text)

        except Exception as e:
            text = "Help doc not found"

        await SessionEvent.objects.acreate(session_id=session_player.session.id, 
                                           session_player_id=session_player.id,
                                           type="help_doc",
                                           period_number=session_player.session.world_state["current_period"],
                                           time_remaining=session_player.session.world_state["time_remaining"],
                                           data=title)


        result =  {"value" : "success",
                   "result" : {"text" : text}}
        
        await self.send_message(message_to_self=result, message_to_subjects=None, message_to_staff=None, 
                                message_type=event['type'], send_to_client=True, send_to_group=False)