
import json
import logging

from asgiref.sync import sync_to_async

from django.core.serializers.json import DjangoJSONEncoder
from django.core.exceptions import ObjectDoesNotExist

from main.models import  HelpDocs

import main

class StaffSubjectUpdateMixin():
    '''
    shared functionallity across all consumers
    '''

    connection_type = None            #staff or subject
    connection_uuid = None            #uuid of connected object   
    session_id = None                 #id of session    
    
    async def help_doc(self, event):
        '''
        help doc request
        '''
        result = await sync_to_async(take_help_doc)(event["message_text"])

        message_data = {}
        message_data["status"] = result

        message = {}
        message["message_type"] = event["type"]
        message["message_data"] = message_data

        # Send reply to sending channel
        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))

def take_help_doc(data):
    '''
    help doc text request
    '''

    logger = logging.getLogger(__name__) 
    logger.info(f"Take help doc: {data}")

    try:
        help_doc = HelpDocs.objects.get(title=data["title"])
    except ObjectDoesNotExist:
        logger.warning(f"take_help_doc not found : {data}")
        return {"value" : "fail", "message" : "Document Not Found."}

    return {"value" : "success",
            "result" : {"help_doc" : help_doc.json()}}


    
