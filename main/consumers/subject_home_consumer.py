'''
websocket session list
'''
from pickle import TRUE
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
from main.globals import ExperimentPhase

from main.decorators import check_sesison_started_ws

import main

from main.consumers import lib

from main.consumers.subject_home_consumer_methods import get_session_method
from main.consumers.subject_home_consumer_methods import chat_method

@lib.add_methods_from(get_session_method)
@lib.add_methods_from(chat_method)
class SubjectHomeConsumer(SocketConsumerMixin, StaffSubjectUpdateMixin):
    '''
    websocket session list
    '''    

    session_player_id = 0   #session player id number

    async def send_message(self, message_to_self:dict, message_to_subjects:dict, message_to_staff:dict,
                                 message_type:dict, send_to_client:bool, send_to_group:bool):
        '''
        send response to client
        '''
        # Send message to local client
        if send_to_client:
            message_to_self_data = {}
            message_to_self_data["message_type"] = message_type
            message_to_self_data["message_data"] = message_to_self

            await self.send(text_data=json.dumps({'message': message_to_self_data,}, cls=DjangoJSONEncoder))

        if send_to_group:
            await self.channel_layer.group_send(
                self.room_group_name,
                    {"type": f"update_{message_type}",
                     "subject_data": message_to_subjects,
                     "staff_data": message_to_staff,
                     "sender_channel_name": self.channel_name},
                )
           
    async def name(self, event):
        '''
        take name and id number
        '''
        # result = await sync_to_async(take_name)(self.session_id, self.session_player_id, event["message_text"])

        data = event["message_text"]

        logger = logging.getLogger(__name__) 
        logger.info(f"Take name: {self.session_id} {self.session_player_id} {data}")

        form_data_dict =  data["form_data"]
        
        session = await Session.objects.aget(id=self.session_id)
        session_player = await session.session_players.aget(id=self.session_player_id)

        if session.current_experiment_phase != ExperimentPhase.NAMES:
            result = {"value" : "fail", "errors" : {f"name":["Session not complete."]},
                      "message" : "Session not complete."}
        else:
            logger.info(f'form_data_dict : {form_data_dict}')       

            form = EndGameForm(form_data_dict)
                
            if form.is_valid():
                #print("valid form") 

                session_player.name = form.cleaned_data["name"]
                session_player.student_id = form.cleaned_data["student_id"]
                session_player.name_submitted = True

                session_player.name = string.capwords(session_player.name)

                await sync_to_async(session_player.save, thread_sensitive=False)()    
                
                result = {"value" : "success",
                            "result" : {"id" : self.session_player_id,
                                        "name" : session_player.name, 
                                        "name_submitted" : session_player.name_submitted,
                                        "student_id" : session_player.student_id}}                      
            else:                            
                logger.info("Invalid name form")

                result = {"value" : "fail", "errors" : dict(form.errors.items()), "message" : ""}

        await self.send_message(message_to_self=result, message_to_subjects=None, message_to_staff=result, 
                                message_type=event['type'], send_to_client=True, send_to_group=True)

    async def next_instruction(self, event):
        '''
        advance instruction page
        '''
        result = await sync_to_async(take_next_instruction, thread_sensitive=False)(self.session_id, self.session_player_id, event["message_text"])

        await self.send_message(message_to_self=result, message_to_subjects=None, message_to_staff=result, 
                                message_type=event['type'], send_to_client=True, send_to_group=True)
    
    async def finish_instructions(self, event):
        '''
        finish instructions
        '''
        result = await sync_to_async(take_finish_instructions, thread_sensitive=False)(self.session_id, self.session_player_id, event["message_text"])
        
        await self.send_message(message_to_self=result, message_to_subjects=None, message_to_staff=result, 
                                message_type=event['type'], send_to_client=True, send_to_group=True)

    #consumer updates
    async def update_start_experiment(self, event):
        '''
        start experiment on subjects
        '''

        result = await sync_to_async(take_get_session_subject, thread_sensitive=False)(self.session_player_id)

        await self.send_message(message_to_self=result, message_to_subjects=None, message_to_staff=None, 
                                message_type=event['type'], send_to_client=True, send_to_group=False)
    
    async def update_reset_experiment(self, event):
        '''
        reset experiment on subjects
        '''

        #get session json object
        result = await sync_to_async(take_get_session_subject, thread_sensitive=False)(self.session_player_id)

        await self.send_message(message_to_self=result, message_to_subjects=None, message_to_staff=None, 
                                message_type=event['type'], send_to_client=True, send_to_group=False)
    
    async def update_reset_connections(self, event):
        '''
        reset connections on subjects
        '''
        pass

    async def update_time(self, event):
        '''
        update running, phase and time status
        '''

        event_data = deepcopy(event["group_data"])

        #remove other player earnings
        for session_players_earnings in event_data["result"]["session_player_earnings"]:
            if session_players_earnings["id"] == self.session_player_id:
                event_data["result"]["session_player_earnings"] = session_players_earnings
                break
        
        #remove none group memebers
        session_players = []
        for session_player in event_data["result"]["session_players"]:
            session_players.append(session_player)

        event_data["result"]["session_players"] = session_players

        await self.send_message(message_to_self=event_data, message_to_subjects=None, message_to_staff=None, 
                                message_type=event['type'], send_to_client=True, send_to_group=False)

    async def update_connection_status(self, event):
        '''
        handle connection status update from group member
        '''
        pass

    async def update_name(self, event):
        '''
        no group broadcast of name to subjects
        '''
        pass
    
    async def update_next_phase(self, event):
        '''
        update session phase
        '''

        result = await sync_to_async(take_update_next_phase, thread_sensitive=False)(self.session_id, self.session_player_id)

        await self.send_message(message_to_self=result, message_to_subjects=None, message_to_staff=None, 
                                message_type=event['type'], send_to_client=True, send_to_group=False)

    async def update_next_instruction(self, event):
        '''
        no group broadcast of avatar to current instruction
        '''
        pass
    
    async def update_finish_instructions(self, event):
        '''
        no group broadcast of avatar to current instruction
        '''
        pass

    async def update_anonymize_data(self, event):
        '''
        no anonmyize data update on client
        '''

    async def update_survey_complete(self, event):
        '''
        no group broadcast of survey complete
        '''
        pass


#local sync functions  


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
                "session_players" : {p.id : p.json_for_subject(session_player) for p in session.session_players.all()},
                "session_players_order" : list(session.session_players.all().values_list('id', flat=True)),}

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
        logger.warning(f"take_finish_instructions not found: {session_player_id}")
        return {"value" : "fail", "errors" : {}, "message" : "Instruction Error."} 
    except KeyError:
        logger.warning(f"take_finish_instructions key error: {session_player_id}")
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
        logger.warning(f"take_finish_instructions : {session_player_id}")
        return {"value" : "fail", "errors" : {}, "message" : "Error"}       
    
    return {"value" : "success",
            "result" : {"instructions_finished" : session_player.instructions_finished,
                        "id" : session_player_id,
                        "current_instruction_complete" : session_player.current_instruction_complete, 
                        }}