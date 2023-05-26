'''
session period model
'''

#import logging

from django.db import models

from main.models import Session

import main

class SessionPeriod(models.Model):
    '''
    session period model
    '''
    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name="session_periods")

    period_number = models.IntegerField()                       #period number from 1 to N

    timestamp = models.DateTimeField(auto_now_add=True)
    updated= models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.id}"

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['session', 'period_number'], name='unique_SD')
        ]
        verbose_name = 'Session Period'
        verbose_name_plural = 'Session Periods'
        ordering = ['period_number']
    
    async def store_earnings(self, world_state_local):
        '''
        convert collected tokens into cash earnings
        '''
        result = {}

        objs = self.session.session_players.all()
        
        async for i in objs:
            sid = str(i.id)
            speriod_id = str(self.id)

            i.earnings += world_state_local["session_players"][sid]["inventory"][speriod_id]
            
            result[sid] = {}
            result[sid]["total_earnings"] = i.earnings
            result[sid]["period_earnings"] = world_state_local["session_players"][sid]["inventory"][speriod_id]
        
        r = main.models.SessionPlayer.objects.abulk_update(objs, ['earnings'])

        return result

    def json(self):
        '''
        json object of model
        '''

        return{
            "id" : self.id,
            "period_number" : self.period_number,
        }
        