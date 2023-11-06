'''
parameterset notice edit form
'''

from django import forms

from main.models import ParameterSetNotice

class ParameterSetNoticeForm(forms.ModelForm):
    '''
    parameterset notice edit form
    '''

    text = forms.CharField(label='Text',
                           required=False,
                           widget=forms.TextInput(attrs={"v-model":"current_parameter_set_notice.text",}))
    
    start_period = forms.IntegerField(label='Starting Period',
                                 min_value=1,
                                 widget=forms.NumberInput(attrs={"v-model":"current_parameter_set_notice.start_period",
                                                                 "step":"1",
                                                                 "min":"0"}))

    start_time = forms.IntegerField(label='Starting Time',
                                    min_value=0,
                                    widget=forms.NumberInput(attrs={"v-model":"current_parameter_set_notice.start_time",
                                                                    "step":"1",
                                                                    "min":"0"}))
    
    end_period = forms.IntegerField(label='Ending Period',
                                    min_value=1,
                                    widget=forms.NumberInput(attrs={"v-model":"current_parameter_set_notice.end_period",
                                                                    "step":"1",
                                                                    "min":"0"}))
    
    end_time = forms.IntegerField(label='Ending Time',
                                    min_value=0,
                                    widget=forms.NumberInput(attrs={"v-model":"current_parameter_set_notice.end_time",
                                                                    "step":"1",
                                                                    "min":"0"}))

    class Meta:
        model=ParameterSetNotice
        fields =[ 'text', 'start_period', 'start_time', 'end_period', 'end_time']
    
