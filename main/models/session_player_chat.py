'''
session player chat
'''

#import logging

from django.db import models
from django.db.models import Q
from django.db.models import F

from main.models import SessionPlayer
from main.models import SessionPeriod

from main.globals import ChatTypes

class SessionPlayerChat(models.Model):
    '''
    session player move model
    '''
    session_period = models.ForeignKey(SessionPeriod, on_delete=models.CASCADE, related_name="session_player_chats_a")
    session_player = models.ForeignKey(SessionPlayer, on_delete=models.CASCADE, related_name="session_player_chats_b")

    session_player_recipients = models.ManyToManyField(SessionPlayer, related_name="session_player_chats_c")

    text = models.CharField(max_length = 1000, default="Chat here", verbose_name="Chat Text")             #chat text
    chat_type = models.CharField(max_length=100, choices=ChatTypes.choices, verbose_name="Chat Type")     #target of chat

    time_remaining = models.IntegerField(verbose_name='Good one amount', default=0)                                              #amount time left in period when move made

    timestamp = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.id}"

    class Meta:
        
        verbose_name = 'Session Player Chat'
        verbose_name_plural = 'Session Player Chats'
        ordering = ['timestamp']
        constraints = [
             models.CheckConstraint(check=~Q(text=''), name='text_not_empty'),
        ]

    def write_action_download_csv(self, writer):
        '''
        take csv writer and add row
        '''        
       
        writer.writerow([self.session_player.session.id,
                        self.session_period.period_number,
                        self.time_remaining,
                        self.session_player.player_number,
                        self.session_player.parameter_set_player.id_label,
                        "Chat",
                        self.text,
                        self.json_csv(),
                        self.timestamp])

    def json_csv(self):
        '''
        json object for csv download
        '''
        return{

            "sender_client_number" : self.session_player.player_number,

            "session_player_recipients" : [i.parameter_set_player.id_label for i in self.session_player_recipients.all()],

            "text" : self.text,
            "chat_type" : self.chat_type,
        }

    def json_for_subject(self):
        '''
        json object of model
        '''

        return{
            "id" : self.id,    
            "sender_label" : self.session_player.parameter_set_player.id_label,  
            "sender_id" : self.session_player.id,    
            "text" : self.text,
        }
        
    #return json object of class
    def json_for_staff(self):
        '''
        json object of model
        '''

        return{
            "id" : self.id,         

            "sender_label" : self.session_player.parameter_set_player.id_label,

            "session_player_recipients" : [i.parameter_set_player.id_label for i in self.session_player_recipients.all()],

            "text" : self.text,
            "chat_type" : self.chat_type,
        }
        