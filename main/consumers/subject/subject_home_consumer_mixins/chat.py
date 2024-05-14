
import logging
import json
from textwrap import TextWrapper

from asgiref.sync import sync_to_async

from django.core.serializers.json import DjangoJSONEncoder

from main.models import Session
from main.models import SessionPlayer

from main.globals import ChatTypes
from main.decorators import check_message_for_me

import main

class ChatMixin():
    '''
    Get chat mixin for subject home consumer
    '''
    async def chat(self, event):
        '''
        take chat handled by staff consumer
        '''        
        pass

    @check_message_for_me
    async def update_chat(self, event):
        '''
        send chat to clients, if clients can view it
        '''
        event_data = json.loads(event["group_data"])
        
        #format text for chat bubbles
        # wrapper = TextWrapper(width=15, max_lines=6)
        # event_data['text'] = wrapper.fill(text=event_data['text'])

        await self.send_message(message_to_self=event_data, message_to_subjects=None, message_to_staff=None, 
                                message_type=event['type'], send_to_client=True, send_to_group=False)
