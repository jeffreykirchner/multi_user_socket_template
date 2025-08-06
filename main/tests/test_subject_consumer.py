'''
build test
'''

import logging
import sys
import pytest

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

    def setUp(self):
        sys._called_from_test = True
        logger = logging.getLogger(__name__)

        logger.info('setup tests')

        self.session = Session.objects.filter(title="Sample").first()
        self.assertEqual(self.session.title, "Sample")

    async def set_up_communicators(self, communicator_subjects, communicator_staff):
        '''
        setup the socket communicators
        '''
        logger = logging.getLogger(__name__)

        session_player = await self.session.session_players.afirst()

        connection_path_staff = f"/ws/staff-session/{self.session.channel_key}/session-{self.session.id}/{self.session.channel_key}"

        application = URLRouter(websocket_urlpatterns)
        
        #subjects
        async for i in self.session.session_players.all():
            connection_path_subject = f"/ws/subject-home/{self.session.channel_key}/session-{self.session.id}/{i.player_key}"
            communicator_subjects[i.id] = WebsocketCommunicator(application, connection_path_subject)

            connected_subject, subprotocol_subject = await communicator_subjects[i.id].connect()
            assert connected_subject

            communicator_subjects[i.id].scope["session_player_id"] = i.id

            message = {'message_type': 'get_session',
                       'message_text': {"player_key" :str(i.player_key)}}

            await communicator_subjects[i.id].send_json_to(message)
            response = await communicator_subjects[i.id].receive_json_from()
            # logger.info(response)
            
            self.assertEqual(response['message']['message_type'],'get_session')
            self.assertEqual(response['message']['message_data']['session_player']['id'], i.id)

        #staff
        communicator_staff = WebsocketCommunicator(application, connection_path_staff)
        connected_staff, subprotocol_staff = await communicator_staff.connect()
        assert connected_staff

        # #get staff session
        message = {'message_type': 'get_session',
                   'message_text': {"session_key" :str(self.session.session_key)}}

        await communicator_staff.send_json_to(message)
        response = await communicator_staff.receive_json_from()
        #logger.info(response)
        
        self.assertEqual(response['message']['message_type'],'get_session')

        return communicator_subjects, communicator_staff, 

    async def start_session(self, communicator_subjects, communicator_staff):
        '''
        start session and advance past instructions
        '''
        logger = logging.getLogger(__name__)
        
        # #start session
        message = {'message_type' : 'start_experiment',
                   'message_text' : {},
                   'message_target' : 'self', }

        await communicator_staff.send_json_to(message)

        response = await communicator_staff.receive_json_from(timeout=10)

        for cs in communicator_subjects:
            i = communicator_subjects[cs]
            response = await i.receive_json_from(timeout=10)
            self.assertEqual(response['message']['message_type'],'update_start_experiment')
            message_data = response['message']['message_data']
            self.assertEqual(message_data['value'],'success')
        
        # #advance past instructions
        message = {'message_type' : 'next_phase',
                   'message_text' : {},
                   'message_target' : 'self',}

        await communicator_staff.send_json_to(message)
        
        for j in communicator_subjects:
            i = communicator_subjects[j]
            response = await i.receive_json_from()
            self.assertEqual(response['message']['message_type'],'update_next_phase')
            message_data = response['message']['message_data']
            self.assertEqual(message_data['value'],'success')

        response = await communicator_staff.receive_json_from()

        return communicator_subjects, communicator_staff
    
    @pytest.mark.asyncio
    async def test_chat_group(self):
        '''
        test get session subject from consumer
        '''        
        communicator_subjects = {}
        communicator_staff = None

        logger = logging.getLogger(__name__)
        logger.info(f"called from test {sys._called_from_test}" )

        communicator_subjects, communicator_staff = await self.set_up_communicators(communicator_subjects, communicator_staff)
        communicator_subjects, communicator_staff = await self.start_session(communicator_subjects, communicator_staff)

        await communicator_staff.send_json_to({"message_type": "get_world_state_local", "message_text": {}})
        response = await communicator_staff.receive_json_from()
        world_state = response['message']['message_data']

        session = await Session.objects.prefetch_related('parameter_set').aget(id=self.session.id)

        self.assertEqual(world_state['current_experiment_phase'], 'Run')

        player_id = next(iter(communicator_subjects))
        communicator_subject = communicator_subjects[player_id]

        #send chat
        message = {'message_type' : 'chat',
                   'message_text' : {"text" : "How do you do now?",
                                     "current_location" : {'x':1, 'y':2}},
                   'message_target' : 'group',}

        await communicator_subject.send_json_to(message)
        response = await communicator_subject.receive_json_from()
        message_data = response['message']['message_data']
        self.assertEqual(message_data['status'],'success')

        for j in communicator_subjects:
            i = communicator_subjects[j]
            await i.disconnect()

        await communicator_staff.disconnect()
