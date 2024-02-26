import logging

from asgiref.sync import sync_to_async

from django.core.exceptions import ObjectDoesNotExist

from main.models import Session
from main.models import ParameterSetNotice

from main.forms import ParameterSetNoticeForm

from ..session_parameters_consumer_mixins.get_parameter_set import take_get_parameter_set

class ParameterSetNoticesMixin():
    '''
    parameter set plaeyer mixin
    '''

    async def update_parameter_set_notice(self, event):
        '''
        update a parameterset notice
        '''

        message_data = {}
        message_data["status"] = await take_update_parameter_set_notice(event["message_text"])
        message_data["parameter_set"] = await take_get_parameter_set(event["message_text"]["session_id"])

        await self.send_message(message_to_self=message_data, message_to_group=None,
                                message_type="update_parameter_set", send_to_client=True, send_to_group=False)

    async def remove_parameterset_notice(self, event):
        '''
        remove a parameterset notice
        '''

        message_data = {}
        message_data["status"] = await take_remove_parameterset_notice(event["message_text"])
        message_data["parameter_set"] = await take_get_parameter_set(event["message_text"]["session_id"])

        await self.send_message(message_to_self=message_data, message_to_group=None,
                                message_type="update_parameter_set", send_to_client=True, send_to_group=False)
    
    async def add_parameterset_notice(self, event):
        '''
        add a parameterset notice
        '''

        message_data = {}
        message_data["status"] = await take_add_parameterset_notice(event["message_text"])
        message_data["parameter_set"] = await take_get_parameter_set(event["message_text"]["session_id"])

        await self.send_message(message_to_self=message_data, message_to_group=None,
                                message_type="update_parameter_set", send_to_client=True, send_to_group=False)

@sync_to_async
def take_update_parameter_set_notice(data):
    '''
    update parameterset notice
    '''   
    logger = logging.getLogger(__name__) 
    # logger.info(f"Update parameterset notice: {data}")

    session_id = data["session_id"]
    parameterset_notice_id = data["parameterset_notice_id"]
    form_data = data["form_data"]

    try:        
        parameter_set_notice = ParameterSetNotice.objects.get(id=parameterset_notice_id)
    except ObjectDoesNotExist:
        logger.warning(f"take_update_parameter_set_notice parameterset_notice, not found ID: {parameterset_notice_id}")
        return
    
    form_data_dict = form_data

    # logger.info(f'form_data_dict : {form_data_dict}')

    form = ParameterSetNoticeForm(form_data_dict, instance=parameter_set_notice)

    if form.is_valid():         
        form.save()              
        parameter_set_notice.parameter_set.update_json_fk(update_notices=True)

        return {"value" : "success"}                      
                                
    logger.warning("Invalid parameterset notice form")
    return {"value" : "fail", "errors" : dict(form.errors.items())}

@sync_to_async
def take_remove_parameterset_notice(data):
    '''
    remove the specifed parmeterset notice
    '''
    logger = logging.getLogger(__name__) 
    # logger.info(f"Remove parameterset notice: {data}")

    session_id = data["session_id"]
    parameterset_notice_id = data["parameterset_notice_id"]

    try:        
        session = Session.objects.get(id=session_id)
        parameter_set_notice = ParameterSetNotice.objects.get(id=parameterset_notice_id)
        
    except ObjectDoesNotExist:
        logger.warning(f"take_remove_parameterset_notice, not found ID: {parameterset_notice_id}")
        return
    
    parameter_set_notice.delete()
    session.parameter_set.update_json_fk(update_notices=True)
    
    return {"value" : "success"}

@sync_to_async
def take_add_parameterset_notice(data):
    '''
    add a new parameter notice to the parameter set
    '''
    logger = logging.getLogger(__name__) 
    # logger.info(f"Add parameterset notice: {data}")

    session_id = data["session_id"]

    try:        
        session = Session.objects.get(id=session_id)
    except ObjectDoesNotExist:
        logger.warning(f"take_add_parameterset_notice session, not found ID: {session_id}")
        return {"value" : "fail"}

    parameter_set_notice = ParameterSetNotice.objects.create(parameter_set=session.parameter_set)
    session.parameter_set.update_json_fk(update_notices=True)

    return {"value" : "success"}
    
