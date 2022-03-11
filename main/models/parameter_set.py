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

#experiment session parameters
class ParameterSet(models.Model):
    '''
    parameter set
    '''    
    instruction_set = models.ForeignKey(InstructionSet, on_delete=models.CASCADE, related_name="parameter_sets")

    period_count = models.IntegerField(verbose_name='Number of periods', default=20)                          #number of periods in the experiment
    period_length = models.IntegerField(verbose_name='Period Length, Production', default=60           )      #period length in seconds
    
    private_chat = models.BooleanField(default=True, verbose_name = 'Private Chat')                          #if true subjects can privately chat one on one
    show_instructions = models.BooleanField(default=True, verbose_name = 'Show Instructions')                #if true show instructions

    test_mode = models.BooleanField(default=False, verbose_name = 'Test Mode')                                #if true subject screens will do random auto testing

    timestamp = models.DateTimeField(auto_now_add= True)
    updated= models.DateTimeField(auto_now= True)

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
            self.period_length = new_ps.get("period_length_production")

            self.private_chat = new_ps.get("private_chat")

            self.show_instructions = new_ps.get("show_instructions")

            self.show_avatars = new_ps.get("show_avatars")
            self.avatar_assignment_mode = new_ps.get("avatar_assignment_mode")

            self.avatar_grid_row_count = new_ps.get("avatar_grid_row_count")
            self.avatar_grid_col_count = new_ps.get("avatar_grid_col_count")
            self.avatar_grid_text = new_ps.get("avatar_grid_text")

            self.save()

            #map of old pk to new pk
            parameter_set_type_pk_map = {}
            parameter_set_goods_pk_map = {}
            
            #parameter set players
            parameter_set_goods = self.parameter_set_goods.all()
            new_parameter_set_players = new_ps.get("parameter_set_players")

            if len(new_parameter_set_players) > self.parameter_set_players.count():
                #add more players
                new_player_count = len(new_parameter_set_players) - self.parameter_set_players.count()

                for i in range(new_player_count):
                    self.add_new_player(self.parameter_set_types.first(),
                                        i,
                                        parameter_set_goods[0],
                                        parameter_set_goods[1],
                                        parameter_set_goods[2])

            elif len(new_parameter_set_players) < self.parameter_set_players.count():
                #remove excess players

                extra_player_count = self.parameter_set_players.count() - len(new_parameter_set_players)

                for i in range(extra_player_count):
                    self.parameter_set_players.last().delete()
            
            self.update_group_counts()

            new_parameter_set_players = new_ps.get("parameter_set_players")
            for index, p in enumerate(self.parameter_set_players.all()):                
                p.from_dict(new_parameter_set_players[index], parameter_set_type_pk_map, parameter_set_goods_pk_map)

            #parameter set avatars
            self.update_choice_avatar_counts()
            new_parameter_set_avatars = new_ps.get("parameter_set_avatars")
            for index, p in enumerate(new_parameter_set_avatars):
                a=self.parameter_set_avatars_a.get(grid_location_row=p["grid_location_row"], grid_location_col=p["grid_location_col"])
                a.from_dict(p)

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

    def add_new_player(self, subject_type, location, good_one, good_two, good_three):
        '''
        add a new player of type subject_type
        '''

        #24 players max
        if self.parameter_set_players.all().count() >= 24:
            return

        player = main.models.ParameterSetPlayer()

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

            "test_mode" : "True" if self.test_mode else "False",
        }
    
    def json_for_subject(self):
        '''
        return json object for subject
        '''
        return{
            "id" : self.id,
            
            "period_length" : self.period_length_production,
            "show_instructions" : "True" if self.show_instructions else "False",

            "test_mode" : self.test_mode,
        }

