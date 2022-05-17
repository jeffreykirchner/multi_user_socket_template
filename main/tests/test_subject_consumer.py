'''
build test
'''
import imp
import logging
import sys

from django.test import TestCase


from main.models import Session

from main.consumers import take_chat
from main.consumers import take_next_phase

import main

class TestSubjectConsumer(TestCase):
    fixtures = ['auth_user.json', 'main.json']

    user = None
    session = None
    session_player_1 = None

    def setUp(self):
        sys._called_from_test = True
        logger = logging.getLogger(__name__)

        self.session = Session.objects.all().first()
    
    def test_chat_group(self):
        '''
        test get session subject from consumer
        '''
        session_player_1 = self.session.session_players.get(player_number=1)

        data = {'recipients': 'all', 'text': 'hello!'}

        #session not started
        r = take_chat(self.session.id, session_player_1.id, data)
        self.assertEqual(r["value"], "fail")
        self.assertEqual(r["result"]["message"], "Session not started.")

        self.session.start_experiment()

        #instructions open
        r = take_chat(self.session.id, session_player_1.id, data)
        self.assertEqual(r["value"], "fail")
        self.assertEqual(r["result"]["message"], "Session not running.")

        #run phase
        take_next_phase(self.session.id, {})
        r = take_chat(self.session.id, session_player_1.id, data)
        self.assertEqual(r["value"], "success")
        self.assertEqual('hello!', session_player_1.session_player_chats_b.first().text)
        
        #finish experiment
        take_next_phase(self.session.id, {})
        r = take_chat(self.session.id, session_player_1.id, data)
        self.assertEqual(r["value"], "fail")
        self.assertEqual(r["result"]["message"], "Session finished.")
