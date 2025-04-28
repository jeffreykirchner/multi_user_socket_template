'''
parameterset player 
'''

from django.db import models
from django.core.serializers.json import DjangoJSONEncoder

from main.models import ParameterSet
from main.models import ParameterSetGroup
from main.models import InstructionSet

import main

class ParameterSetPlayer(models.Model):
    '''
    session player parameters 
    '''

    parameter_set = models.ForeignKey(ParameterSet, on_delete=models.CASCADE, related_name="parameter_set_players")
    parameter_set_group = models.ForeignKey(ParameterSetGroup, on_delete=models.SET_NULL, related_name="parameter_set_players_b", blank=True, null=True)
    instruction_set = models.ForeignKey(InstructionSet, on_delete=models.SET_NULL, related_name="parameter_set_players_c", blank=True, null=True)

    id_label = models.CharField(verbose_name='ID Label', max_length=2, default="1")      #id label shown on screen to subjects
    player_number = models.IntegerField(verbose_name='Player number', default=0)         #player number, from 1 to N 

    start_x = models.IntegerField(verbose_name='Start Location X', default=50)                #starting location x and y
    start_y = models.IntegerField(verbose_name='Start Location Y', default=50)
    hex_color = models.CharField(verbose_name='Hex Color', max_length = 30, default="0x000000") #color of player

    timestamp = models.DateTimeField(auto_now_add=True)
    updated= models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.id_label)
    
    class Meta:
        verbose_name = 'Parameter Set Player'
        verbose_name_plural = 'Parameter Set Players'
        ordering=['player_number']

    def from_dict(self, new_ps):
        '''
        copy source values into this period
        source : dict object of parameterset player
        '''

        self.id_label = new_ps.get("id_label")[:2]
        self.player_number = new_ps.get("player_number")
        self.start_x = new_ps.get("start_x")
        self.start_y = new_ps.get("start_y")
        self.hex_color = new_ps.get("hex_color")

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
        json_for_session = self.parameter_set.json_for_session
        
        json_for_session["parameter_set_players"][self.id] = self.json()

        self.parameter_set.save()

        self.save()

    def json(self):
        '''
        return json object of model
        '''
        
        return{

            "id" : self.id,

            "parameter_set_group" : self.parameter_set_group.id if self.parameter_set_group else None,
            "instruction_set" : self.instruction_set.id if self.instruction_set else None,
            "instruction_set_label" : self.instruction_set.label if self.instruction_set else "---",

            "player_number" : self.player_number,
            "id_label" : self.id_label,
            "start_x" : self.start_x,
            "start_y" : self.start_y,
            "hex_color" : self.hex_color,
        }
    
    def get_json_for_subject(self, update_required=False):
        '''
        return json object for subject screen, return cached version if unchanged
        '''

        v = self.parameter_set.json_for_session["parameter_set_players"][str(self.id)]

        # edit v as needed

        return v


