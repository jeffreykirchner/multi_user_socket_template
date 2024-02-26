import logging

from asgiref.sync import sync_to_async

from django.core.exceptions import ObjectDoesNotExist

from main.models import Session
from main.models import ParameterSetGroup

from main.forms import ParameterSetGroupForm

from ..session_parameters_consumer_mixins.get_parameter_set import take_get_parameter_set

class ParameterSetGroupsMixin():
    '''
    parameter set group mixin
    '''

    async def update_parameter_set_group(self, event):
        '''
        update a parameterset group
        '''

        message_data = {}
        message_data["status"] = await take_update_parameter_set_group(event["message_text"])
        message_data["parameter_set"] = await take_get_parameter_set(event["message_text"]["session_id"])

        await self.send_message(message_to_self=message_data, message_to_group=None,
                                message_type="update_parameter_set", send_to_client=True, send_to_group=False)

    async def remove_parameterset_group(self, event):
        '''
        remove a parameterset group
        '''

        message_data = {}
        message_data["status"] = await take_remove_parameterset_group(event["message_text"])
        message_data["parameter_set"] = await take_get_parameter_set(event["message_text"]["session_id"])

        await self.send_message(message_to_self=message_data, message_to_group=None,
                                message_type="update_parameter_set", send_to_client=True, send_to_group=False)
    
    async def add_parameterset_group(self, event):
        '''
        add a parameterset group
        '''

        message_data = {}
        message_data["status"] = await take_add_parameterset_group(event["message_text"])
        message_data["parameter_set"] = await take_get_parameter_set(event["message_text"]["session_id"])

        await self.send_message(message_to_self=message_data, message_to_group=None,
                                message_type="update_parameter_set", send_to_client=True, send_to_group=False)

@sync_to_async
def take_update_parameter_set_group(data):
    '''
    update parameterset group
    '''   
    logger = logging.getLogger(__name__) 
    # logger.info(f"Update parameterset group: {data}")

    session_id = data["session_id"]
    parameterset_group_id = data["parameterset_group_id"]
    form_data = data["form_data"]

    try:        
        session = Session.objects.get(id=session_id)
        parameter_set_group = ParameterSetGroup.objects.get(id=parameterset_group_id)
    except ObjectDoesNotExist:
        logger.warning(f"take_update_parameter_set_group, not found ID: {parameterset_group_id}")
        return
    
    form_data_dict = form_data

    # logger.info(f'form_data_dict : {form_data_dict}')

    form = ParameterSetGroupForm(form_data_dict, instance=parameter_set_group)
    
    if form.is_valid():         
        form.save()              
        parameter_set_group.parameter_set.update_json_fk(update_groups=True)

        return {"value" : "success"}                      
                                
    logger.warning("Invalid parameterset group form")
    return {"value" : "fail", "errors" : dict(form.errors.items())}

@sync_to_async
def take_remove_parameterset_group(data):
    '''
    remove the specifed parmeterset group
    '''
    logger = logging.getLogger(__name__) 
    # logger.info(f"Remove parameterset group: {data}")

    session_id = data["session_id"]
    parameterset_group_id = data["parameterset_group_id"]

    try:        
        session = Session.objects.get(id=session_id)
        parameter_set_group = ParameterSetGroup.objects.get(id=parameterset_group_id)
        
    except ObjectDoesNotExist:
        logger.warning(f"take_remove_parameterset_group, not found ID: {parameterset_group_id}")
        return
    
    parameter_set_group.delete()
    session.parameter_set.update_json_fk(update_groups=True)
    
    return {"value" : "success"}

@sync_to_async
def take_add_parameterset_group(data):
    '''
    add a new parameter group to the parameter set
    '''
    logger = logging.getLogger(__name__) 
    # logger.info(f"Add parameterset group: {data}")

    session_id = data["session_id"]

    try:        
        session = Session.objects.get(id=session_id)
    except ObjectDoesNotExist:
        logger.warning(f"take_add_parameterset_group session, not found ID: {session_id}")
        return {"value" : "fail"}

    parameter_set_group = ParameterSetGroup.objects.create(parameter_set=session.parameter_set)
    session.parameter_set.update_json_fk(update_groups=True)

    return {"value" : "success"}
    