'''
websocket instruction list
'''
from asgiref.sync import sync_to_async
from asgiref.sync import sync_to_async

import logging
import json

from .. import SocketConsumerMixin
from .send_message_mixin import SendMessageMixin

from main.forms import InstructionSetForm
from main.forms import InstructionForm
from main.forms import ImportInstructionSetForm

import main

from main.models import InstructionSet
from main.models import Instruction

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
        
    async def add_instruction_page(self, event):
        '''
        add instruction page
        '''
        logger = logging.getLogger(__name__)
        # logger.info(f"Add instruction page {event}")

        self.user = self.scope["user"]
        message_text = event["message_text"]

        instruction_set = await InstructionSet.objects.aget(id=message_text['id'])
        instruction = await Instruction.objects.acreate(instruction_set=instruction_set, page_number=await instruction_set.instructions.acount()+1)

        event['type'] = 'get_instruction_set'
        await self.get_instruction_set(event)

    async def delete_instruction_page(self, event):
        '''
        delete instruction page
        '''
        logger = logging.getLogger(__name__)
        # logger.info(f"Delete instruction page {event}")

        self.user = self.scope["user"]
        message_text = event["message_text"]

        instruction = await Instruction.objects.aget(id=message_text['instruction_id'])

        await instruction.adelete()

        event['type'] = 'get_instruction_set'
        await self.get_instruction_set(event)

    async def update_instruction(self, event):
        '''
        update instruction
        '''
        logger = logging.getLogger(__name__) 

        self.user = self.scope["user"]
        message_text = event["message_text"]
        form_data_dict = message_text["form_data"]

        result = await take_update_instruction(form_data_dict)

        event['type'] = 'update_instruction_set'
        await self.send_message(message_to_self=result, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)
        
    async def import_instruction_set(self, event):
        '''
        import instruction set
        '''

        logger = logging.getLogger(__name__)
        logger.info(f"Import instruction set {event}")

        self.user = self.scope["user"]
        message_text = event["message_text"]
        form_data_dict = message_text["form_data"]
        target_instruction_set = message_text["instruction_set_id"]

        result = await take_import_instruction_set(form_data_dict, target_instruction_set)

        event['type'] = 'update_instruction_set'
        await self.send_message(message_to_self=result, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)
    
    async def download_instruction_set(self, event):
        '''
        download instruction set
        '''
        result = await take_download_instruction_set(event["message_text"])

        await self.send_message(message_to_self=result, message_to_group=None,
                               message_type=event['type'], send_to_client=True, send_to_group=False)

    async def upload_instruction_set(self, event):
        '''
        upload instruction set
        '''
        result = await take_upload_instruction_set(event["message_text"])

        event['type'] = 'update_instruction_set'
        await self.send_message(message_to_self=result, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)


    async def update_connection_status(self, event):
        '''
        handle connection status update from group member
        '''
        pass

@sync_to_async        
def take_update_instruction_set(form_data_dict):

    instruction_set = InstructionSet.objects.get(id=form_data_dict['id'])
    form = InstructionSetForm(form_data_dict, instance=instruction_set)

    if form.is_valid():              
        form.save()    

        for parameter_set_player in instruction_set.parameter_set_players_c.all():
            parameter_set_player.update_json_local()
        
        return {"value" : "success",
                "instruction_set": instruction_set.json()}
    
    return {"value" : "fail", 
            "errors" : dict(form.errors.items())}

@sync_to_async        
def take_update_instruction(form_data_dict):

    instruction = Instruction.objects.get(id=form_data_dict['id'])
    form = InstructionForm(form_data_dict, instance=instruction)

    if form.is_valid():              
        form.save()    
        
        return {"value" : "success",
                "instruction_set": instruction.instruction_set.json()}
    
    return {"value" : "fail", 
            "errors" : dict(form.errors.items())}

@sync_to_async
def take_import_instruction_set(form_data_dict, target_instruction_set):
    '''
    import instruction set
    '''
    
    form = ImportInstructionSetForm(form_data_dict)

    if form.is_valid():              
        try:
            source_instruction_set = form.cleaned_data['instruction_set']
            target_instruction_set = InstructionSet.objects.get(id=target_instruction_set)
        except:
            return {"value" : "fail", 
                    "errors" : {"instruction_set": ["Instruction Set not found."]}}    
        
        target_instruction_set.from_dict(source_instruction_set.json())
        target_instruction_set.copy_pages(source_instruction_set.instructions.all())
        
        return {"value" : "success",
                "instruction_set": target_instruction_set.json()}
    
    return {"value" : "fail", 
            "errors" : dict(form.errors.items())}

@sync_to_async
def take_download_instruction_set(data):
    '''
    download instruction set
    '''
    
    instruction_set = InstructionSet.objects.get(id=data['instruction_set_id'])
    
    return {"value" : "success", 
            "instruction_set": instruction_set.json()}

@sync_to_async
def take_upload_instruction_set(data):
    '''
    upload instruction set
    '''
        
    instruction_set = InstructionSet.objects.get(id=data['id'])

    instruction_set_text = json.loads(data['instruction_set_text'])
    instruction_set.from_dict(dict(instruction_set_text))
    instruction_set.copy_pages_from_dict(instruction_set_text['instruction_pages'])
    
    return {"value" : "success", 
            "instruction_set": instruction_set.json()}
    
    

    