'''
parameterset player edit form
'''

from django import forms

from main.models import ParameterSetGroup
from main.models import ParameterSetPlayer

class ParameterSetPlayerForm(forms.ModelForm):
    '''
    parameterset player edit form
    '''

    id_label = forms.CharField(label='Label Used in Chat',
                               widget=forms.TextInput(attrs={"v-model":"current_parameter_set_player.id_label",}))
    
    parameter_set_group = forms.ModelChoiceField(label='Group',
                                                 queryset=ParameterSetGroup.objects.none(),
                                                 widget=forms.Select(attrs={"v-model":"current_parameter_set_player.parameter_set_group",}))
    
    start_x = forms.IntegerField(label='Starting Location X',
                                 min_value=0,
                                 widget=forms.NumberInput(attrs={"v-model":"current_parameter_set_player.start_x",
                                                                 "step":"1",
                                                                 "min":"0"}))

    start_y = forms.IntegerField(label='Starting Location Y',
                                 min_value=0,
                                 widget=forms.NumberInput(attrs={"v-model":"current_parameter_set_player.start_y",
                                                                 "step":"1",
                                                                 "min":"0"}))
    
    hex_color = forms.CharField(label='Hex Color (e.g. 0x00AABB)',
                                widget=forms.TextInput(attrs={"v-model":"current_parameter_set_player.hex_color",}))

    class Meta:
        model=ParameterSetPlayer
        fields =['id_label', 'parameter_set_group', 'start_x', 'start_y', 'hex_color']
    
