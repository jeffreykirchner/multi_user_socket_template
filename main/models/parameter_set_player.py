'''
parameterset player 
'''

from django.db import models
from django.core.serializers.json import DjangoJSONEncoder

from main.models import ParameterSet

import main

class ParameterSetPlayer(models.Model):
    '''
    session player parameters 
    '''

    parameter_set = models.ForeignKey(ParameterSet, on_delete=models.CASCADE, related_name="parameter_set_players")

    id_label = models.CharField(verbose_name='ID Label', max_length=2, default="1")      #id label shown on screen to subjects
    player_number = models.IntegerField(verbose_name='Player number', default=0)         #player number, from 1 to N 

    json_index = models.IntegerField(verbose_name='Parameter set json index', default=0)         #player number, from 1 to N 
    json_for_subject = models.JSONField(encoder=DjangoJSONEncoder, null=True, blank=True)        #json model of parameter set

    timestamp = models.DateTimeField(auto_now_add=True)
    updated= models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.id)

    class Meta:
        verbose_name = 'Parameter Set Player'
        verbose_name_plural = 'Parameter Set Players'
        ordering=['player_number']

    def from_dict(self, source):
        '''
        copy source values into this period
        source : dict object of parameterset player
        '''

        self.id_label = source.get("id_label")

        self.save()
        
        message = "Parameters loaded successfully."

        return message
    
    def update_json_local(self):
        '''
        update parameter set json
        '''
        self.parameter_set.json_for_session[self.json_index] = self.json()
        self.parameter_set.save()

    def json(self):
        '''
        return json object of model
        '''
        
        return{

            "id" : self.id,
            "json_index" : self.json_index,
            "id_label" : self.id_label,
        }
    
    def json_for_subject(self, update_required=False):
        '''
        return json object for subject screen
        '''

        if not self.json_for_session or update_required:
            self.json_for_session = {

                "id" : self.id,
                "id_label" : self.id_label,
                }

            self.save()

        return self.json_for_session


