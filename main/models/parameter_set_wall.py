'''
parameterset wall 
'''

from django.db import models
from django.core.serializers.json import DjangoJSONEncoder

from main.models import ParameterSet

import main

class ParameterSetWall(models.Model):
    '''
    parameter set wall
    '''

    parameter_set = models.ForeignKey(ParameterSet, on_delete=models.CASCADE, related_name="parameter_set_walls")

    info = models.CharField(verbose_name='Info', blank=True, null=True, max_length=100, default="Info Here")

    start_x = models.IntegerField(verbose_name='Location X', default=50)            #location x and y
    start_y = models.IntegerField(verbose_name='Location Y', default=50)
    
    width = models.IntegerField(verbose_name='Width', default=50)                    #width and height
    height = models.IntegerField(verbose_name='Height', default=50)

    timestamp = models.DateTimeField(auto_now_add=True)
    updated= models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.info)

    class Meta:
        verbose_name = 'Parameter Set Wall'
        verbose_name_plural = 'Parameter Set Walls'
        ordering = ['id']

    def from_dict(self, new_ps):
        '''
        copy source values into this period
        source : dict object of parameterset player
        '''
        self.info = new_ps.get("info")
        
        self.start_x = new_ps.get("start_x")
        self.start_y = new_ps.get("start_y")

        self.width = new_ps.get("width")
        self.height = new_ps.get("height")

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
        self.parameter_set.json_for_session["parameter_set_walls"][self.id] = self.json()

        self.parameter_set.save()

        self.save()

    def json(self):
        '''
        return json object of model
        '''
        
        return{

            "id" : self.id,
            "info" : self.info,
            "start_x" : self.start_x,
            "start_y" : self.start_y,
            "width" : self.width,
            "height" : self.height,
        }
    
    def get_json_for_subject(self, update_required=False):
        '''
        return json object for subject screen, return cached version if unchanged
        '''

        return self.json()


