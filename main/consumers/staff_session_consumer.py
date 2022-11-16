'''
websocket session list
'''
from asgiref.sync import sync_to_async
from asgiref.sync import async_to_sync

import json
import logging
import asyncio
import re

from django.core.exceptions import ObjectDoesNotExist
from django.core.serializers.json import DjangoJSONEncoder
from django.db import transaction
from django.urls import reverse
from django.db.utils import IntegrityError
from channels.layers import get_channel_layer

from main.consumers import SocketConsumerMixin
from main.consumers import StaffSubjectUpdateMixin

from main.forms import SessionForm
from main.forms import staff_edit_name_etc_form

from main.models import Session
from main.models import Parameters

from main.globals import send_mass_email_service
from main.globals import ExperimentPhase

class StaffSessionConsumer(SocketConsumerMixin, StaffSubjectUpdateMixin):
    '''
    websocket session list
    '''    

    has_timer_control = False
    timer_running = False
        
    async def get_session(self, event):
        '''
        return a list of sessions
        '''
        # logger = logging.getLogger(__name__) 
        # logger.info(f"Get Session {event}")

        self.connection_uuid = event["message_text"]["session_key"]
        self.connection_type = "staff"

        #build response
        message_data = {}
        message_data["session"] = await sync_to_async(take_get_session)(self.connection_uuid)       

        self.session_id = message_data["session"]["id"]

        message = {}
        message["message_type"] = event["type"]
        message["message_data"] = message_data

        # Send message to WebSocket
        await self.send(text_data=json.dumps({'message': message,}, cls=DjangoJSONEncoder))
    
    async def update_session(self, event):
        '''
        return a list of sessions
        '''
        # logger = logging.getLogger(__name__) 
        # logger.info(f"Update Session: {event}")

        #build response
        message_data = {}
        message_data =  await sync_to_async(take_update_session_form)(self.session_id, event["message_text"])

        message = {}
        message["message_type"] = event["type"]
        message["message_data"] = message_data

        # Send message to WebSocket
        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))

    async def start_experiment(self, event):
        '''
        start experiment
        '''
        message_data = {}
        message_data["status"] = await sync_to_async(take_start_experiment)(self.session_id, event["message_text"])

        message = {}
        message["message_type"] = event["type"]
        message["message_data"] = message_data

        #Send message to staff page
        if message_data["status"]["value"] == "fail":
            await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))
        else:
            #send message to client pages
            await self.channel_layer.group_send(
                    self.room_group_name,
                    {"type": "update_start_experiment",
                    "sender_channel_name": self.channel_name},
                )
    
    async def reset_experiment(self, event):
        '''
        reset experiment, removes all trades, bids and asks
        '''
        message_data = {}
        message_data["status"] = await sync_to_async(take_reset_experiment)(self.session_id, event["message_text"])

        message = {}
        message["message_type"] = event["type"]
        message["message_data"] = message_data

        # Send message to WebSocket
        if message_data["status"]["value"] == "fail":
            await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))
        else:
            #send message to client pages
            await self.channel_layer.group_send(
                    self.room_group_name,
                    {"type": "update_reset_experiment",
                     "sender_channel_name": self.channel_name},
                )
    
    async def reset_connections(self, event):
        '''
        reset connection counts for experiment
        '''
        #update subject count
        message_data = {}
        message_data["status"] = await sync_to_async(take_reset_connections)(self.session_id, event["message_text"])

        message = {}
        message["message_type"] = event["type"]
        message["message_data"] = message_data

        # Send message to WebSocket
        if message_data["status"]["value"] == "fail":
            await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))
        else:
            #send message to client pages
            await self.channel_layer.group_send(
                    self.room_group_name,
                    {"type": "update_reset_connections",
                     "sender_channel_name": self.channel_name},
                )

    async def next_phase(self, event):
        '''
        advance to next phase in experiment
        '''
        #update subject count
        message_data = {}
        message_data["status"] = await sync_to_async(take_next_phase)(self.session_id, event["message_text"])

        message = {}
        message["message_type"] = event["type"]
        message["message_data"] = message_data

        # Send message to WebSocket
        if message_data["status"]["value"] == "fail":
            await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))
        else:
            #send message to client pages
            await self.channel_layer.group_send(
                    self.room_group_name,
                    {"type": "update_next_phase",
                    "data": message_data["status"],
                     "sender_channel_name": self.channel_name},
                )

    async def start_timer(self, event):
        '''
        start or stop timer 
        '''
        logger = logging.getLogger(__name__)

        logger.info(f"start_timer {event}")

        result = await sync_to_async(take_start_timer)(self.session_id, event["message_text"])

        message_data = {}
        message_data["status"] = result

        message = {}
        message["message_type"] = event["type"]
        message["message_data"] = message_data

        if event["message_text"]["action"] == "start":
            self.timer_running = True
        else:
            self.timer_running = False

        #Send reply to sending channel
        if self.timer_running == True:
            await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))

        #update all that timer has started
        await self.channel_layer.group_send(
            self.room_group_name,
            {"type": "update_time",
                "data": result,
                "sender_channel_name": self.channel_name,},
        )

        if result["value"] == "success" and event["message_text"]["action"] == "start":
            #start continue timer
            await self.channel_layer.send(
                self.channel_name,
                {
                    'type': "continue_timer",
                    'message_text': {},
                }
            )
        else:
            logger.warning(f"start_timer: {message}")
        
        logger.info(f"start_timer complete {event}")

    async def continue_timer(self, event):
        '''
        continue to next second of the experiment
        '''
        logger = logging.getLogger(__name__)
        logger.info(f"continue_timer start")

        if not self.timer_running:
            logger.info(f"continue_timer timer off")
            return

        # await asyncio.sleep(1)

        if not self.timer_running:
            logger.info(f"continue_timer timer off")
            return

        timer_result = await sync_to_async(take_do_period_timer)(self.session_id)

        # timer_result = await do_period_timer(self.session_id)

        if timer_result["value"] == "success":

            await self.channel_layer.group_send(
                self.room_group_name,
                {"type": "update_time",
                "data": timer_result,
                "sender_channel_name": self.channel_name,},
            )

            #if session is not over continue
            if not timer_result["end_game"]:

                loop = asyncio.get_event_loop()

                loop.call_later(1, asyncio.create_task, 
                                self.channel_layer.send(
                                    self.channel_name,
                                    {
                                        'type': "continue_timer",
                                        'message_text': {},
                                    }
                                ))
        
        logger.info(f"continue_timer end")

    async def download_summary_data(self, event):
        '''
        download summary data
        '''

        message_data = {}
        message_data["status"] = await sync_to_async(take_download_summary_data)(self.session_id)

        message = {}
        message["message_type"] = event["type"]
        message["message_data"] = message_data

        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))
    
    async def download_action_data(self, event):
        '''
        download summary data
        '''

        message_data = {}
        message_data["status"] = await sync_to_async(take_download_action_data)(self.session_id)

        message = {}
        message["message_type"] = event["type"]
        message["message_data"] = message_data

        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))
    
    async def download_recruiter_data(self, event):
        '''
        download summary data
        '''

        message_data = {}
        message_data["status"] = await sync_to_async(take_download_recruiter_data)(self.session_id)

        message = {}
        message["message_type"] = event["type"]
        message["message_data"] = message_data

        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))
    
    async def download_payment_data(self, event):
        '''
        download payment data
        '''

        message_data = {}
        message_data["status"] = await sync_to_async(take_download_payment_data)(self.session_id)

        message = {}
        message["message_type"] = event["type"]
        message["message_data"] = message_data

        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))
    
    async def end_early(self, event):
        '''
        set the current period as the last period
        '''

        message_data = {}
        message_data["status"] = await sync_to_async(take_end_early)(self.session_id)

        message = {}
        message["message_type"] = event["type"]
        message["message_data"] = message_data

        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))
    
    async def update_subject(self, event):
        '''
        set the name etc info of a subjec from staff screen
        '''

        message_data = {}
        message_data["status"] = await sync_to_async(take_update_subject)(self.session_id,  event["message_text"])

        message = {}
        message["message_type"] = event["type"]
        message["message_data"] = message_data

        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))
    
    async def email_list(self, event):
        '''
        take csv email list and load in to session players
        '''

        message_data = {}
        message_data["status"] = await sync_to_async(take_email_list)(self.session_id,  event["message_text"])

        message = {}
        message["message_type"] = event["type"]
        message["message_data"] = message_data

        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))
    
    async def send_invitations(self, event):
        '''
        send invitations to subjects
        '''

        message_data = {}
        message_data["status"] = await sync_to_async(take_send_invitations)(self.session_id,  event["message_text"])

        message = {}
        message["message_type"] = event["type"]
        message["message_data"] = message_data

        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))

    async def anonymize_data(self, event):
        '''
        send invitations to subjects
        '''

        result = await sync_to_async(take_anonymize_data)(self.session_id,  event["message_text"])

        #update all 
        await self.channel_layer.group_send(
            self.room_group_name,
            {"type": "update_anonymize_data",
             "data": result,
             "sender_channel_name": self.channel_name,},
        )

    #consumer updates
    async def update_start_experiment(self, event):
        '''
        start experiment on staff
        '''
        # logger = logging.getLogger(__name__) 
        # logger.info(f'update_goods{self.channel_name}')

        #get session json object
        result = await sync_to_async(take_get_session)(self.connection_uuid)

        message_data = {}
        message_data["session"] = result

        message = {}
        message["message_type"] = event["type"]
        message["message_data"] = message_data

        #if self.channel_name != event['sender_channel_name']:
        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))
    
    async def update_reset_experiment(self, event):
        '''
        update reset experiment
        '''
        #update subject count
        message_data = {}
        message_data["session"] = await sync_to_async(take_get_session)(self.connection_uuid)

        message = {}
        message["message_type"] = event["type"]
        message["message_data"] = message_data

        # Send message to WebSocket
        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))
    
    async def update_reset_connections(self, event):
        '''
        update reset experiment
        '''
        #update subject count
        message_data = {}
        message_data["session"] = await sync_to_async(take_get_session)(self.connection_uuid)

        message = {}
        message["message_type"] = event["type"]
        message["message_data"] = message_data

        # Send message to WebSocket
        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))
    
    async def update_chat(self, event):
        '''
        send chat to clients, if clients can view it
        '''
        result = event["staff_result"]

        message_data = {}
        message_data["status"] = result

        message = {}
        message["message_type"] = event["type"]
        message["message_data"] = message_data

        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))

    async def update_time(self, event):
        '''
        update running, phase and time status
        '''

        message_data = {}
        message_data["status"] = event["data"]

        message = {}
        message["message_type"] = event["type"]
        message["message_data"] = message_data

        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))

    async def update_connection_status(self, event):
        '''
        handle connection status update from group member
        '''
        # logger = logging.getLogger(__name__) 
        # logger.info("Connection update")

        #update not from a client
        if event["data"]["value"] == "fail":
            return

        message_data = {}
        message_data["status"] = event["data"]

        message = {}
        message["message_type"] = event["type"]
        message["message_data"] = message_data

        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))

    async def update_name(self, event):
        '''
        send update name notice to staff screens
        '''

        # logger = logging.getLogger(__name__) 
        # logger.info("Eng game update")

        message_data = {}
        message_data["status"] = event["data"]

        message = {}
        message["message_type"] = event["type"]
        message["message_data"] = message_data

        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))

    async def update_next_phase(self, event):
        '''
        update session phase
        '''

        message_data = {}
        message_data["status"] = event["data"]

        message = {}
        message["message_type"] = event["type"]
        message["message_data"] = message_data

        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))

    async def update_next_instruction(self, event):
        '''
        send instruction status to staff
        '''

        # logger = logging.getLogger(__name__) 
        # logger.info("Eng game update")

        message_data = {}
        message_data["status"] = event["data"]

        message = {}
        message["message_type"] = event["type"]
        message["message_data"] = message_data

        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))
    
    async def update_finish_instructions(self, event):
        '''
        send instruction status to staff
        '''

        # logger = logging.getLogger(__name__) 
        # logger.info("Eng game update")

        message_data = {}
        message_data["status"] = event["data"]

        message = {}
        message["message_type"] = event["type"]
        message["message_data"] = message_data

        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))
    
    async def update_production_time(self, event):
        '''
        send production settings update
        '''

        # logger = logging.getLogger(__name__) 
        # logger.info("Eng game update")

        message_data = {}
        message_data["status"] = event["data"]

        message = {}
        message["message_type"] = event["type"]
        message["message_data"] = message_data

        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))
    
    async def update_anonymize_data(self, event):
        '''
        send anonymize data update to staff sessions
        '''

        # logger = logging.getLogger(__name__) 
        # logger.info("Eng game update")

        message_data = {}
        message_data["status"] = event["data"]

        message = {}
        message["message_type"] = event["type"]
        message["message_data"] = message_data

        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))
#local async function

#local sync functions    
def take_get_session(session_key):
    '''
    return session with specified id
    param: session_key {uuid} session uuid
    '''
    session = None
    logger = logging.getLogger(__name__)

    try:        
        session = Session.objects.get(session_key=session_key)
        return session.json()
    except ObjectDoesNotExist:
        logger.warning(f"staff get_session session, not found: {session_key}")
        return {}

def take_update_session_form(session_id, data):
    '''
    take session form data and update session or return errors
    param: data {json} incoming form and session data
    '''

    logger = logging.getLogger(__name__)
    logger.info(f'take_update_session_form: {data}')

    #session_id = data["session_id"]
    form_data = data["form_data"]

    try:        
        session = Session.objects.get(id=session_id)
    except ObjectDoesNotExist:
        logger.warning(f"take_update_session_form session, not found: {session_id}")
    
    form_data_dict = form_data

    # for field in form_data:            
    #     form_data_dict[field["name"]] = field["value"]

    form = SessionForm(form_data_dict, instance=session)

    if form.is_valid():
        #print("valid form")                
        form.save()              

        return {"status":"success", "session" : session.json()}                      
                                
    logger.info("Invalid session form")
    return {"status":"fail", "errors":dict(form.errors.items())}

def take_start_experiment(session_id, data):
    '''
    start experiment
    '''   

    logger = logging.getLogger(__name__) 
    logger.info(f"Start Experiment: {data}")

    #session_id = data["session_id"]
    with transaction.atomic():
        session = Session.objects.get(id=session_id)

        if not session.started:
            session.start_experiment()

        value = "success"
    
    return {"value" : value, "started" : session.started}

def take_reset_experiment(session_id, data):
    '''
    reset experiment remove bids and asks
    '''   

    logger = logging.getLogger(__name__) 
    logger.info(f"Reset Experiment: {data}")

    #session_id = data["session_id"]
    session = Session.objects.get(id=session_id)

    if session.started:
        session.reset_experiment()  

    value = "success"
    
    return {"value" : value, "started" : session.started}

def take_reset_connections(session_id, data):
    '''
    reset connection counts for experiment
    '''   

    logger = logging.getLogger(__name__) 
    logger.info(f"Reset connection counts: {data}")

    #session_id = data["session_id"]
    session = Session.objects.get(id=session_id)

    if not session.started:
        session.reset_connection_counts()  

    value = "success"
    
    return {"value" : value, "started" : session.started}

def take_next_phase(session_id, data):
    '''
    advance to next phase in the experiment
    '''   

    logger = logging.getLogger(__name__) 
    logger.info(f"Advance to Next Phase: {data}")

    #session_id = data["session_id"]
    session = Session.objects.get(id=session_id)

    if session.current_experiment_phase == ExperimentPhase.INSTRUCTIONS:
        session.current_experiment_phase = ExperimentPhase.RUN

    elif session.current_experiment_phase == ExperimentPhase.RUN:
        session.current_experiment_phase = ExperimentPhase.DONE
        session.finished = True

    session.save()

    status = "success"
    
    return {"value" : status,
            "current_experiment_phase" : session.current_experiment_phase,
            }

def take_start_timer(session_id, data):
    '''
    start timer
    '''   
    logger = logging.getLogger(__name__) 
    logger.info(f"Start timer {data}")

    action = data["action"]

    with transaction.atomic():
        session = Session.objects.get(id=session_id)

        if session.timer_running and action=="start":
            
            logger.warning(f"Start timer: already started")
            return {"value" : "fail", "result" : {"message":"timer already running"}}

        if action == "start":
            session.timer_running = True
        else:
            session.timer_running = False

        session.save()

    return {"value" : "success", "result" : session.json_for_timer()}

def take_do_period_timer(session_id):
    '''
    do period timer actions
    '''
    logger = logging.getLogger(__name__)

    session = Session.objects.get(id=session_id)

    if session.timer_running == False or session.finished:
        return_json = {"value" : "fail", "result" : {"message" : "session no longer running"}}
    else:
        return_json = session.do_period_timer()

    logger.info(f"take_do_period_timer: {return_json}")

    return return_json

def take_download_summary_data(session_id):
    '''
    download summary data for session
    '''

    session = Session.objects.get(id=session_id)

    return {"value" : "success", "result" : session.get_download_summary_csv()}

def take_download_action_data(session_id):
    '''
    download action data for session
    '''

    session = Session.objects.get(id=session_id)

    return {"value" : "success", "result" : session.get_download_action_csv()}

def take_download_recruiter_data(session_id):
    '''
    download recruiter data for session
    '''

    session = Session.objects.get(id=session_id)

    return {"value" : "success", "result" : session.get_download_recruiter_csv()}

def take_download_payment_data(session_id):
    '''
    download payment data for session
    '''

    session = Session.objects.get(id=session_id)

    return {"value" : "success", "result" : session.get_download_payment_csv()}

def take_end_early(session_id):
    '''
    make the current period the last period
    '''

    session = Session.objects.get(id=session_id)

    session.parameter_set.period_count = session.current_period
    session.parameter_set.save()

    return {"value" : "success", "result" : session.parameter_set.period_count}

def take_update_subject(session_id, data):
    '''
    take update subject info from staff screen
    param: data {json} incoming form and session data
    '''

    logger = logging.getLogger(__name__)
    logger.info(f'take_update_subject: {data}')

    #session_id = data["session_id"]
    form_data = dict(data["form_data"])

    try:        
        session = Session.objects.get(id=session_id)
    except ObjectDoesNotExist:
        logger.warning(f"take_update_session_form session, not found: {session_id}")
        return {"status":"fail", "message":"session not found"}

    form = staff_edit_name_etc_form(form_data)

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
                                
    logger.info("Invalid session form")
    return {"status":"fail", "errors":dict(form.errors.items())}

def take_send_invitations(session_id, data):
    '''
    send login link to subjects in session
    '''
    logger = logging.getLogger(__name__)
    logger.info(f'take_send_invitations: {session_id} {data}')

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
    logger = logging.getLogger(__name__)
    logger.info(f'take_email_list: {session_id} {data}')

    try:        
        session = Session.objects.get(id=session_id)
    except ObjectDoesNotExist:
        logger.warning(f"take_send_invitations session, not found: {session_id}")
        return {"status":"fail", "result":"session not found"}
    
    raw_list = data["csv_data"]

    raw_list = raw_list.splitlines()

    counter = 1
    for i in range(len(raw_list)):
        raw_list[i] = re.split(r',|\t', raw_list[i])

        if raw_list[i][0] != "Last Name":
            p = session.session_players.filter(player_number=counter).first()

            if p:
                p.name = raw_list[i][0] + " " + raw_list[i][1]
                p.email = raw_list[i][2]
                p.student_id = raw_list[i][3]

                p.save()
            
            counter+=1
    
    return {"value" : "success", "result" : {"session":session.json()}}

def take_anonymize_data(session_id, data):
    '''
    remove name, email and student id from the data
    '''

    logger = logging.getLogger(__name__)
    logger.info(f'take_email_list: {session_id} {data}')

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

    
