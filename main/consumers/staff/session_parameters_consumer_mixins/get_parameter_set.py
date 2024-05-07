import logging

from asgiref.sync import sync_to_async

from django.core.exceptions import ObjectDoesNotExist

from main.forms import ParameterSetForm

from main.models import Session

class GetParameterSetMixin():
    '''
    mixin for parameter set
    '''

    async def get_parameter_set(self, event):
        '''
        return parameterset
        '''

        result = await take_get_parameter_set(event["message_text"]["session_id"])

        await self.send_message(message_to_self=result, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)
    
    async def update_parameter_set(self, event):
        '''
        update a parameterset
        '''
        #build response
        message_data = {}
        message_data["status"] = await take_update_parameter_set(event["message_text"])
        message_data["parameter_set"] = await take_get_parameter_set(event["message_text"]["session_id"])

        await self.send_message(message_to_self=message_data, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)

@sync_to_async
def take_get_parameter_set(id_):
    '''
    return session with specified id
    param: id_ {int} session id
    '''
    session = None
    logger = logging.getLogger(__name__)

    try:        
        session = Session.objects.get(id=id_)
        return session.parameter_set.json()
    except ObjectDoesNotExist:
        logger.warning(f"take_get_parameter_set session, not found: {id_}")
        return {}

@sync_to_async        
def take_update_parameter_set(data):
    '''
    update parameterset
    '''   

    logger = logging.getLogger(__name__) 
    # logger.info(f"Update parameters: {data}")

    session_id = data["session_id"]
    form_data = data["form_data"]

    try:        
        session = Session.objects.get(id=session_id)
    except ObjectDoesNotExist:
        logger.warning(f"take_update_take_update_parameter_set session, not found ID: {session_id}")
        return
    
    form_data_dict = form_data

    form = ParameterSetForm(form_data_dict, instance=session.parameter_set)

    if form.is_valid():              
        form.save()    
        session.parameter_set.update_json_local()

        return {"value" : "success"}                      
                                
    logger.warning("Invalid paramterset form")
    return {"value" : "fail", "errors" : dict(form.errors.items())}
