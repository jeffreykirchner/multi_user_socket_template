import logging

from asgiref.sync import sync_to_async

from django.core.exceptions import ObjectDoesNotExist

from main.models import Session
from main.models import ParameterSetBarrier

from main.forms import ParameterSetBarrierForm

from ..session_parameters_consumer_mixins.get_parameter_set import take_get_parameter_set

class ParameterSetBarriersMixin():
    '''
    parameter set plaeyer mixin
    '''

    async def update_parameter_set_barrier(self, event):
        '''
        update a parameterset barrier
        '''

        message_data = {}
        message_data["status"] = await take_update_parameter_set_barrier(event["message_text"])
        message_data["parameter_set"] = await take_get_parameter_set(event["message_text"]["session_id"])

        await self.send_message(message_to_self=message_data, message_to_group=None,
                                message_type="update_parameter_set", send_to_client=True, send_to_group=False)

    async def remove_parameterset_barrier(self, event):
        '''
        remove a parameterset barrier
        '''

        message_data = {}
        message_data["status"] = await take_remove_parameterset_barrier(event["message_text"])
        message_data["parameter_set"] = await take_get_parameter_set(event["message_text"]["session_id"])

        await self.send_message(message_to_self=message_data, message_to_group=None,
                                message_type="update_parameter_set", send_to_client=True, send_to_group=False)
    
    async def add_parameterset_barrier(self, event):
        '''
        add a parameterset barrier
        '''

        message_data = {}
        message_data["status"] = await take_add_parameterset_barrier(event["message_text"])
        message_data["parameter_set"] = await take_get_parameter_set(event["message_text"]["session_id"])

        await self.send_message(message_to_self=message_data, message_to_group=None,
                                message_type="update_parameter_set", send_to_client=True, send_to_group=False)

@sync_to_async
def take_update_parameter_set_barrier(data):
    '''
    update parameterset barrier
    '''   
    logger = logging.getLogger(__name__) 
    # logger.info(f"Update parameterset barrier: {data}")

    session_id = data["session_id"]
    parameterset_barrier_id = data["parameterset_barrier_id"]
    form_data = data["form_data"]

    try:        
        session = Session.objects.get(id=session_id)
        parameter_set_barrier = ParameterSetBarrier.objects.get(id=parameterset_barrier_id)
    except ObjectDoesNotExist:
        logger.warning(f"take_update_parameter_set_barrier parameterset_barrier, not found ID: {parameterset_barrier_id}")
        return
    
    form_data_dict = form_data

    # logger.info(f'form_data_dict : {form_data_dict}')

    form = ParameterSetBarrierForm(form_data_dict, instance=parameter_set_barrier)
    form.fields["parameter_set_groups"].queryset = session.parameter_set.parameter_set_groups.all()
    form.fields["parameter_set_players"].queryset = session.parameter_set.parameter_set_players.all()

    if form.is_valid():         
        form.save()              
        parameter_set_barrier.parameter_set.update_json_fk(update_barriers=True)

        return {"value" : "success"}                      
                                
    logger.warning("Invalid parameterset barrier form")
    return {"value" : "fail", "errors" : dict(form.errors.items())}

@sync_to_async
def take_remove_parameterset_barrier(data):
    '''
    remove the specifed parmeterset barrier
    '''
    logger = logging.getLogger(__name__) 
    # logger.info(f"Remove parameterset barrier: {data}")

    session_id = data["session_id"]
    parameterset_barrier_id = data["parameterset_barrier_id"]

    try:        
        session = Session.objects.get(id=session_id)
        parameter_set_barrier = ParameterSetBarrier.objects.get(id=parameterset_barrier_id)
        
    except ObjectDoesNotExist:
        logger.warning(f"take_remove_parameterset_barrier, not found ID: {parameterset_barrier_id}")
        return
    
    parameter_set_barrier.delete()
    session.parameter_set.update_json_fk(update_barriers=True)
    
    return {"value" : "success"}

@sync_to_async
def take_add_parameterset_barrier(data):
    '''
    add a new parameter barrier to the parameter set
    '''
    logger = logging.getLogger(__name__) 
    # logger.info(f"Add parameterset barrier: {data}")

    session_id = data["session_id"]

    try:        
        session = Session.objects.get(id=session_id)
    except ObjectDoesNotExist:
        logger.warning(f"take_add_parameterset_barrier session, not found ID: {session_id}")
        return {"value" : "fail"}

    parameter_set_barrier = ParameterSetBarrier.objects.create(parameter_set=session.parameter_set)
    session.parameter_set.update_json_fk(update_barriers=True)

    return {"value" : "success"}
    
