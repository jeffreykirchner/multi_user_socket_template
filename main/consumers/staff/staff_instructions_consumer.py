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
from main.models import ParameterSetPlayer
from main.models import ParameterSet
from main.models import Session

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

        instructions = {}
        async for i in InstructionSet.objects.values('id', 'label', 'parameter_set_players_c').order_by('label'):

            parameter_set_ids = ParameterSetPlayer.objects.filter(instruction_set_id=i['id']).values_list('parameter_set_id', flat=True)
            parameter_sets = ParameterSet.objects.filter(id__in=parameter_set_ids).values_list('id', flat=True)
            sessions = Session.objects.filter(parameter_set_id__in=parameter_sets).values('id', 'title').order_by('title')

            sessions_dict = {}
            async for s in sessions:
                sessions_dict[s['id']] = s['title']

            instructions[i['id']] = {'label':i['label'],
                                     'id':i['id'],
                                     'sessions_dict' : sessions_dict}

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