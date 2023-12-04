'''
parameterset barrier edit form
'''

from django import forms
from django.db.models.query import RawQuerySet

from main.models import ParameterSetBarrier
from main.models import ParameterSetGroup
from main.models import ParameterSetPlayer

class ParameterSetBarrierForm(forms.ModelForm):
    '''
    parameterset barrier edit form
    '''

    info = forms.CharField(label='Info',
                           required=False,
                           widget=forms.TextInput(attrs={"v-model":"current_parameter_set_barrier.info",}))
    
    start_x = forms.IntegerField(label='X Location',
                                 min_value=0,
                                 widget=forms.NumberInput(attrs={"v-model":"current_parameter_set_barrier.start_x",
                                                                 "step":"1",
                                                                 "min":"0"}))

    start_y = forms.IntegerField(label='Y Location',
                                 min_value=0,
                                 widget=forms.NumberInput(attrs={"v-model":"current_parameter_set_barrier.start_y",
                                                                 "step":"1",
                                                                 "min":"0"}))
    
    width = forms.IntegerField(label='Width',
                                 min_value=0,
                                 widget=forms.NumberInput(attrs={"v-model":"current_parameter_set_barrier.width",
                                                                 "step":"1",
                                                                 "min":"0"}))

    height = forms.IntegerField(label='Height',
                                 min_value=0,
                                 widget=forms.NumberInput(attrs={"v-model":"current_parameter_set_barrier.height",
                                                                 "step":"1",
                                                                 "min":"0"}))
    
    text = forms.CharField(label='Text',
                            required=False,
                            widget=forms.TextInput(attrs={"v-model":"current_parameter_set_barrier.text",}))
    
    rotation = forms.IntegerField(label='Text Rotation (degrees)',
                                 min_value=0,
                                 max_value=360,
                                 widget=forms.NumberInput(attrs={"v-model":"current_parameter_set_barrier.rotation",
                                                                    "step":"1",
                                                                    "min":"0",
                                                                    "max":"360"}))
    
    parameter_set_groups = forms.ModelMultipleChoiceField(label='Blocked Groups',
                                                          required=False,
                                                          queryset=ParameterSetGroup.objects.none(),
                                                          widget=forms.CheckboxSelectMultiple(attrs={"v-model":"current_parameter_set_barrier.parameter_set_groups",
                                                                                                     "class":"selectpicker" }))
    
    parameter_set_players = forms.ModelMultipleChoiceField(label='Blocked Players',
                                                            required=False,
                                                            queryset=ParameterSetPlayer.objects.none(),
                                                            widget=forms.CheckboxSelectMultiple(attrs={"v-model":"current_parameter_set_barrier.parameter_set_players",
                                                                                                       "class":"selectpicker" }))

    period_on = forms.IntegerField(label='Period On',
                                   min_value=1,
                                   widget=forms.NumberInput(attrs={"v-model":"current_parameter_set_barrier.period_on",
                                                                   "step":"1",
                                                                   "min":"1"}))
    
    period_off = forms.IntegerField(label='Period Off',
                                    min_value=2,
                                    widget=forms.NumberInput(attrs={"v-model":"current_parameter_set_barrier.period_off",
                                                                    "step":"1",
                                                                    "min":"2"}))

    class Meta:
        model=ParameterSetBarrier
        fields =['info', 'text', 'rotation', 'parameter_set_groups', 'parameter_set_players', 'start_x', 'start_y', 'width', 'height', 'period_on', 'period_off']
    
