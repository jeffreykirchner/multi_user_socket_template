'''
Parameterset edit form
'''

from django import forms

from main.models import ParameterSet

import  main

class ParameterSetForm(forms.ModelForm):
    '''
    Parameterset edit form
    '''
    period_count = forms.IntegerField(label='Number of Periods',
                                      min_value=1,
                                      widget=forms.NumberInput(attrs={"v-model":"session.parameter_set.period_count",
                                                                      "step":"1",
                                                                      "min":"1"}))

    period_length = forms.IntegerField(label='Production Length (seconds)',
                                       min_value=1,
                                       widget=forms.NumberInput(attrs={"v-model":"session.parameter_set.period_length",
                                                                       "step":"1",
                                                                       "min":"1"}))
                                       
    private_chat = forms.ChoiceField(label='Private Chat',
                                       choices=((True, 'Yes'), (False,'No' )),
                                       widget=forms.Select(attrs={"v-model":"session.parameter_set.private_chat",}))

    show_instructions = forms.ChoiceField(label='Show Instructions',
                                       choices=((True, 'Yes'), (False,'No' )),
                                       widget=forms.Select(attrs={"v-model":"session.parameter_set.show_instructions",}))
    
    instruction_set = forms.ModelChoiceField(label='Instruction Set',
                                            empty_label=None,
                                            queryset=main.models.InstructionSet.objects.all(),
                                            widget=forms.Select(attrs={"v-model":"session.parameter_set.instruction_set.id"}))

    test_mode = forms.ChoiceField(label='Test Mode',
                                       choices=((True, 'Yes'), (False,'No' )),
                                       widget=forms.Select(attrs={"v-model":"session.parameter_set.test_mode",}))

    class Meta:
        model=ParameterSet
        fields =['period_count', 'period_length', 'private_chat', 'show_instructions', 'instruction_set', 'test_mode']
