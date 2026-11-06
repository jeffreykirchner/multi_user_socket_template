
import logging

from copy import copy
import re

from django.core.exceptions import  ObjectDoesNotExist

from asgiref.sync import sync_to_async

from main.consumers.staff.session_consumer_mixins import data
from main.models import Session


class InstructionsMixin():
    '''
    Get instructions mixin for subject home consumer
    '''
    
    async def next_instruction(self, event):
        '''
        advance instruction page
        '''
        # result = await sync_to_async(take_next_instruction, thread_sensitive=self.thread_sensitive)(self.session_id, self.session_player_id, event["message_text"])

        data = event["message_text"]
        session_id = self.session_id
        session_player_id = self.session_player_id

        logger = logging.getLogger(__name__) 
        # logger.info(f"Take next instruction: {session_id} {session_player_id} {data}")
    
        result = None
    
        try:       
    
            session = await Session.objects.aget(id=session_id)
            session_player = await session.session_players.prefetch_related("parameter_set_player__instruction_set__instructions").aget(id=session_player_id)
    
            direction = data["direction"]
    
            #move to next instruction
            if direction == 1:
                #advance furthest instruction complete
                if session_player.current_instruction_complete < session_player.current_instruction:
                    session_player.current_instruction_complete = copy(session_player.current_instruction)
    
                if session_player.current_instruction < session_player.parameter_set_player.instruction_set.instructions.count():
                    session_player.current_instruction += 1
            elif session_player.current_instruction > 1:
                    session_player.current_instruction -= 1
    
            await session_player.asave()
    
        except ObjectDoesNotExist:
            logger.warning(f"take_finish_instructions not found: {session_player_id}")
            result = {"value" : "fail", "errors" : {}, "message" : "Instruction Error."} 
        except KeyError:
            logger.warning(f"take_finish_instructions key error: {session_player_id}")
            result = {"value" : "fail", "errors" : {}, "message" : "Instruction Error."}       

        if not result:
            result = {"value" : "success",
                      "result" : {"current_instruction" : session_player.current_instruction,
                                  "id" : session_player_id,
                                  "current_instruction_complete" : session_player.current_instruction_complete, 
                                 }}

        await self.send_message(message_to_self=result, message_to_subjects=None, message_to_staff=result, 
                                message_type=event['type'], send_to_client=True, send_to_group=True)
        
    async def update_next_instruction(self, event):
        '''
        no group broadcast of avatar to current instruction
        '''
        pass

    async def finish_instructions(self, event):
        '''
        finish instructions
        '''
        # result = await sync_to_async(take_finish_instructions, thread_sensitive=self.thread_sensitive)(self.session_id, self.session_player_id, event["message_text"])

        data = event["message_text"]
        session_id = self.session_id
        session_player_id = self.session_player_id
        result = None

        logger = logging.getLogger(__name__) 
        # logger.info(f"Take finish instructions: {session_id} {session_player_id} {data}")

        try:       

            session = await Session.objects.aget(id=session_id)
            session_player = await session.session_players.prefetch_related("parameter_set_player__instruction_set__instructions").aget(id=session_player_id)

            session_player.current_instruction_complete = session_player.parameter_set_player.instruction_set.instructions.count()
            session_player.instructions_finished = True
            await session_player.asave()

        except ObjectDoesNotExist:
            logger.warning(f"take_finish_instructions : {session_player_id}")
            result = {"value" : "fail", "errors" : {}, "message" : "Error"}       

        if not result:
            result = {"value" : "success",
                      "result" : {"instructions_finished" : session_player.instructions_finished,
                                  "id" : session_player_id,
                                  "current_instruction_complete" : session_player.current_instruction_complete, 
                                    }}
        
        await self.send_message(message_to_self=result, message_to_subjects=None, message_to_staff=result, 
                                message_type=event['type'], send_to_client=True, send_to_group=True)
        
    async def update_finish_instructions(self, event):
        '''
        no group broadcast of avatar to current instruction
        '''
        pass

    async def current_instruction_complete(self, event):
        '''
        current instruction complete
        '''
        # result = await sync_to_async(take_current_instruction_complete, thread_sensitive=self.thread_sensitive)(self.session_id, self.session_player_id, event["message_text"])

        '''
            take current instruction complete
            '''
        
        logger = logging.getLogger(__name__) 
        # logger.info(f"Take current instruction complete: {session_id} {session_player_id} {data}")
        session_id = self.session_id
        session_player_id = self.session_player_id
        data = event["message_text"]

        result = None
        
        try:       
    
            session = await Session.objects.aget(id=session_id)
            session_player = await session.session_players.aget(id=session_player_id)
    
            session_player.current_instruction_complete = data["page_number"]
            await session_player.asave()
    
        except ObjectDoesNotExist:
            logger.warning(f"take_current_instruction_complete : {session_player_id}")
            result = {"value" : "fail", "errors" : {}, "message" : "Error"}       

        if not result:
            result =  {"value" : "success",
                       "result" : {"current_instruction_complete" : session_player.current_instruction_complete, 
                        }}
        


# def take_next_instruction(session_id, session_player_id, data):
#     '''
#     take show next instruction page
#     '''

#     logger = logging.getLogger(__name__) 
#     logger.info(f"Take next instruction: {session_id} {session_player_id} {data}")

#     try:       

#         session = Session.objects.get(id=session_id)
#         session_player = session.session_players.get(id=session_player_id)

#         direction = data["direction"]

#         #move to next instruction
#         if direction == 1:
#             #advance furthest instruction complete
#             if session_player.current_instruction_complete < session_player.current_instruction:
#                 session_player.current_instruction_complete = copy(session_player.current_instruction)

#             if session_player.current_instruction < session_player.parameter_set_player.instruction_set.instructions.count():
#                 session_player.current_instruction += 1
#         elif session_player.current_instruction > 1:
#              session_player.current_instruction -= 1

#         session_player.save()

#     except ObjectDoesNotExist:
#         logger.warning(f"take_finish_instructions not found: {session_player_id}")
#         return {"value" : "fail", "errors" : {}, "message" : "Instruction Error."} 
#     except KeyError:
#         logger.warning(f"take_finish_instructions key error: {session_player_id}")
#         return {"value" : "fail", "errors" : {}, "message" : "Instruction Error."}       
    
#     return {"value" : "success",
#             "result" : {"current_instruction" : session_player.current_instruction,
#                         "id" : session_player_id,
#                         "current_instruction_complete" : session_player.current_instruction_complete, 
#                         }}

# def take_finish_instructions(session_id, session_player_id, data):
#     '''
#     take finish instructions
#     '''

#     logger = logging.getLogger(__name__) 
#     logger.info(f"Take finish instructions: {session_id} {session_player_id} {data}")

#     try:       

#         session = Session.objects.get(id=session_id)
#         session_player = session.session_players.get(id=session_player_id)

#         session_player.current_instruction_complete = session_player.parameter_set_player.instruction_set.instructions.count()
#         session_player.instructions_finished = True
#         session_player.save()

#     except ObjectDoesNotExist:
#         logger.warning(f"take_finish_instructions : {session_player_id}")
#         return {"value" : "fail", "errors" : {}, "message" : "Error"}       
    
#     return {"value" : "success",
#             "result" : {"instructions_finished" : session_player.instructions_finished,
#                         "id" : session_player_id,
#                         "current_instruction_complete" : session_player.current_instruction_complete, 
#                         }}

# def take_current_instruction_complete(session_id, session_player_id, data):
#     '''
#     take current instruction complete
#     '''

#     logger = logging.getLogger(__name__) 
#     logger.info(f"Take current instruction complete: {session_id} {session_player_id} {data}")

#     try:       

#         session = Session.objects.get(id=session_id)
#         session_player = session.session_players.get(id=session_player_id)

#         session_player.current_instruction_complete = data["page_number"]
#         session_player.save()

#     except ObjectDoesNotExist:
#         logger.warning(f"take_current_instruction_complete : {session_player_id}")
#         return {"value" : "fail", "errors" : {}, "message" : "Error"}       
    
#     return {"value" : "success",
#             "result" : {"current_instruction_complete" : session_player.current_instruction_complete, 
#                         }}