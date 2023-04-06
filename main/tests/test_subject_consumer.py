'''
build test
'''

import logging
import sys
import pytest

from channels.testing import WebsocketCommunicator

from django.test import TestCase

from main.models import Session

from main.consumers import SubjectHomeConsumer
from main.consumers.staff.session_consumer_mixins.experiment_controls import take_next_phase

class TestSubjectConsumer(TestCase):
    fixtures = ['auth_user.json', 'main.json']

    user = None
    session = None
    session_player_1 = None

    def setUp(self):
        sys._called_from_test = True
        logger = logging.getLogger(__name__)

        self.session = Session.objects.all().first()
    
    @pytest.mark.asyncio
    async def test_chat_group(self):
        '''
        test get session subject from consumer
        '''
        communicator = WebsocketCommunicator(SubjectHomeConsumer.as_asgi(), "GET", "/test/")
        connected, subprotocol = await communicator.connect()
        assert connected
        
        # session_player_1 = self.session.session_players.get(player_number=1)

        # data = {'recipients': 'all', 'text': 'hello!'}

        # #session not started
        # r = take_chat(self.session.id, session_player_1.id, data)
        # self.assertEqual(r["value"], "fail")
        # self.assertEqual(r["result"]["message"], "Session not started.")

        # self.session.start_experiment()

        # #instructions open
        # r = take_chat(self.session.id, session_player_1.id, data)
        # self.assertEqual(r["value"], "fail")
        # self.assertEqual(r["result"]["message"], "Session not running.")

        # #run phase
        # take_next_phase(self.session.id, {})
        # r = take_chat(self.session.id, session_player_1.id, data)
        # self.assertEqual(r["value"], "success")
        # self.assertEqual('hello!', session_player_1.session_player_chats_b.first().text)
        
        # #finish experiment
        # take_next_phase(self.session.id, {})
        # r = take_chat(self.session.id, session_player_1.id, data)
        # self.assertEqual(r["value"], "fail")
        # self.assertEqual(r["result"]["message"], "Session finished.")
