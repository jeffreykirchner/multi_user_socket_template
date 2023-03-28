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

    timestamp = models.DateTimeField(auto_now_add=True)
    updated= models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.id)

    class Meta:
        verbose_name = 'Parameter Set Player'
        verbose_name_plural = 'Parameter Set Players'
        ordering=['player_number']

    def from_dict(self, new_ps):
        '''
        copy source values into this period
        source : dict object of parameterset player
        '''

        self.id_label = new_ps.get("id_label")
        self.player_number = new_ps.get("player_number")

        self.save()
        
        message = "Parameters loaded successfully."

        return message
    
    def setup(self):
        '''
        default setup
        '''    
        self.save()
    
    def update_json_local(self):
        '''
        update parameter set json
        '''
        self.parameter_set.json_for_session["parameter_set_players"][self.id] = self.json()
        self.parameter_set.save()

        self.save()

    def json(self):
        '''
        return json object of model
        '''
        
        return{

            "id" : self.id,
            "player_number" : self.player_number,
            "id_label" : self.id_label,
        }
    
    def get_json_for_subject(self, update_required=False):
        '''
        return json object for subject screen, return cached version if unchanged
        '''

        if not self.parameter_set.json_for_session:
            return None
        
        if not self.parameter_set.json_for_session.get("parameter_set_players", None):
            return None

        v = self.parameter_set.json_for_session["parameter_set_players"][str(self.id)]

        # edit v as needed

        return v


