import logging
import re

from django.contrib.auth.models import User
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

        result = await sync_to_async(take_update_session_form, thread_sensitive=self.thread_sensitive)(self.session_id, event["message_text"])

        await self.send_message(message_to_self=result, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)
    
    async def remove_collaborator(self, event):
        '''
        remove collaborator from session
        '''

        user = self.scope["user"]
        session = await Session.objects.prefetch_related("creator").aget(id=self.session_id)

        #only creator can remove collaborators
        if session.creator != user:
            return

        message = event["message_text"]

        await session.collaborators.aremove(message["collaborator_id"])
        # await session.asave()

        collaborators = {str(i.id):i.email async for i in session.collaborators.all()}

        result = {"status":"success", 
                  "collaborators" : collaborators,
                  "collaborators_order" : [i for i in collaborators],}

        await self.send_message(message_to_self=result, message_to_group=None,
                                message_type="add_collaborators", send_to_client=True, send_to_group=False)
    
    async def add_collaborators(self, event):
        '''
        add collaborators to session
        '''

        user = self.scope["user"]
        session = await Session.objects.prefetch_related("creator").aget(id=self.session_id)

        #only creator can add collaborators
        if session.creator != user:
            return

        message = event["message_text"]

        status = "success"
        error_message = ""

        raw_list = message["csv_data"]

        raw_list = raw_list.splitlines()

        for i in range(len(raw_list)):
            raw_list[i] = re.split(r',|\t', raw_list[i])
        
        email_list = []

        for i in raw_list:
            for j in i:
                if "@" in j:
                    email_list.append(j)
                elif j == "":
                    pass
                else:
                    status = "fail"
                    error_message = f"Invalid email address: {j}"

        if status == "success":
            u_list = []
            for i in email_list:
                try:
                    u = await User.objects.aget(email=i)
                    u_list.append(u.id)
                except ObjectDoesNotExist:
                    status = "fail"
                    error_message = f"User not found: {i}"
                    break

            if status == "success":
                await session.collaborators.aadd(*u_list)

                collaborators = {str(i.id):i.email async for i in session.collaborators.all()}

                result = {"status":"success", 
                          "collaborators" : collaborators,
                          "collaborators_order" : [i for i in collaborators],}

        if status == "fail":
            result = {"status":"fail", "error_message" : error_message}

        await self.send_message(message_to_self=result, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)
        
    async def lock_session(self, event):
        '''
        lock session
        '''

        user = self.scope["user"]
        session = await Session.objects.prefetch_related("creator").aget(id=self.session_id)

        #only creator can add collaborators
        if session.creator != user:
            return

        session.locked = not session.locked
        await session.asave()

        result = {"status":"success", "locked":session.locked}
        
        await self.send_message(message_to_self=result, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)

def take_update_session_form(session_id, data):
    '''
    take session form data and update session or return errors
    param: data {json} incoming form and session data
    '''

    logger = logging.getLogger(__name__)
    # logger.info(f'take_update_session_form: {data}')

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
                                
    logger.warning("Invalid session form")
    return {"status":"fail", "errors":dict(form.errors.items())}