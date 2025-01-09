'''
paramters model form
'''
import pytz

from django import forms
from tinymce.widgets import TinyMCE

from main.models import Parameters
from main.models import ParameterSet

class ParametersForm(forms.ModelForm):
    '''
    paramters model form
    '''
    contact_email = forms.CharField(label='Contact Email Address',
                                    widget=forms.TextInput(attrs={"size":"125"}))

    site_url = forms.CharField(label='Site URL',
                               widget=forms.TextInput(attrs={"size":"125"}))

    experiment_time_zone = forms.ChoiceField(label="Study Timezone",
                                             choices=[(tz, tz) for tz in pytz.all_timezones])

    invitation_subject = forms.CharField(label='Invitation Subject',
                               widget=forms.TextInput(attrs={"size":"125"}))
    
    invitation_text = forms.CharField(label='Invitation Text',
                                      widget=TinyMCE(attrs={"rows":20, "cols":200, "plugins": "link image code"}))
    
    default_parameter_set = forms.ModelChoiceField(queryset=ParameterSet.objects.filter(session__soft_delete=False), 
                                                   label='Default Parameter Set', 
                                                   required=False)


    class Meta:
        model=Parameters
        fields = ('__all__')
