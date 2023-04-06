'''
build test
'''

import logging
import sys
import pytest
import json

from channels.testing import WebsocketCommunicator
from channels.routing import URLRouter
from asgiref.sync import sync_to_async
from asgiref.sync import async_to_sync

from django.test import TestCase


from main.models import Session

from main.routing import websocket_urlpatterns

class TestSubjectConsumer(TestCase):
    fixtures = ['auth_user.json', 'main.json']

    user = None
    session = None
    session_player_1 = None
    communicator_subject = None
    communicator_staff = None

    def setUp(self):
        sys._called_from_test = True
        logger = logging.getLogger(__name__)

        logger.info('setup tests')

        self.session = Session.objects.all().first()

    async def set_up_communicators(self):
        '''
        setup the socket communicators
        '''
        session_player = await self.session.session_players.afirst()

        connection_path_subject = f"/ws/subject-home/{self.session.channel_key}/session-{self.session.id}/{session_player.player_key}"
        connection_path_staff = f"/ws/staff-session/{self.session.channel_key}/session-{self.session.id}/{self.session.channel_key}"

        application = URLRouter(websocket_urlpatterns)
        
        self.communicator_subject = WebsocketCommunicator(application, connection_path_subject)
        connected_subject, subprotocol_subject = await self.communicator_subject.connect()
        assert connected_subject

        self.communicator_staff = WebsocketCommunicator(application, connection_path_staff)
        connected_staff, subprotocol_staff = await self.communicator_staff.connect()
        assert connected_staff

        #get subject session
        message = {'message_type': 'get_session',
                   'message_text': {"player_key" :str(session_player.player_key)}}

        await self.communicator_subject.send_json_to(message)
        response = await self.communicator_subject.receive_json_from()
        #logger.info(response)
        
        self.assertEquals(response['message']['message_type'],'get_session')
        self.assertEquals(response['message']['message_data']['session_player']['id'], 1042)

        #get staff session
        message = {'message_type': 'get_session',
                   'message_text': {"session_key" :str(self.session.session_key)}}

        await self.communicator_staff.send_json_to(message)
        response = await self.communicator_staff.receive_json_from()
        #logger.info(response)
        
        self.assertEquals(response['message']['message_type'],'get_session')
    
    @pytest.mark.asyncio
    async def test_chat_group(self):
        '''
        test get session subject from consumer
        '''        
        logger = logging.getLogger(__name__)
        logger.info(f"called from test {sys._called_from_test}" )

        await self.set_up_communicators()

        session_player = await self.session.session_players.afirst()

        #send chat
        message = {'message_type' : 'chat',
                   'message_text' : {"recipients": 'all', 'text': 'How do you do?'}}
                                
        await self.communicator_subject.send_json_to(message)
        response = await self.communicator_subject.receive_json_from()
        self.assertEquals(response['message']['value'],'fail')
        self.assertEquals(response['message']['result']['message'],'Session not started.')
        #logger.info(response)

        #start session
        message = {'message_type' : 'start_experiment',
                   'message_text' : {}}

        await self.communicator_staff.send_json_to(message)
        response = await self.communicator_staff.receive_json_from()
        response = await self.communicator_subject.receive_json_from()
        #logger.info(response)

        #advance past instructions
        message = {'message_type' : 'next_phase',
                   'message_text' : {}}

        await self.communicator_staff.send_json_to(message)
        response = await self.communicator_staff.receive_json_from()
        response = await self.communicator_subject.receive_json_from()

        #re-try chat to all
        message = {'message_type' : 'chat',
                   'message_text' : {'recipients': 'all', 'text': 'How do you do now?'}}
                                
        await self.communicator_subject.send_json_to(message)
        response = await self.communicator_subject.receive_json_from()
        self.assertEquals(response['message']['message_data']['value'],'success')
        self.assertEquals(response['message']['message_data']['chat_type'],'All')
        #logger.info(response)

        #try chat to one on one
        message = {'message_type' : 'chat',
                   'message_text' : {'recipients': session_player.id + 1, 'text': 'Word up.'}}
                                
        await self.communicator_subject.send_json_to(message)
        response = await self.communicator_subject.receive_json_from()
        self.assertEquals(response['message']['message_data']['value'],'success')
        self.assertEquals(response['message']['message_data']['chat_type'],'Individual')
        #logger.info(response)

        await self.communicator_subject.disconnect()
        await self.communicator_staff.disconnect()
