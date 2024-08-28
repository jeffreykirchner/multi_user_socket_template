'''
websocket instructions list
'''
from asgiref.sync import sync_to_async
from asgiref.sync import sync_to_async

import logging

from .. import SocketConsumerMixin
from .send_message_mixin import SendMessageMixin


import main

from main.models import InstructionSet

# from main.globals import create_new_instructions_parameterset

class StaffInstructionsConsumer(SocketConsumerMixin,
                                SendMessageMixin):
    '''
    websocket instructions list
    '''    
    
    async def delete_instructions(self, event):
        '''
        delete specified instructions
        '''
        logger = logging.getLogger(__name__) 
        # logger.info(f"Delete instructions {event}")

        self.user = self.scope["user"]
        # logger.info(f"User {self.user}")

        message_text = event["message_text"]

        status = await sync_to_async(delete_instructions)(message_text["id"], self.user)

        # logger.info(f"Delete instructions success: {status}")

        #build response
        result = await sync_to_async(get_instructions_list_json)(self.user)

        await self.send_message(message_to_self=result, message_to_group=None,
                                message_type='get_instructionss', send_to_client=True, send_to_group=False)

    async def create_instructions(self, event):
        '''
        create a new instructions
        '''
        logger = logging.getLogger(__name__) 
        #logger.info(f"Create instructions {event}")

        self.user = self.scope["user"]
        #logger.info(f"User {self.user}")

        await sync_to_async(create_new_instructions)(self.user)
        
        #build response
        result = await sync_to_async(get_instructions_list_json)(self.user)

        await self.send_message(message_to_self=result, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)
    
    async def get_instructions(self, event):
        '''
        return a list of instructionss
        '''
        logger = logging.getLogger(__name__) 
        #logger.info(f"Get instructionss {event}")   

        self.user = self.scope["user"]
        #logger.info(f"User {self.user}")     

        #build response

        instructions = {}
        async for i in InstructionSet.objects.values('id', 'label').order_by('label'):
            instructions[i['id']] = {'label':i['label'],
                                     'id':i['id']}

        result = {'instructions': instructions}

        await self.send_message(message_to_self=result, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)
    

    async def get_instructionss_admin(self, event):
        '''
        return a list of all instructionss
        '''
        logger = logging.getLogger(__name__) 
        #logger.info(f"Get instructionss Admin {event}")   

        self.user = self.scope["user"]
        #logger.info(f"User {self.user}")     

        #build response
        result = await sync_to_async(get_instructions_list_admin_json)(self.user)

        await self.send_message(message_to_self=result, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)
   
    async def update_connection_status(self, event):
        '''
        handle connection status update from group member
        '''
        # logger = logging.getLogger(__name__) 
        # logger.info("Connection update")