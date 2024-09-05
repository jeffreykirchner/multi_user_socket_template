'''
websocket instruction list
'''
from asgiref.sync import sync_to_async
from asgiref.sync import sync_to_async

import logging

from .. import SocketConsumerMixin
from .send_message_mixin import SendMessageMixin

from main.forms import InstructionSetForm

import main

from main.models import InstructionSet

# from main.globals import create_new_instruction_parameterset

class StaffInstructionEditConsumer(SocketConsumerMixin,
                                   SendMessageMixin):
    '''
    websocket instruction list
    '''    
    
    async def update_instruction_set(self, event):
        '''
        update instruction set
        '''
        logger = logging.getLogger(__name__) 

        self.user = self.scope["user"]
        message_text = event["message_text"]
        form_data_dict = message_text["form_data"]

        result = await take_update_instruction_set(form_data_dict)

        await self.send_message(message_to_self=result, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)
        
    async def get_instruction_set(self, event):
        '''
        return a list of instructions
        '''
        logger = logging.getLogger(__name__) 
        #logger.info(f"Get instructions {event}")   

        self.user = self.scope["user"]
        message_text = event["message_text"] 

        #build response
        instruction_set = await InstructionSet.objects.aget(id=message_text['id'])

        result = {'instruction_set': await instruction_set.ajson()}

        await self.send_message(message_to_self=result, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)
   
    async def update_connection_status(self, event):
        '''
        handle connection status update from group member
        '''
        # logger = logging.getLogger(__name__) 
        # logger.info("Connection update")

@sync_to_async        
def take_update_instruction_set(form_data_dict):

    instruction_set = InstructionSet.objects.get(id=form_data_dict['id'])
    form = InstructionSetForm(form_data_dict, instance=instruction_set)

    if form.is_valid():              
        form.save()    
        
        return {"value" : "success",
                "instruction_set": instruction_set.json()}
    
    return {"value" : "fail", 
            "errors" : dict(form.errors.items())}