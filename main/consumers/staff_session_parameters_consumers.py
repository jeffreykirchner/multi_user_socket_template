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
from main.forms import ParameterSetPlayerForm

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
        message_data["session"] = await get_session(event["message_text"]["sessionID"])

        message = {}
        message["messageType"] = event["type"]
        message["messageData"] = message_data

        # Send message to WebSocket
        await self.send(text_data=json.dumps({'message': message,}, cls=DjangoJSONEncoder))
    
    async def update_parameterset(self, event):
        '''
        update a parameterset
        '''
        #build response
        message_data = {}
        message_data["status"] = await sync_to_async(take_update_parameterset)(event["message_text"])
        message_data["session"] = await get_session(event["message_text"]["sessionID"])

        message = {}
        message["messageType"] = "update_parameterset"
        message["messageData"] = message_data

        # Send message to WebSocket
        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))

    async def update_parameterset_type(self, event):
        '''
        update a parameterset type
        '''

        message_data = {}
        message_data["status"] = await sync_to_async(take_update_parameterset_type)(event["message_text"])
        message_data["session"] = await get_session(event["message_text"]["sessionID"])

        message = {}
        message["messageType"] = "update_parameterset_type"
        message["messageData"] = message_data

        # Send message to WebSocket
        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))
    
    async def update_parameterset_good(self, event):
        '''
        update a parameterset good
        '''

        message_data = {}
        message_data["status"] = await sync_to_async(take_update_parameterset_good)(event["message_text"])
        message_data["session"] = await get_session(event["message_text"]["sessionID"])

        message = {}
        message["messageType"] = "update_parameterset_good"
        message["messageData"] = message_data

        # Send message to WebSocket
        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))

    async def update_parameterset_player(self, event):
        '''
        update a parameterset player
        '''

        message_data = {}
        message_data["status"] = await sync_to_async(take_update_parameterset_player)(event["message_text"])
        message_data["session"] = await get_session(event["message_text"]["sessionID"])

        message = {}
        message["messageType"] = "update_parameterset_player"
        message["messageData"] = message_data

        # Send message to WebSocket
        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder)) 

    async def remove_parameterset_player(self, event):
        '''
        remove a parameterset player
        '''

        message_data = {}
        message_data["status"] = await sync_to_async(take_remove_parameterset_player)(event["message_text"])
        message_data["session"] = await get_session(event["message_text"]["sessionID"])

        message = {}
        message["messageType"] = "remove_parameterset_player"
        message["messageData"] = message_data

        # Send message to WebSocket
        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))   
    
    async def add_parameterset_player(self, event):
        '''
        add a parameterset player
        '''

        message_data = {}
        message_data["status"] = await sync_to_async(take_add_paramterset_player)(event["message_text"])
        message_data["session"] = await get_session(event["message_text"]["sessionID"])

        message = {}
        message["messageType"] = "add_parameterset_player"
        message["messageData"] = message_data

        # Send message to WebSocket
        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))
    
    async def update_parameterset_player_group(self, event):
        '''
        update a parameterset group
        '''

        message_data = {}
        message_data["status"] = await sync_to_async(take_update_parameterset_player_group)(event["message_text"])
        message_data["session"] = await get_session(event["message_text"]["sessionID"])

        message = {}
        message["messageType"] = "update_parameterset_player_group"
        message["messageData"] = message_data

        # Send message to WebSocket
        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder)) 
    
    async def copy_group_forward(self, event):
        '''
        copy groupds forward from the specified period
        '''
        message_data = {}
        message_data["status"] = await sync_to_async(take_copy_groups_forward)(event["message_text"])
        message_data["session"] = await get_session(event["message_text"]["sessionID"])

        message = {}
        message["messageType"] = "copy_group_forward"
        message["messageData"] = message_data

        # Send message to WebSocket
        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder)) 

    async def import_parameters(self, event):
        '''
        import parameters from another session
        '''
        #update subject count
        message_data = {}
        message_data["status"] = await sync_to_async(take_import_parameters)(event["message_text"])

        message_data["session"] = await get_session(event["message_text"]["sessionID"])

        message = {}
        message["messageType"] = "import_parameters"
        message["messageData"] = message_data

        # Send message to WebSocket
        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))
    
    async def download_parameters(self, event):
        '''
        download parameters to a file
        '''
        #download parameters to a file
        message = {}
        message["messageType"] = "download_parameters"
        message["messageData"] = await sync_to_async(take_download_parameters)(event["message_text"])

        # Send message to WebSocket
        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))

    async def update_parameterset_avatar(self, event):
        '''
        update a parameterset avatar
        '''

        message_data = {}
        message_data["status"] = await sync_to_async(take_update_parameterset_avatar)(event["message_text"])
        #message_data["session"] = await get_session(event["message_text"]["sessionID"])

        message = {}
        message["messageType"] = "update_parameterset_avatar"
        message["messageData"] = message_data

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
        
def take_update_parameterset(data):
    '''
    update parameterset
    '''   

    logger = logging.getLogger(__name__) 
    logger.info(f"Update parameters: {data}")

    session_id = data["sessionID"]
    form_data = data["formData"]

    try:        
        session = Session.objects.get(id=session_id)
    except ObjectDoesNotExist:
        logger.warning(f"take_update_take_update_parameterset session, not found ID: {session_id}")
        return
    
    form_data_dict = {}

    for field in form_data:            
        form_data_dict[field["name"]] = field["value"]

    form = ParameterSetForm(form_data_dict, instance=session.parameter_set)

    if form.is_valid():
        #print("valid form")                
        form.save()    

        return {"value" : "success"}                      
                                
    logger.info("Invalid paramterset form")
    return {"value" : "fail", "errors" : dict(form.errors.items())}

def take_update_parameterset_type(data):
    '''
    update parameterset type
    '''   

    logger = logging.getLogger(__name__) 
    logger.info(f"Update parameterset type: {data}")

    session_id = data["sessionID"]
    paramterset_type_id = data["parameterset_type_id"]
    form_data = data["formData"]

    try:        
        parameter_set_type = ParameterSetType.objects.get(id=paramterset_type_id)
    except ObjectDoesNotExist:
        logger.warning(f"take_update_parameterset_type paramterset_type, not found ID: {paramterset_type_id}")
        return
    
    form_data_dict = {}

    for field in form_data:            
        form_data_dict[field["name"]] = field["value"]

    form = ParameterSetTypeForm(form_data_dict, instance=parameter_set_type)

    if form.is_valid():
        #print("valid form")             
        form.save()              

        return {"value" : "success"}                      
                                
    logger.info("Invalid parameterset type form")
    return {"value" : "fail", "errors" : dict(form.errors.items())}

def take_update_parameterset_good(data):
    '''
    update parameterset good
    '''   

    logger = logging.getLogger(__name__) 
    logger.info(f"Update parameterset good: {data}")

    session_id = data["sessionID"]
    parameterset_good_id = data["parameterset_good_id"]
    form_data = data["formData"]

    try:        
        parameter_set_good = ParameterSetGood.objects.get(id=parameterset_good_id)
    except ObjectDoesNotExist:
        logger.warning(f"take_update_parameterset_good paramterset_good, not found ID: {parameterset_good_id}")
        return
    
    form_data_dict = {}

    for field in form_data:            
        form_data_dict[field["name"]] = field["value"]

    form = ParameterSetGoodForm(form_data_dict, instance=parameter_set_good)

    if form.is_valid():
        #print("valid form")             
        form.save()              

        return {"value" : "success"}                      
                                
    logger.info("Invalid parameterset good form")
    return {"value" : "fail", "errors" : dict(form.errors.items())}

def take_update_parameterset_player(data):
    '''
    update parameterset player
    '''   
    logger = logging.getLogger(__name__) 
    logger.info(f"Update parameterset player: {data}")

    session_id = data["sessionID"]
    paramterset_player_id = data["paramterset_player_id"]
    form_data = data["formData"]

    try:        
        parameter_set_player = ParameterSetPlayer.objects.get(id=paramterset_player_id)
    except ObjectDoesNotExist:
        logger.warning(f"take_update_parameterset_type paramterset_player, not found ID: {paramterset_player_id}")
        return
    
    form_data_dict = {}

    for field in form_data:            
        form_data_dict[field["name"]] = field["value"]

    logger.info(f'form_data_dict : {form_data_dict}')

    form = ParameterSetPlayerForm(form_data_dict, instance=parameter_set_player)

    if form.is_valid():
        #print("valid form")             
        form.save()              

        return {"value" : "success"}                      
                                
    logger.info("Invalid parameterset player form")
    return {"value" : "fail", "errors" : dict(form.errors.items())}

def take_update_parameterset_player_group(data):
    '''
    update parameterset player group
    '''   
    logger = logging.getLogger(__name__) 
    logger.info(f"Update parameterset player group: {data}")

    session_id = data["sessionID"]
    paramterset_player_group_id = data["paramterset_player_group_id"]
    form_data = data["formData"]

    try:        
        parameter_set_player_group = ParameterSetPlayerGroup.objects.get(id=paramterset_player_group_id)
    except ObjectDoesNotExist:
        logger.warning(f"take_update_parameterset_type paramterset_type, not found ID: {paramterset_player_group_id}")
        return
    
    form_data_dict = {}

    for field in form_data:            
        form_data_dict[field["name"]] = field["value"]

    logger.info(f'form_data_dict : {form_data_dict}')

    form = ParameterSetPlayerGroupForm(form_data_dict, instance=parameter_set_player_group)

    if form.is_valid():
        #print("valid form")             
        form.save()              

        return {"value" : "success"}                      
                                
    logger.info("Invalid parameterset player group form")
    return {"value" : "fail", "errors" : dict(form.errors.items())}

def take_remove_parameterset_player(data):
    '''
    remove the specifed parmeterset player
    '''
    logger = logging.getLogger(__name__) 
    logger.info(f"Remove parameterset player: {data}")

    session_id = data["sessionID"]
    paramterset_player_id = data["paramterset_player_id"]

    try:        
        session = Session.objects.get(id=session_id)
        session.parameter_set.parameter_set_players.get(id=paramterset_player_id).delete()
        session.update_player_count()
    except ObjectDoesNotExist:
        logger.warning(f"take_remove_parameterset_player paramterset_player, not found ID: {paramterset_player_id}")
        return
    
    return {"value" : "success"}

def take_add_paramterset_player(data):
    '''
    add a new parameter player to the parameter set
    '''
    logger = logging.getLogger(__name__) 
    logger.info(f"Add parameterset player: {data}")

    session_id = data["sessionID"]

    try:        
        session = Session.objects.get(id=session_id)
    except ObjectDoesNotExist:
        logger.warning(f"take_update_take_update_parameterset session, not found ID: {session_id}")
        return

    session.parameter_set.add_new_player()

    session.update_player_count()

def take_copy_groups_forward(data):
    '''
    copy groups forward from the specified period
    '''   
    logger = logging.getLogger(__name__) 
    logger.info(f"Copy groups forward: {data}")

    session_id = data["sessionID"]
    period_number = data["period_number"]

    try:        
        session = Session.objects.get(id=session_id)
    except ObjectDoesNotExist:
        logger.warning(f"take_copy_groups_forward, session not found ID: {session_id}")
        return

    session.parameter_set.copy_groups_forward(period_number)
    
def take_import_parameters(data):
    '''
    import parameters from another session
    '''   
    logger = logging.getLogger(__name__) 
    logger.info(f"Import parameters: {data}")

    session_id = data["sessionID"]
    form_data = data["formData"]
    
    form_data_dict = {}

    for field in form_data:            
        form_data_dict[field["name"]] = field["value"]

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

    session_id = data["sessionID"]

    session = Session.objects.get(id=session_id)
   
    return {"status" : "success", "parameter_set":session.parameter_set.json()}                      

def take_update_parameterset_avatar(data):
    '''
    update parameterset avatar
    '''   

    logger = logging.getLogger(__name__) 
    logger.info(f"Update parameterset avatar: {data}")

    session_id = data["sessionID"]
    parameterset_avatar_id = data["parameterset_avatar_id"]
    form_data = data["formData"]

    try:        
        parameter_set_avatar = ParameterSetAvatar.objects.get(id=parameterset_avatar_id)
    except ObjectDoesNotExist:
        logger.warning(f"take_update_parameterset_good paramterset_avatar, not found ID: {parameterset_avatar_id}")
        return
    
    form_data_dict = {}

    for field in form_data:            
        form_data_dict[field["name"]] = field["value"]

    form = ParameterSetAvatarForm(form_data_dict, instance=parameter_set_avatar)

    if form.is_valid():
        #print("valid form")             
        form.save()              

        return {"value" : "success", "result" : parameter_set_avatar.parameter_set.json()}                      
                                
    logger.info("Invalid parameterset avatar form")
    return {"value" : "fail", "errors" : dict(form.errors.items())}