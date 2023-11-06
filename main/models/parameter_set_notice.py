'''
parameterset notice 
'''

from django.db import models
from django.core.serializers.json import DjangoJSONEncoder

from main.models import ParameterSet

import main

class ParameterSetNotice(models.Model):
    '''
    parameter set notice
    '''

    parameter_set = models.ForeignKey(ParameterSet, on_delete=models.CASCADE, related_name="parameter_set_notices")

    text = models.CharField(verbose_name='Info', blank=True, null=True, max_length=200, default="Info Here")

    start_period = models.IntegerField(verbose_name='Starting Period', default=1)            #location x and y
    start_time = models.IntegerField(verbose_name='Starting Time', default=30)
    
    end_period = models.IntegerField(verbose_name='Width', default=1)                    #width and height
    end_time = models.IntegerField(verbose_name='Height', default=0)

    timestamp = models.DateTimeField(auto_now_add=True)
    updated= models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.text} period: {self.start_period}, time: {self.start_time})'

    class Meta:
        verbose_name = 'Parameter Set Notice'
        verbose_name_plural = 'Parameter Set Notices'
        ordering = ['id']

    def from_dict(self, new_ps):
        '''
        copy source values into this period
        source : dict object of parameterset player
        '''
        self.text = new_ps.get("text")

        self.start_period = new_ps.get("start_period", 1)
        self.start_time = new_ps.get("start_time", 30)

        self.end_period = new_ps.get("end_period", 1)
        self.end_time = new_ps.get("end_time", 0)

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
        self.parameter_set.json_for_session["parameter_set_notices"][self.id] = self.json()

        self.parameter_set.save()

        self.save()

    def json(self):
        '''
        return json object of model
        '''
        
        return{

            "id" : self.id,
            "text" : self.text,
            "start_period" : self.start_period,
            "start_time" : self.start_time,
            "end_period" : self.end_period,
            "end_time" : self.end_time,
        }
    
    def get_json_for_subject(self, update_required=False):
        '''
        return json object for subject screen, return cached version if unchanged
        '''

        return self.json()


