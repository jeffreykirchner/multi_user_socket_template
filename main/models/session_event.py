'''
session event model
'''

#import logging

from django.db import models
from django.core.serializers.json import DjangoJSONEncoder

from main.models import SessionPeriod

import main

class SessionEvent(models.Model):
    '''
    session events model
    '''
    session_period = models.ForeignKey(SessionPeriod, on_delete=models.CASCADE, related_name="session_events")

    period_number = models.IntegerField(default=1, verbose_name="Period Number")
    time_remaining = models.IntegerField(default=0, verbose_name="Time Remaining")
    type = models.CharField(max_length=255, default="", verbose_name="Event Type")
    data = models.JSONField(encoder=DjangoJSONEncoder, null=True, blank=True, verbose_name="Event Data")
     
    timestamp = models.DateTimeField(auto_now_add=True)
    updated= models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.period_number} - {self.time_remaining} - {self.type}"

    class Meta:

        verbose_name = 'Session Event'
        verbose_name_plural = 'Session Events'
        ordering = ['period_number', 'time_remaining']

    def json(self):
        '''
        json object of model
        '''

        return{
            "id" : self.id,
            "period_number" : self.period_number,
            "time_remaining" : self.time_remaining,
            "type" : self.type,
            "data" : self.data,
        }
        