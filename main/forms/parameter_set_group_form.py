'''
parameterset group edit form
'''

from django import forms

from main.models import ParameterSetGroup

class ParameterSetGroupForm(forms.ModelForm):
    '''
    parameterset group edit form
    '''
    
    name = forms.CharField(label='Name',
                           widget=forms.TextInput(attrs={"v-model":"current_parameter_set_group.name",
                                                         "autocomplete":"off",}))



    class Meta:
        model=ParameterSetGroup
        fields =['name',]
    
