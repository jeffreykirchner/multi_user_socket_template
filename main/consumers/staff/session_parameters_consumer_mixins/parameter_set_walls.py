import logging

from asgiref.sync import sync_to_async

from django.core.exceptions import ObjectDoesNotExist

from main.models import Session
from main.models import ParameterSetWall

from main.forms import ParameterSetWallForm

from ..session_parameters_consumer_mixins.get_parameter_set import take_get_parameter_set

class ParameterSetWallsMixin():
    '''
    parameter set plaeyer mixin
    '''

    async def update_parameter_set_wall(self, event):
        '''
        update a parameterset wall
        '''

        message_data = {}
        message_data["status"] = await take_update_parameter_set_wall(event["message_text"])
        message_data["parameter_set"] = await take_get_parameter_set(event["message_text"]["session_id"])

        await self.send_message(message_to_self=message_data, message_to_group=None,
                                message_type="update_parameter_set", send_to_client=True, send_to_group=False)

    async def remove_parameterset_wall(self, event):
        '''
        remove a parameterset wall
        '''

        message_data = {}
        message_data["status"] = await take_remove_parameterset_wall(event["message_text"])
        message_data["parameter_set"] = await take_get_parameter_set(event["message_text"]["session_id"])

        await self.send_message(message_to_self=message_data, message_to_group=None,
                                message_type="update_parameter_set", send_to_client=True, send_to_group=False)
    
    async def add_parameterset_wall(self, event):
        '''
        add a parameterset wall
        '''

        message_data = {}
        message_data["status"] = await take_add_parameterset_wall(event["message_text"])
        message_data["parameter_set"] = await take_get_parameter_set(event["message_text"]["session_id"])

        await self.send_message(message_to_self=message_data, message_to_group=None,
                                message_type="update_parameter_set", send_to_client=True, send_to_group=False)

@sync_to_async
def take_update_parameter_set_wall(data):
    '''
    update parameterset wall
    '''   
    logger = logging.getLogger(__name__) 
    # logger.info(f"Update parameterset wall: {data}")

    session_id = data["session_id"]
    parameterset_wall_id = data["parameterset_wall_id"]
    form_data = data["form_data"]

    try:        
        parameter_set_wall = ParameterSetWall.objects.get(id=parameterset_wall_id)
    except ObjectDoesNotExist:
        logger.warning(f"take_update_parameter_set_wall parameterset_wall, not found ID: {parameterset_wall_id}")
        return
    
    form_data_dict = form_data

    # logger.info(f'form_data_dict : {form_data_dict}')

    form = ParameterSetWallForm(form_data_dict, instance=parameter_set_wall)

    if form.is_valid():         
        form.save()              
        parameter_set_wall.parameter_set.update_json_fk(update_walls=True)

        return {"value" : "success"}                      
                                
    logger.warning("Invalid parameterset wall form")
    return {"value" : "fail", "errors" : dict(form.errors.items())}

@sync_to_async
def take_remove_parameterset_wall(data):
    '''
    remove the specifed parmeterset wall
    '''
    logger = logging.getLogger(__name__) 
    # logger.info(f"Remove parameterset wall: {data}")

    session_id = data["session_id"]
    parameterset_wall_id = data["parameterset_wall_id"]

    try:        
        session = Session.objects.get(id=session_id)
        parameter_set_wall = ParameterSetWall.objects.get(id=parameterset_wall_id)
        
    except ObjectDoesNotExist:
        logger.warning(f"take_remove_parameterset_wall, not found ID: {parameterset_wall_id}")
        return
    
    parameter_set_wall.delete()
    session.parameter_set.update_json_fk(update_walls=True)
    
    return {"value" : "success"}

@sync_to_async
def take_add_parameterset_wall(data):
    '''
    add a new parameter wall to the parameter set
    '''
    logger = logging.getLogger(__name__) 
    # logger.info(f"Add parameterset wall: {data}")

    session_id = data["session_id"]

    try:        
        session = Session.objects.get(id=session_id)
    except ObjectDoesNotExist:
        logger.warning(f"take_add_parameterset_wall session, not found ID: {session_id}")
        return {"value" : "fail"}

    parameter_set_wall = ParameterSetWall.objects.create(parameter_set=session.parameter_set)
    session.parameter_set.update_json_fk(update_walls=True)

    return {"value" : "success"}
    
