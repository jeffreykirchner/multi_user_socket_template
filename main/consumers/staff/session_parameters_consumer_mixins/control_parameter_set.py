from asgiref.sync import sync_to_async

import json
import logging

from django.core.exceptions import ObjectDoesNotExist
from django.core.serializers.json import DjangoJSONEncoder

from .get_parameter_set import take_get_parameter_set

from main.models import Session

class ControlParameterSetMixin():
    '''
    controls for parameter set mixin
    '''

    async def import_parameters(self, event):
        '''
        import parameters from another session
        '''
        #update subject count
        message_data = {}
        message_data["status"] = await sync_to_async(take_import_parameters)(event["message_text"])
        message_data["parameter_set"] = await take_get_parameter_set(event["message_text"]["session_id"])

        await self.send_message(message_to_self=message_data, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)
    
    async def download_parameters(self, event):
        '''
        download parameters to a file
        '''
        #download parameters to a file
        result = await sync_to_async(take_download_parameters)(event["message_text"])

        await self.send_message(message_to_self=result, message_to_group=None,
                               message_type=event['type'], send_to_client=True, send_to_group=False)

def take_import_parameters(data):
    '''
    import parameters from another session
    '''   
    logger = logging.getLogger(__name__) 
    # logger.info(f"Import parameters: {data}")

    session_id = data["session_id"]
    form_data = data["form_data"]
    
    form_data_dict = form_data

    if not form_data_dict["session"]:
        return {"status" : "fail", "message" :  "Invalid session."}

    source_session = Session.objects.get(id=form_data_dict["session"])
    target_session = Session.objects.get(id=session_id)

    status = target_session.parameter_set.from_dict(source_session.parameter_set.json()) 
    target_session.update_player_count()

    return status      

def take_download_parameters(data):
    '''
    download parameters to a file
    '''   
    logger = logging.getLogger(__name__) 
    # logger.info(f"Download parameters: {data}")

    session_id = data["session_id"]

    session = Session.objects.get(id=session_id)
   
    return {"status" : "success", "parameter_set":session.parameter_set.json()}         
