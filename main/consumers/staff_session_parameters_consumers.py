'''
websocket session list
'''
from decimal import Decimal, DecimalException

from asgiref.sync import sync_to_async

import json
import logging

from django.core.exceptions import ObjectDoesNotExist
from django.core.serializers.json import DjangoJSONEncoder

from main.consumers import SocketConsumerMixin
from main.consumers import StaffSubjectUpdateMixin

from main.forms import SessionForm
from main.forms import ParameterSetForm
from main.forms import parameter_set_player_form

from main.models import Session
from main.models import ParameterSetPlayer

import main

class StaffSessionParametersConsumer(SocketConsumerMixin, StaffSubjectUpdateMixin):
    '''
    websocket session list
    '''    

    async def get_session(self, event):
        '''
        return a list of sessions
        '''
        logger = logging.getLogger(__name__) 
        logger.info(f"Get Session {event}")

        #build response
        message_data = {}
        message_data["session"] = await get_session(event["message_text"]["session_id"])

        message = {}
        message["message_type"] = event["type"]
        message["message_data"] = message_data

        # Send message to WebSocket
        await self.send(text_data=json.dumps({'message': message,}, cls=DjangoJSONEncoder))
    
    async def update_parameter_set(self, event):
        '''
        update a parameterset
        '''
        #build response
        message_data = {}
        message_data["status"] = await sync_to_async(take_update_parameter_set)(event["message_text"])
        message_data["session"] = await get_session(event["message_text"]["session_id"])

        message = {}
        message["message_type"] = "update_parameter_set"
        message["message_data"] = message_data

        # Send message to WebSocket
        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))

    async def update_parameter_set_player(self, event):
        '''
        update a parameterset player
        '''

        message_data = {}
        message_data["status"] = await sync_to_async(take_update_parameter_set_player)(event["message_text"])
        message_data["session"] = await get_session(event["message_text"]["session_id"])

        message = {}
        message["message_type"] = "update_parameter_set_player"
        message["message_data"] = message_data

        # Send message to WebSocket
        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder)) 

    async def remove_parameterset_player(self, event):
        '''
        remove a parameterset player
        '''

        message_data = {}
        message_data["status"] = await sync_to_async(take_remove_parameterset_player)(event["message_text"])
        message_data["session"] = await get_session(event["message_text"]["session_id"])

        message = {}
        message["message_type"] = "remove_parameterset_player"
        message["message_data"] = message_data

        # Send message to WebSocket
        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))   
    
    async def add_parameterset_player(self, event):
        '''
        add a parameterset player
        '''

        message_data = {}
        message_data["status"] = await sync_to_async(take_add_parameterset_player)(event["message_text"])
        message_data["session"] = await get_session(event["message_text"]["session_id"])

        message = {}
        message["message_type"] = "add_parameterset_player"
        message["message_data"] = message_data

        # Send message to WebSocket
        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))

    async def import_parameters(self, event):
        '''
        import parameters from another session
        '''
        #update subject count
        message_data = {}
        message_data["status"] = await sync_to_async(take_import_parameters)(event["message_text"])

        message_data["session"] = await get_session(event["message_text"]["session_id"])

        message = {}
        message["message_type"] = "import_parameters"
        message["message_data"] = message_data

        # Send message to WebSocket
        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))
    
    async def download_parameters(self, event):
        '''
        download parameters to a file
        '''
        #download parameters to a file
        message = {}
        message["message_type"] = "download_parameters"
        message["message_data"] = await sync_to_async(take_download_parameters)(event["message_text"])

        # Send message to WebSocket
        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))

    #consumer updates
    async def update_connection_status(self, event):
        '''
        handle connection status update from group member
        '''
        # logger = logging.getLogger(__name__) 
        # logger.info("Connection update")

#local sync functions
@sync_to_async
def get_session(id_):
    '''
    return session with specified id
    param: id_ {int} session id
    '''
    session = None
    logger = logging.getLogger(__name__)

    try:        
        session = Session.objects.get(id=id_)
        return session.json()
    except ObjectDoesNotExist:
        logger.warning(f"get_session session, not found: {id_}")
        return {}
        
def take_update_parameter_set(data):
    '''
    update parameterset
    '''   

    logger = logging.getLogger(__name__) 
    logger.info(f"Update parameters: {data}")

    session_id = data["session_id"]
    form_data = data["form_data"]

    try:        
        session = Session.objects.get(id=session_id)
    except ObjectDoesNotExist:
        logger.warning(f"take_update_take_update_parameter_set session, not found ID: {session_id}")
        return
    
    form_data_dict = form_data
    form_data_dict["instruction_set"] = form_data_dict["instruction_set"]["id"]

    # for field in form_data:            
    #     form_data_dict[field["name"]] = field["value"]

    form = ParameterSetForm(form_data_dict, instance=session.parameter_set)

    if form.is_valid():
        #print("valid form")                
        form.save()    
        session.parameter_set.update_json_local()

        return {"value" : "success"}                      
                                
    logger.info("Invalid paramterset form")
    return {"value" : "fail", "errors" : dict(form.errors.items())}

def take_update_parameter_set_player(data):
    '''
    update parameterset player
    '''   
    logger = logging.getLogger(__name__) 
    logger.info(f"Update parameterset player: {data}")

    session_id = data["session_id"]
    paramterset_player_id = data["paramterset_player_id"]
    form_data = data["form_data"]

    try:        
        parameter_set_player = ParameterSetPlayer.objects.get(id=paramterset_player_id)
    except ObjectDoesNotExist:
        logger.warning(f"take_update_parameter_set_player parameterset_player, not found ID: {paramterset_player_id}")
        return
    
    form_data_dict = form_data

    # for field in form_data:            
    #     form_data_dict[field["name"]] = field["value"]

    logger.info(f'form_data_dict : {form_data_dict}')

    form = parameter_set_player_form(form_data_dict, instance=parameter_set_player)

    if form.is_valid():
        #print("valid form")             
        form.save()              
        parameter_set_player.update_json_local()

        return {"value" : "success"}                      
                                
    logger.info("Invalid parameterset player form")
    return {"value" : "fail", "errors" : dict(form.errors.items())}

def take_remove_parameterset_player(data):
    '''
    remove the specifed parmeterset player
    '''
    logger = logging.getLogger(__name__) 
    logger.info(f"Remove parameterset player: {data}")

    session_id = data["session_id"]
    paramterset_player_id = data["paramterset_player_id"]

    try:        
        session = Session.objects.get(id=session_id)
        session.parameter_set.parameter_set_players.get(id=paramterset_player_id).delete()
        session.update_player_count()
    except ObjectDoesNotExist:
        logger.warning(f"take_remove_parameterset_player paramterset_player, not found ID: {paramterset_player_id}")
        return
    
    return {"value" : "success"}

def take_add_parameterset_player(data):
    '''
    add a new parameter player to the parameter set
    '''
    logger = logging.getLogger(__name__) 
    logger.info(f"Add parameterset player: {data}")

    session_id = data["session_id"]

    try:        
        session = Session.objects.get(id=session_id)
    except ObjectDoesNotExist:
        logger.warning(f"take_update_take_update_parameter_set session, not found ID: {session_id}")
        return

    session.parameter_set.add_new_player()

    session.update_player_count()
    
def take_import_parameters(data):
    '''
    import parameters from another session
    '''   
    logger = logging.getLogger(__name__) 
    logger.info(f"Import parameters: {data}")

    session_id = data["session_id"]
    form_data = data["form_data"]
    
    form_data_dict = form_data

    if not form_data_dict["session"]:
        return {"status" : "fail", "message" :  "Invalid session."}

    # for field in form_data:            
    #     form_data_dict[field["name"]] = field["value"]

    source_session = Session.objects.get(id=form_data_dict["session"])
    target_session = Session.objects.get(id=session_id)

    status = target_session.parameter_set.from_dict(source_session.parameter_set.json()) 
    target_session.update_player_count()

    return status      

    # return {"value" : "fail" if "Failed" in message else "success",
    #         "message" : message}

def take_download_parameters(data):
    '''
    download parameters to a file
    '''   
    logger = logging.getLogger(__name__) 
    logger.info(f"Download parameters: {data}")

    session_id = data["session_id"]

    session = Session.objects.get(id=session_id)
   
    return {"status" : "success", "parameter_set":session.parameter_set.json()}                      
