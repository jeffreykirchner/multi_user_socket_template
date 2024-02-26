import logging

from asgiref.sync import sync_to_async

from django.core.exceptions import ObjectDoesNotExist

from main.models import Session
from main.models import ParameterSetGround

from main.forms import ParameterSetGroundForm

from ..session_parameters_consumer_mixins.get_parameter_set import take_get_parameter_set

class ParameterSetGroundsMixin():
    '''
    parameter set grounds mixin
    '''

    async def update_parameter_set_ground(self, event):
        '''
        update a parameterset ground
        '''

        message_data = {}
        message_data["status"] = await take_update_parameter_set_ground(event["message_text"])
        message_data["parameter_set"] = await take_get_parameter_set(event["message_text"]["session_id"])

        await self.send_message(message_to_self=message_data, message_to_group=None,
                                message_type="update_parameter_set", send_to_client=True, send_to_group=False)

    async def remove_parameterset_ground(self, event):
        '''
        remove a parameterset ground
        '''

        message_data = {}
        message_data["status"] = await take_remove_parameterset_ground(event["message_text"])
        message_data["parameter_set"] = await take_get_parameter_set(event["message_text"]["session_id"])

        await self.send_message(message_to_self=message_data, message_to_group=None,
                                message_type="update_parameter_set", send_to_client=True, send_to_group=False)
    
    async def add_parameterset_ground(self, event):
        '''
        add a parameterset ground
        '''

        message_data = {}
        message_data["status"] = await take_add_parameterset_ground(event["message_text"])
        message_data["parameter_set"] = await take_get_parameter_set(event["message_text"]["session_id"])

        await self.send_message(message_to_self=message_data, message_to_group=None,
                                message_type="update_parameter_set", send_to_client=True, send_to_group=False)

@sync_to_async
def take_update_parameter_set_ground(data):
    '''
    update parameterset ground
    '''   
    logger = logging.getLogger(__name__) 
    # logger.info(f"Update parameterset ground: {data}")

    session_id = data["session_id"]
    parameterset_ground_id = data["parameterset_ground_id"]
    form_data = data["form_data"]

    try:        
        parameter_set_ground = ParameterSetGround.objects.get(id=parameterset_ground_id)
    except ObjectDoesNotExist:
        logger.warning(f"take_update_parameter_set_ground, not found ID: {parameterset_ground_id}")
        return
    
    form_data_dict = form_data

    # logger.info(f'form_data_dict : {form_data_dict}')

    form = ParameterSetGroundForm(form_data_dict, instance=parameter_set_ground)

    if form.is_valid():         
        form.save()              
        parameter_set_ground.parameter_set.update_json_fk(update_grounds=True)

        return {"value" : "success"}                      
                                
    logger.warning("Invalid parameterset ground form")
    return {"value" : "fail", "errors" : dict(form.errors.items())}

@sync_to_async
def take_remove_parameterset_ground(data):
    '''
    remove the specifed parmeterset ground
    '''
    logger = logging.getLogger(__name__) 
    # logger.info(f"Remove parameterset ground: {data}")

    session_id = data["session_id"]
    parameterset_ground_id = data["parameterset_ground_id"]

    try:        
        session = Session.objects.get(id=session_id)
        parameter_set_ground = ParameterSetGround.objects.get(id=parameterset_ground_id)
        
    except ObjectDoesNotExist:
        logger.warning(f"take_remove_parameterset_ground, not found ID: {parameterset_ground_id}")
        return
    
    parameter_set_ground.delete()
    session.parameter_set.update_json_fk(update_grounds=True)
    
    return {"value" : "success"}

@sync_to_async
def take_add_parameterset_ground(data):
    '''
    add a new parameter ground to the parameter set
    '''
    logger = logging.getLogger(__name__) 
    # logger.info(f"Add parameterset ground: {data}")

    session_id = data["session_id"]

    try:        
        session = Session.objects.get(id=session_id)
    except ObjectDoesNotExist:
        logger.warning(f"take_add_parameterset_ground session, not found ID: {session_id}")
        return {"value" : "fail"}

    parameter_set_ground = ParameterSetGround.objects.create(parameter_set=session.parameter_set)
    session.parameter_set.update_json_fk(update_grounds=True)

    return {"value" : "success"}
    
