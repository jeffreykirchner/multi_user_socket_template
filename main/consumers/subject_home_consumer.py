'''
websocket session list
'''
from asgiref.sync import sync_to_async

import logging
import copy
import json
import string
from copy import copy
from copy import deepcopy

from django.core.exceptions import  ObjectDoesNotExist
from django.core.serializers.json import DjangoJSONEncoder
from django.db import transaction

from main.consumers import SocketConsumerMixin
from main.consumers import StaffSubjectUpdateMixin

from main.forms import EndGameForm

from main.models import Session
from main.models import SessionPlayer
from main.models import SessionPlayerChat

from main.globals import ChatTypes
from main.globals import round_half_away_from_zero

from main.decorators import check_sesison_started_ws

import main

class SubjectHomeConsumer(SocketConsumerMixin, StaffSubjectUpdateMixin):
    '''
    websocket session list
    '''    

    session_player_id = 0   #session player id number
    
    async def get_session(self, event):
        '''
        return a list of sessions
        '''
        logger = logging.getLogger(__name__) 
        logger.info(f"Get Session {event}")

        self.connection_uuid = event["message_text"]["playerKey"]
        self.connection_type = "subject"
        self.session_id = await sync_to_async(take_get_session_id)(self.connection_uuid)

        await self.update_local_info(event)

        result = await sync_to_async(take_get_session_subject)(self.session_player_id)

        #build response
        message_data = {"status":{}}
        message_data["status"] = result

        message = {}
        message["messageType"] = event["type"]
        message["messageData"] = message_data

        # Send message to WebSocket
        await self.send(text_data=json.dumps({'message': message,}, cls=DjangoJSONEncoder))
   
    async def chat(self, event):
        '''
        take chat from client
        '''        
        result = await sync_to_async(take_chat)(self.session_id, self.session_player_id, event["message_text"])

        if result["value"] == "fail":
            await self.send(text_data=json.dumps({'message': result}, cls=DjangoJSONEncoder))
            return

        event_result = result["result"]

        subject_result = {}
        subject_result["chat_type"] = event_result["chat_type"]
        subject_result["sesson_player_target"] = event_result.get("sesson_player_target", -1)
        subject_result["chat"] = event_result["chat_for_subject"]
        subject_result["value"] = result["value"]

        staff_result = {}
        staff_result["chat"] = event_result["chat_for_staff"]

        message_data = {}
        message_data["status"] = subject_result

        message = {}
        message["messageType"] = event["type"]
        message["messageData"] = message_data

        # Send reply to sending channel
        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))

        #if success send to all connected clients
        if result["value"] == "success":
            await self.channel_layer.group_send(
                self.room_group_name,
                {"type": "update_chat",
                 "subject_result": subject_result,
                 "staff_result": staff_result,
                 "sender_channel_name": self.channel_name},
            )

    async def name(self, event):
        '''
        take name and id number
        '''
        result = await sync_to_async(take_name)(self.session_id, self.session_player_id, event["message_text"])
        message_data = {}
        message_data["status"] = result

        message = {}
        message["messageType"] = event["type"]
        message["messageData"] = message_data

        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))

        if result["value"] == "success":
            await self.channel_layer.group_send(
                self.room_group_name,
                {"type": "update_name",
                 "data": result,
                 "sender_channel_name": self.channel_name},
            )

    async def next_instruction(self, event):
        '''
        advance instruction page
        '''
        result = await sync_to_async(take_next_instruction)(self.session_id, self.session_player_id, event["message_text"])
        message_data = {}
        message_data["status"] = result

        message = {}
        message["messageType"] = event["type"]
        message["messageData"] = message_data

        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))

        if result["value"] == "success":
            await self.channel_layer.group_send(
                self.room_group_name,
                {"type": "update_next_instruction",
                 "data": result,
                 "sender_channel_name": self.channel_name},
            )
    
    async def finish_instructions(self, event):
        '''
        fisish instructions
        '''
        result = await sync_to_async(take_finish_instructions)(self.session_id, self.session_player_id, event["message_text"])
        message_data = {}
        message_data["status"] = result

        message = {}
        message["messageType"] = event["type"]
        message["messageData"] = message_data

        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))

        if result["value"] == "success":
            await self.channel_layer.group_send(
                self.room_group_name,
                {"type": "update_finish_instructions",
                 "data": result,
                 "sender_channel_name": self.channel_name},
            )

    #consumer updates
    async def update_start_experiment(self, event):
        '''
        start experiment on subjects
        '''
        #logger = logging.getLogger(__name__) 
        #logger.info(f'update start subjects {self.channel_name}')

        await self.update_local_info(event)

        #get session json object
        result = await sync_to_async(take_get_session_subject)(self.session_player_id)

        message_data = {}
        message_data["status"] = result

        message = {}
        message["messageType"] = event["type"]
        message["messageData"] = message_data

        #if self.channel_name != event['sender_channel_name']:
        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))
    
    async def update_reset_experiment(self, event):
        '''
        reset experiment on subjects
        '''
        #logger = logging.getLogger(__name__) 
        #logger.info(f'update start subjects {self.channel_name}')

        #get session json object
        result = await sync_to_async(take_get_session_subject)(self.session_player_id)

        message_data = {}
        message_data["status"] = result

        message = {}
        message["messageType"] = event["type"]
        message["messageData"] = message_data

        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))

    async def update_chat(self, event):
        '''
        send chat to clients, if clients can view it
        '''

        message_data = {}
        message_data["status"] =  event["subject_result"]

        message = {}
        message["messageType"] = event["type"]
        message["messageData"] = message_data

        if self.channel_name == event['sender_channel_name']:
            return
        
        if message_data['status']['chat_type'] == "Individual" and \
           message_data['status']['sesson_player_target'] != self.session_player_id and \
           message_data['status']['chat']['sender_id'] != self.session_player_id:

           return

        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))

    async def update_local_info(self, event):
        '''
        update connection's information
        '''
        result = await sync_to_async(take_update_local_info)(self.session_id, self.connection_uuid, event)

        logger = logging.getLogger(__name__) 
        logger.info(f"update_local_info {result}")

        self.session_player_id = result["session_player_id"]

    async def update_time(self, event):
        '''
        update running, phase and time status
        '''

        event_data = deepcopy(event["data"])

        #if new period is starting, update local info
        if event_data["result"]["do_group_update"]:
             await self.update_local_info(event)

        #remove other player earnings
        for session_players_earnings in event_data["result"]["session_player_earnings"]:
            if session_players_earnings["id"] == self.session_player_id:
                event_data["result"]["session_player_earnings"] = session_players_earnings
                break
        
        #remove none group memebers
        session_players = []
        for session_player in event_data["result"]["session_players"]:
            session_players.append(session_player)
        
        #remove other player notices
        notice_list = []
        for session_player_notice in event_data.get("notice_list", []):
            if session_player_notice["session_player_id"] == self.session_player_id:
                notice_list.append(session_player_notice)
                break

        event_data["notice_list"] = notice_list   

        event_data["result"]["session_players"] = session_players

        message_data = {}
        message_data["status"] = event_data

        message = {}
        message["messageType"] = event["type"]
        message["messageData"] = message_data

        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))

    async def update_connection_status(self, event):
        '''
        handle connection status update from group member
        '''
        # logger = logging.getLogger(__name__) 
        # logger.info("Connection update")

    async def update_name(self, event):
        '''
        no group broadcast of name to subjects
        '''

        # logger = logging.getLogger(__name__) 
        # logger.info("Eng game update")
    
    async def update_next_phase(self, event):
        '''
        update session phase
        '''

        result = await sync_to_async(take_update_next_phase)(self.session_id, self.session_player_id)

        message_data = {}
        message_data["status"] = result

        message = {}
        message["messageType"] = event["type"]
        message["messageData"] = message_data

        await self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))

    async def update_next_instruction(self, event):
        '''
        no group broadcast of avatar to current instruction
        '''

        # logger = logging.getLogger(__name__) 
        # logger.info("Eng game update")
    
    async def update_finish_instructions(self, event):
        '''
        no group broadcast of avatar to current instruction
        '''

        # logger = logging.getLogger(__name__) 
        # logger.info("Eng game update")


#local sync functions  
def take_get_session_subject(session_player_id):
    '''
    get session info for subject
    '''
    #session_id = data["sessionID"]
    #uuid = data["uuid"]

    #session = Session.objects.get(id=session_id)
    try:
        session_player = SessionPlayer.objects.get(id=session_player_id)

        return {"session" : session_player.session.json_for_subject(session_player), 
                "session_player" : session_player.json() }

    except ObjectDoesNotExist:
        return {"session" : None, 
                "session_player" : None}

def take_get_session_id(player_key):
    '''
    get the session id for the player_key
    '''
    session_player = SessionPlayer.objects.get(player_key=player_key)

    return session_player.session.id
  
def take_chat(session_id, session_player_id, data):
    '''
    take chat from client
    sesson_id : int : id of session
    session_player_id : int : id of session player
    data : json : incoming json data
    '''
    logger = logging.getLogger(__name__) 
    logger.info(f"take chat: {session_id} {session_player_id} {data}")

    try:
        recipients = data["recipients"] 
        chat_text = data["text"]
    except KeyError:
         return {"value" : "fail", "result" : {"message" : "Invalid chat."}}

    result = {}
    #result["recipients"] = []

    session = Session.objects.get(id=session_id)
    session_player = session.session_players.get(id=session_player_id)
    
    session_player_chat = SessionPlayerChat()

    session_player_chat.session_player = session_player
    session_player_chat.session_period = session.get_current_session_period()

    if not session.started:
        return  {"value" : "fail", "result" : {"message" : "Session not started."}, }
        
    if session.finished:
        return {"value" : "fail", "result" : {"message" : "Session finished."}}

    if session.current_experiment_phase != main.globals.ExperimentPhase.RUN:
            return {"value" : "fail", "result" : {"message" : "Session not running."}}

    if recipients == "all":
        session_player_chat.chat_type = ChatTypes.ALL
    else:
        if not session.parameter_set.private_chat:
            logger.warning(f"take chat: private chat not enabled :{session_id} {session_player_id} {data}")
            return {"value" : "fail",
                    "result" : {"message" : "Private chat not allowed."}}

        session_player_chat.chat_type = ChatTypes.INDIVIDUAL

    result["chat_type"] = session_player_chat.chat_type
    result["recipients"] = []

    session_player_chat.text = chat_text
    session_player_chat.time_remaining = session.time_remaining

    session_player_chat.save()

    if recipients == "all":
        session_player_chat.session_player_recipients.add(*session.session_players.all())

        result["recipients"] = [i.id for i in session.session_players.all()]
    else:
        sesson_player_target = SessionPlayer.objects.get(id=recipients)

        if sesson_player_target in session.session_players.all():
            session_player_chat.session_player_recipients.add(sesson_player_target)
        else:
            session_player_chat.delete()
            logger.warning(f"take chat: chat at none group member : {session_id} {session_player_id} {data}")
            return {"value" : "fail", "result" : {"Player not in group."}}

        result["sesson_player_target"] = sesson_player_target.id

        result["recipients"].append(session_player.id)
        result["recipients"].append(sesson_player_target.id)
    
    result["chat_for_subject"] = session_player_chat.json_for_subject()
    result["chat_for_staff"] = session_player_chat.json_for_staff()

    session_player_chat.save()

    return {"value" : "success", "result" : result}

def take_update_local_info(session_id, player_key, data):
    '''
    update connection's information
    '''

    try:
        session_player = SessionPlayer.objects.get(player_key=player_key)
        session_player.save()

        return {"session_player_id" : session_player.id}
    except ObjectDoesNotExist:      
        return {"session_player_id" : None}

def take_name(session_id, session_player_id, data):
    '''
    take name and student id at end of game
    '''

    logger = logging.getLogger(__name__) 
    logger.info(f"Take name: {session_id} {session_player_id} {data}")

    form_data_dict = {}

    try:
        form_data = data["formData"]

        for field in form_data:            
            form_data_dict[field["name"]] = field["value"]

    except KeyError:
        logger.warning(f"take_name , setup form: {session_player_id}")
        return {"value" : "fail", "errors" : {f"name":["Invalid Entry."]}}
    
    session = Session.objects.get(id=session_id)
    session_player = session.session_players.get(id=session_player_id)

    if not session.finished:
        return {"value" : "fail", "errors" : {f"name":["Session not complete."]},
                "message" : "Session not complete."}

    logger.info(f'form_data_dict : {form_data_dict}')       

    form = EndGameForm(form_data_dict)
        
    if form.is_valid():
        #print("valid form") 

        session_player.name = form.cleaned_data["name"]
        session_player.student_id = form.cleaned_data["student_id"]

        session_player.name = string.capwords(session_player.name)

        session_player.save()    
        
        return {"value" : "success",
                "result" : {"id" : session_player_id,
                            "name" : session_player.name, 
                            "student_id" : session_player.student_id}}                      
                                
    logger.info("Invalid session form")
    return {"value" : "fail", "errors" : dict(form.errors.items()), "message" : ""}

def take_update_next_phase(session_id, session_player_id):
    '''
    return information about next phase of experiment
    '''

    logger = logging.getLogger(__name__) 

    try:
        session = Session.objects.get(id=session_id)
        session_player = SessionPlayer.objects.get(id=session_player_id)


        return {"value" : "success",
                "session" : session_player.session.json_for_subject(session_player),
                "session_player" : session_player.json(),
                "session_players" : [p.json_for_subject(session_player) for p in session.session_players.all()]}

    except ObjectDoesNotExist:
        logger.warning(f"take_update_next_phase: session not found, session {session_id}, session_player_id {session_player_id}")
        return {"value" : "fail", "result" : {}, "message" : "Update next phase error"}

def take_next_instruction(session_id, session_player_id, data):
    '''
    take show next instruction page
    '''

    logger = logging.getLogger(__name__) 
    logger.info(f"Take next instruction: {session_id} {session_player_id} {data}")

    try:       

        session = Session.objects.get(id=session_id)
        session_player = session.session_players.get(id=session_player_id)

        direction = data["direction"]

        #move to next instruction
        if direction == 1:
            #advance furthest instruction complete
            if session_player.current_instruction_complete < session_player.current_instruction:
                session_player.current_instruction_complete = copy(session_player.current_instruction)

            if session_player.current_instruction < session.parameter_set.instruction_set.instructions.count():
                session_player.current_instruction += 1
        elif session_player.current_instruction > 1:
             session_player.current_instruction -= 1

        session_player.save()

    except ObjectDoesNotExist:
        logger.warning(f"take_next_instruction not found: {session_player_id}")
        return {"value" : "fail", "errors" : {}, "message" : "Instruction Error."} 
    except KeyError:
        logger.warning(f"take_next_instruction key error: {session_player_id}")
        return {"value" : "fail", "errors" : {}, "message" : "Instruction Error."}       
    
    return {"value" : "success",
            "result" : {"current_instruction" : session_player.current_instruction,
                        "id" : session_player_id,
                        "current_instruction_complete" : session_player.current_instruction_complete, 
                        }}

def take_finish_instructions(session_id, session_player_id, data):
    '''
    take finish instructions
    '''

    logger = logging.getLogger(__name__) 
    logger.info(f"Take finish instructions: {session_id} {session_player_id} {data}")

    try:       

        session = Session.objects.get(id=session_id)
        session_player = session.session_players.get(id=session_player_id)

        session_player.current_instruction_complete = session.parameter_set.instruction_set.instructions.count()
        session_player.instructions_finished = True
        session_player.save()

    except ObjectDoesNotExist:
        logger.warning(f"take_next_instruction : {session_player_id}")
        return {"value" : "fail", "errors" : {}, "message" : "Move Error"}       
    
    return {"value" : "success",
            "result" : {"instructions_finished" : session_player.instructions_finished,
                        "id" : session_player_id,
                        "current_instruction_complete" : session_player.current_instruction_complete, 
                        }}