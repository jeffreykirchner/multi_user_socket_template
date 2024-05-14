import logging
import re
import json

from asgiref.sync import sync_to_async

from django.urls import reverse
from django.db.utils import IntegrityError
from django.core.exceptions import ObjectDoesNotExist

from main.models import Session
from main.models import Parameters

from main.forms import StaffEditNameEtcForm

from main.globals import send_mass_email_service

class SubjectControlsMixin():
    '''
    subject controls mixin for staff session consumer
    '''

    async def update_subject(self, event):
        '''
        update subject
        '''

        result = await sync_to_async(take_update_subject, thread_sensitive=self.thread_sensitive)(self.session_id, event["message_text"])

        await self.send_message(message_to_self=result, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)
    
    async def email_list(self, event):
        '''
        take email list
        '''

        result = await sync_to_async(take_email_list, thread_sensitive=self.thread_sensitive)(self.session_id, event["message_text"])

        await self.send_message(message_to_self=result, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)
    
    async def send_invitations(self, event):
        '''
        send invitations to subjects
        '''

        result = await sync_to_async(take_send_invitations, thread_sensitive=self.thread_sensitive)(self.session_id, event["message_text"])

        await self.send_message(message_to_self=result, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)

    async def anonymize_data(self, event):
        '''
        send invitations to subjects
        '''

        result = await sync_to_async(take_anonymize_data, thread_sensitive=self.thread_sensitive)(self.session_id,  event["message_text"])

        #update all 
        await self.send_message(message_to_self=None, message_to_group=result,
                                message_type=event['type'], send_to_client=False, send_to_group=True)
    
    async def update_anonymize_data(self, event):
        '''
        send anonymize data update to staff sessions
        '''

        event_data = json.loads(event["group_data"])

        await self.send_message(message_to_self=event_data, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)
    
    async def rescue_subject(self, event):
        '''
        move subject back to their starting position

        '''

        logger = logging.getLogger(__name__) 
        # logger.info(f"target_location_update: world state controller {self.controlling_channel} channel name {self.channel_name}")
                
        event_data =  event["message_text"]

        try:
            player_id = event_data["player_id"]            
        except KeyError:
            logger.warning(f"update_rescue_subject: invalid player, {event['message_text']}")
            return
            # result = {"value" : "fail", "result" : {"message" : "Invalid location."}}


        session_player = self.world_state_local["session_players"][str(player_id)]
        parameter_set_player = self.parameter_set_local["parameter_set_players"][str(session_player["parameter_set_player_id"])]

        session_player["current_location"] = {"x" : parameter_set_player["start_x"], "y" : parameter_set_player["start_y"]}
        session_player["target_location"] = session_player["current_location"]
        
        result = {"value" : "success", 
                  "new_location" : session_player["current_location"], 
                  "player_id" : player_id}
        
        await self.send_message(message_to_self=None, message_to_group=result,
                                message_type=event['type'], send_to_client=False, send_to_group=True)

    async def update_rescue_subject(self, event):
        '''
        move subject back to their starting position
        '''

        event_data = json.loads(event["group_data"])

        await self.send_message(message_to_self=event_data, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)
        

def take_update_subject(session_id, data):
    '''
    take update subject info from staff screen
    param: data {json} incoming form and session data
    '''

    logger = logging.getLogger(__name__)
    # logger.info(f'take_update_subject: {data}')

    #session_id = data["session_id"]
    form_data = dict(data["form_data"])

    try:        
        session = Session.objects.get(id=session_id)
    except ObjectDoesNotExist:
        logger.warning(f"take_update_session_form session, not found: {session_id}")
        return {"status":"fail", "message":"session not found"}

    form = StaffEditNameEtcForm(form_data)

    if form.is_valid():

        session_player = session.session_players.get(id=form_data["id"])
        session_player.name = form.cleaned_data["name"]
        session_player.student_id = form.cleaned_data["student_id"]
        session_player.email = form.cleaned_data["email"]
        
        try:
            session_player.save()              
        except IntegrityError as e:
            return {"value":"fail", "errors" : {f"email":["Email must be unique within session."]}}  

        return {"value":"success", "session_player" : session_player.json()}                      
                                
    logger.warning("Invalid session form")
    return {"status":"fail", "errors":dict(form.errors.items())}

def take_send_invitations(session_id, data):
    '''
    send login link to subjects in session
    '''
    logger = logging.getLogger(__name__)
    # logger.info(f'take_send_invitations: {session_id} {data}')

    try:        
        session = Session.objects.get(id=session_id)
    except ObjectDoesNotExist:
        logger.warning(f"take_send_invitations session, not found: {session_id}")
        return {"status":"fail", "result":"session not found"}

    p = Parameters.objects.first()
    message = data["form_data"]

    session.invitation_text =  message["text"]
    session.invitation_subject =  message["subject"]
    session.save()

    message_text = message["text"]
    message_text = message_text.replace("[contact email]", p.contact_email)

    user_list = []
    for session_subject in session.session_players.exclude(email=None).exclude(email=""):
        user_list.append({"email" : session_subject.email,
                          "variables": [{"name" : "log in link",
                                         "text" : p.site_url + reverse('subject_home', kwargs={'player_key': session_subject.player_key})
                                        }] 
                         })

    memo = f'Trade Steal: Session {session_id}, send invitations'

    result = send_mass_email_service(user_list, session.invitation_subject, message_text , message_text, memo)

    return {"value" : "success",
            "result" : {"email_result" : result,
                        "invitation_subject" : session.invitation_subject,
                        "invitation_text" : session.invitation_text }}

def take_email_list(session_id, data):
    '''
    take uploaded csv server from list and load emails into session players
    '''

    logger = logging.getLogger(__name__)
    # logger.info(f'take_email_list: {session_id} {data}')

    try:        
        session = Session.objects.get(id=session_id)
    except ObjectDoesNotExist:
        logger.warning(f"take_send_invitations session, not found: {session_id}")
        return {"value":"fail", "result":"session not found"}
    
    raw_list = data["csv_data"]

    raw_list = raw_list.splitlines()

    for i in range(len(raw_list)):
        raw_list[i] =  re.split(r',|\t', raw_list[i])
    
    u_list = []

    if not session.parameter_set.prolific_mode:
        for i in raw_list:
            for j in i:
                if "@" in j:
                    u_list.append(j)
        
        if len(u_list)>0:
            session.session_players.update(email=None)

        for i in u_list:
            p = session.session_players.filter(email=None).first()

            if(p):
                p.email = i
                p.save()
            else:
                break
    else:
        for i in raw_list:
            for j in i:
                u_list.append(j)

        if len(u_list)>0:
            session.session_players.update(student_id="")
        
        for i in u_list:
            p = session.session_players.filter(student_id='').first()

            if(p):
                p.student_id = i
                p.save()
            else:
                break
    
    result = []
    for p in session.session_players.all():
        result.append({"id" : p.id, "email" : p.email,  "student_id" : p.student_id})

    return {"value" : "success", "result" : {"session":session.json()}}

def take_anonymize_data(session_id, data):
    '''
    remove name, email and student id from the data
    '''

    logger = logging.getLogger(__name__)
    # logger.info(f'take_email_list: {session_id} {data}')

    try:        
        session = Session.objects.get(id=session_id)
    except ObjectDoesNotExist:
        logger.warning(f"take_anonymize_data session, not found: {session_id}")
        return {"value":"fail", "result":"session not found"}

    result = {}

    session.session_players.all().update(name="---", student_id="---", email="")

    result = session.session_players.all().values('id', 'name', 'student_id', 'email')
    
    return {"value" : "success",
            "result" : list(result)}

    
