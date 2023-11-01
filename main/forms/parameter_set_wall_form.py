'''
parameterset wall edit form
'''

from django import forms
from django.db.models.query import RawQuerySet

from main.models import ParameterSetWall

class ParameterSetWallForm(forms.ModelForm):
    '''
    parameterset wall edit form
    '''

    info = forms.CharField(label='Info',
                           required=False,
                           widget=forms.TextInput(attrs={"v-model":"current_parameter_set_wall.info",}))
    
    start_x = forms.IntegerField(label='X Location',
                                 min_value=0,
                                 widget=forms.NumberInput(attrs={"v-model":"current_parameter_set_wall.start_x",
                                                                 "step":"1",
                                                                 "min":"0"}))

    start_y = forms.IntegerField(label='Y Location',
                                 min_value=0,
                                 widget=forms.NumberInput(attrs={"v-model":"current_parameter_set_wall.start_y",
                                                                 "step":"1",
                                                                 "min":"0"}))
    
    width = forms.IntegerField(label='Width',
                                 min_value=0,
                                 widget=forms.NumberInput(attrs={"v-model":"current_parameter_set_wall.width",
                                                                 "step":"1",
                                                                 "min":"0"}))

    height = forms.IntegerField(label='Height',
                                 min_value=0,
                                 widget=forms.NumberInput(attrs={"v-model":"current_parameter_set_wall.height",
                                                                 "step":"1",
                                                                 "min":"0"}))

    class Meta:
        model=ParameterSetWall
        fields =['info', 'start_x', 'start_y', 'width', 'height']
    
