'''
core socket communication mixin
'''
import json
import logging
import sys

from asgiref.sync import sync_to_async

from channels.generic.websocket import AsyncWebsocketConsumer

from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction

from main.models import Session
from main.models import SessionPlayer

class SocketConsumerMixin(AsyncWebsocketConsumer):
    '''
    core socket communication functions
    '''
    room_name = None
    room_group_name = None            #channel that consumer listens on
    player_key = ""                   #SessionPlayer.player_key
    thread_sensitive = False   
    controlling_channel = None        #channel that is controlling the session

    async def connect(self):
        '''
        inital connection from websocket
        '''
        self.thread_sensitive = True if hasattr(sys, '_called_from_test') else False
        
        kwargs = self.scope['url_route']['kwargs']
        self.room_name =  kwargs.get('room_name')
        page_key =  kwargs.get('page_key',"")
        
        self.player_key =  kwargs.get('player_key',"")

        #self.room_group_name = room_name + page_key
        self.room_group_name = f'{page_key}-{self.room_name}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        result = await sync_to_async(take_handle_dis_connect, thread_sensitive=self.thread_sensitive)(self.player_key, True)

        session = await Session.objects.filter(channel_key=self.room_name).afirst()

        #send updated connection status to all users
        await self.channel_layer.group_send(
                self.room_group_name,
                {"type": "update_connection_status",
                 "data": result,
                 "sender_channel_name": self.channel_name,
                 "connect_or_disconnect": "connect",
                 "session_id": session.id if session else None,
                },
            )

        logger = logging.getLogger(__name__) 
        logger.info(f"SocketConsumerMixin Connect channel name: {self.channel_name}, room group name: {self.room_group_name}")

        await self.accept()

    async def disconnect(self, close_code):
        '''
        disconnect websockeet
        '''

        #store world state if this channel is controlling the session
        # if self.controlling_channel == self.channel_name:
        #     await self.store_world_state(force_store=True)

        result = await sync_to_async(take_handle_dis_connect, thread_sensitive=False)(self.player_key, False)

        #send updated connection status to all users
        await self.channel_layer.group_send(
                self.room_group_name,
                {"type": "update_connection_status",
                 "data": result,
                 "sender_channel_name": self.channel_name,
                 "connect_or_disconnect": "disconnect",
                },
            )
       
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        '''
        incoming data from websocket
        '''
        text_data_json = json.loads(text_data)

        message_type = text_data_json['message_type']    #name of child method to be called
        message_text = text_data_json['message_text']    #data passed to above method
        message_target = text_data_json.get('message_target', None)  #group or individual channel

        # Check if staff users are logged in
        if not hasattr(sys, '_called_from_test'):
            if not self.scope["user"].id:
                if self.player_key == self.room_name:
                    await self.send(text_data=json.dumps({"message":{"message_type":message_type,
                                                          "status": "fail", 
                                                          "message_text": "You must log in."}}))
                    return

        # Send message to target
        if not message_target or message_target == "self":
            await self.channel_layer.send(
                self.channel_name,
                {
                    'type': message_type,
                    'message_text': message_text
                }
            )
        elif message_target == "group":
            if self.controlling_channel:

                await self.channel_layer.send(
                    self.controlling_channel,
                    {
                        'type': message_type,
                        'message_text': message_text,
                        'sender_channel_name': self.channel_name,
                        'player_key': self.player_key,
                    }
                )

def take_handle_dis_connect(connection_uuid, value):
    '''
    handle socket disconnect
    '''
    logger = logging.getLogger(__name__) 
    logger.info(f"take_handle_dis_connect: {connection_uuid} {value}")

    try:
        with transaction.atomic():
            session_player = SessionPlayer.objects.select_for_update().get(player_key=connection_uuid)
            session_player.connecting = False

            if value:
                session_player.connected_count += 1
            else:
                session_player.connected_count -= 1

            if session_player.connected_count < 0:
                session_player.connected_count = 0

            session_player.save()

        return {"value" : "success",  "result" : {"id" : session_player.id, "player_key" : f'{session_player.player_key}', "connected_count" : session_player.connected_count}}              

    except ObjectDoesNotExist:
        logger.warning(f"take_handle_dis_connect session player not found: {connection_uuid} {value}")
        return {"value" : "fail",  "result" : {}}
