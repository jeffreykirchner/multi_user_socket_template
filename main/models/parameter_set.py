'''
parameter set
'''
import logging

from decimal import Decimal

from django.db import models
from django.db.utils import IntegrityError

from main import globals

from main.models import InstructionSet

import main

class ParameterSet(models.Model):
    '''
    parameter set
    '''    
    instruction_set = models.ForeignKey(InstructionSet, on_delete=models.CASCADE, related_name="parameter_sets")

    period_count = models.IntegerField(verbose_name='Number of periods', default=20)                          #number of periods in the experiment
    period_length = models.IntegerField(verbose_name='Period Length, Production', default=60           )      #period length in seconds
    
    private_chat = models.BooleanField(default=True, verbose_name='Private Chat')                          #if true subjects can privately chat one on one
    show_instructions = models.BooleanField(default=True, verbose_name='Show Instructions')                #if true show instructions

    survey_required = models.BooleanField(default=False, verbose_name="Survey Required")                      #if true show the survey below
    survey_link = models.CharField(max_length = 1000, default = '', verbose_name = 'Survey Link', blank=True, null=True)

    test_mode = models.BooleanField(default=False, verbose_name='Test Mode')                                #if true subject screens will do random auto testing

    timestamp = models.DateTimeField(auto_now_add=True)
    updated= models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.id)

    class Meta:
        verbose_name = 'Parameter Set'
        verbose_name_plural = 'Parameter Sets'
    
    def from_dict(self, new_ps):
        '''
        load values from dict
        '''
        logger = logging.getLogger(__name__) 

        message = "Parameters loaded successfully."
        status = "success"

        try:
            self.period_count = new_ps.get("period_count")
            self.period_length = new_ps.get("period_length")

            self.private_chat = new_ps.get("private_chat")

            self.show_instructions = new_ps.get("show_instructions")

            self.survey_required = new_ps.get("survey_required")
            self.survey_link = new_ps.get("survey_link")

            self.instruction_set = InstructionSet.objects.get(label=new_ps.get("instruction_set")["label"])

            self.save()

            #parameter set players
            new_parameter_set_players = new_ps.get("parameter_set_players")

            if len(new_parameter_set_players) > self.parameter_set_players.count():
                #add more players
                new_player_count = len(new_parameter_set_players) - self.parameter_set_players.count()

                for i in range(new_player_count):
                    self.add_new_player(self.parameter_set_types.first())

            elif len(new_parameter_set_players) < self.parameter_set_players.count():
                #remove excess players

                extra_player_count = self.parameter_set_players.count() - len(new_parameter_set_players)

                for i in range(extra_player_count):
                    self.parameter_set_players.last().delete()

            new_parameter_set_players = new_ps.get("parameter_set_players")
            for index, p in enumerate(self.parameter_set_players.all()):                
                p.from_dict(new_parameter_set_players[index])

        except IntegrityError as exp:
            message = f"Failed to load parameter set: {exp}"
            status = "fail"
            logger.warning(message)

        return {"status" : status, "message" :  message}

    def setup(self):
        '''
        default setup
        '''    
        pass

    def add_new_player(self):
        '''
        add a new player of type subject_type
        '''

        #24 players max
        if self.parameter_set_players.all().count() >= 24:
            return

        player = main.models.ParameterSetPlayer()
        player.parameter_set = self

        player.save()

    def json(self):
        '''
        return json object of model
        '''
        return{
            "id" : self.id,
            "period_count" : self.period_count,

            "period_length" : self.period_length,

            "private_chat" : "True" if self.private_chat else "False",
            "show_instructions" : "True" if self.show_instructions else "False",
            "instruction_set" : self.instruction_set.json_min(),

            "parameter_set_players" : [p.json() for p in self.parameter_set_players.all()],

            "survey_required" : "True" if self.survey_required else "False",
            "survey_link" : self.survey_link,  

            "test_mode" : "True" if self.test_mode else "False",
        }
    
    def json_for_subject(self):
        '''
        return json object for subject
        '''
        return{
            "id" : self.id,
            
            "period_length" : self.period_length,
            "show_instructions" : "True" if self.show_instructions else "False",
            "private_chat" : self.private_chat,

            "survey_required" : "True" if self.survey_required else "False",
            "survey_link" : self.survey_link,  

            "test_mode" : self.test_mode,
        }

