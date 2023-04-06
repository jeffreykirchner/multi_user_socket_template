
import logging
import json

from asgiref.sync import sync_to_async

from django.core.serializers.json import DjangoJSONEncoder

from main.models import Session
from main.models import SessionPlayer
from main.models import SessionPlayerChat

from main.globals import ChatTypes

import main

class ChatMixin():
    '''
    Get chat mixin for subject home consumer
    '''
    async def chat(self, event):
        '''
        take chat from client
        '''        
        data = event["message_text"]
        logger = logging.getLogger(__name__) 
        logger.info(f"take chat: Session {self.session_id}, Player {self.session_player_id}, Data {data}")

        try:
            recipients = data["recipients"] 
            chat_text = data["text"]
        except KeyError:
            return {"value" : "fail", "result" : {"message" : "Invalid chat."}}

        result = {}
        #result["recipients"] = []

        session = await Session.objects.prefetch_related('session_players', 'parameter_set').aget(id=self.session_id)
        session_player = await session.session_players.aget(id=self.session_player_id)
        
        session_player_chat = SessionPlayerChat()

        session_player_chat.session_player = session_player
        session_player_chat.session_period = await session.aget_current_session_period()

        if not session.started:
            result =  {"value" : "fail", "result" : {"message" : "Session not started."}, }
        elif session.finished:
            result = {"value" : "fail", "result" : {"message" : "Session finished."}}
        elif session.current_experiment_phase != main.globals.ExperimentPhase.RUN:
            result = {"value" : "fail", "result" : {"message" : "Session not running."}}
        else :
            if recipients == "all":
                session_player_chat.chat_type = ChatTypes.ALL
            else:
                if not session.parameter_set.private_chat:
                    logger.warning(f"take chat: private chat not enabled :{self.session_id} {self.session_player_id} {data}")
                    result = {"value" : "fail",
                            "result" : {"message" : "Private chat not allowed."}}

                session_player_chat.chat_type = ChatTypes.INDIVIDUAL

            result["chat_type"] = session_player_chat.chat_type
            result["recipients"] = []

            session_player_chat.text = chat_text
            session_player_chat.time_remaining = session.time_remaining

            await sync_to_async(session_player_chat.save, thread_sensitive=self.thread_sensitive)()

            if recipients == "all":
                await sync_to_async(session_player_chat.session_player_recipients.add, thread_sensitive=self.thread_sensitive)(*session.session_players.all())

                result["recipients"] = [i.id for i in session.session_players.all()]
            else:
                sesson_player_target = await SessionPlayer.objects.aget(id=recipients)

                if sesson_player_target in session.session_players.all():
                    await sync_to_async(session_player_chat.session_player_recipients.add, thread_sensitive=self.thread_sensitive)(sesson_player_target)
                else:
                    await sync_to_async(session_player_chat.delete)()
                    logger.warning(f"take chat: chat at none group member : {self.session_id} {self.session_player_id} {data}")
                    result = {"value" : "fail", "result" : {"Player not in group."}}

                result["sesson_player_target"] = sesson_player_target.id

                result["recipients"].append(session_player.id)
                result["recipients"].append(sesson_player_target.id)
            
            result["chat_for_subject"] = await session_player_chat.ajson_for_subject()
            result["chat_for_staff"] = await session_player_chat.ajson_for_staff()

            await sync_to_async(session_player_chat.save, thread_sensitive=self.thread_sensitive)()

            result = {"value" : "success", "result" : result}

        if result["value"] == "fail":
            await self.send(text_data=json.dumps({'message': result}, cls=DjangoJSONEncoder))
            return

        event_result = result["result"]

        message_to_subjects = {}
        message_to_subjects["chat_type"] = event_result["chat_type"]
        message_to_subjects["sesson_player_target"] = event_result.get("sesson_player_target", -1)
        message_to_subjects["chat"] = event_result["chat_for_subject"]
        message_to_subjects["value"] = result["value"]

        message_to_staff = {}
        message_to_staff["chat"] = event_result["chat_for_staff"]

        await self.send_message(message_to_self=message_to_subjects, message_to_subjects=message_to_subjects, message_to_staff=message_to_staff, 
                                message_type=event['type'], send_to_client=True, send_to_group=True)

    async def update_chat(self, event):
        '''
        send chat to clients, if clients can view it
        '''
        subject_data = event["subject_data"]

        if self.channel_name == event['sender_channel_name']:
            return
        
        if subject_data['chat_type'] == "Individual" and \
           subject_data['sesson_player_target'] != self.session_player_id and \
           subject_data['chat']['sender_id'] != self.session_player_id:
            return

        await self.send_message(message_to_self=subject_data, message_to_subjects=None, message_to_staff=None, 
                                message_type=event['type'], send_to_client=True, send_to_group=False)
