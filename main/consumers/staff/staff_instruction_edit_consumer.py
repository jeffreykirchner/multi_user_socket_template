'''
websocket instruction list
'''
from asgiref.sync import sync_to_async
from asgiref.sync import sync_to_async

import logging

from .. import SocketConsumerMixin
from .send_message_mixin import SendMessageMixin


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

      
        
        result = await sync_to_async(get_instruction_list_json)(self.user)

        await self.send_message(message_to_self=result, message_to_group=None,
                                message_type='get_instructions', send_to_client=True, send_to_group=False)

    async def create_instruction(self, event):
        '''
        create a new instruction
        '''
        logger = logging.getLogger(__name__) 
        #logger.info(f"Create instruction {event}")

        self.user = self.scope["user"]
        #logger.info(f"User {self.user}")

        await sync_to_async(create_new_instruction)(self.user)
        
        #build response
        result = await sync_to_async(get_instruction_list_json)(self.user)

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
    

    async def get_instructions_admin(self, event):
        '''
        return a list of all instructions
        '''
        logger = logging.getLogger(__name__) 
        #logger.info(f"Get instructions Admin {event}")   

        self.user = self.scope["user"]
        #logger.info(f"User {self.user}")     

        #build response
        result = await sync_to_async(get_instruction_list_admin_json)(self.user)

        await self.send_message(message_to_self=result, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)
   
    async def update_connection_status(self, event):
        '''
        handle connection status update from group member
        '''
        # logger = logging.getLogger(__name__) 
        # logger.info("Connection update")