import logging

from django.core.exceptions import ObjectDoesNotExist

from asgiref.sync import sync_to_async

from main.forms import SessionForm

from main.models import Session


class UpdateSessionMixin():
    '''
    Mixin for updating the session
    '''

    async def update_session(self, event):
        '''
        update session and return it
        '''

        result =  await sync_to_async(take_update_session_form, thread_sensitive=False)(self.session_id, event["message_text"])

        await self.send_message(message_to_self=result, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)

def take_update_session_form(session_id, data):
    '''
    take session form data and update session or return errors
    param: data {json} incoming form and session data
    '''

    logger = logging.getLogger(__name__)
    logger.info(f'take_update_session_form: {data}')

    form_data = data["form_data"]

    try:        
        session = Session.objects.get(id=session_id)
    except ObjectDoesNotExist:
        logger.warning(f"take_update_session_form session, not found: {session_id}")
    
    form_data_dict = form_data

    form = SessionForm(form_data_dict, instance=session)

    if form.is_valid():            
        form.save()              

        return {"status":"success", "result" : session.json()}                      
                                
    logger.info("Invalid session form")
    return {"status":"fail", "errors":dict(form.errors.items())}