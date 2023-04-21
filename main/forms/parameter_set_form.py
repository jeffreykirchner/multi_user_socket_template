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
                                      widget=forms.NumberInput(attrs={"v-model":"parameter_set.period_count",
                                                                      "step":"1",
                                                                      "min":"1"}))

    period_length = forms.IntegerField(label='Period Length (seconds)',
                                       min_value=1,
                                       widget=forms.NumberInput(attrs={"v-model":"parameter_set.period_length",
                                                                       "step":"1",
                                                                       "min":"1"}))

    show_instructions = forms.ChoiceField(label='Show Instructions',
                                       choices=((True, 'Yes'), (False,'No' )),
                                       widget=forms.Select(attrs={"v-model":"parameter_set.show_instructions",}))
    
    instruction_set = forms.ModelChoiceField(label='Instruction Set',
                                            empty_label=None,
                                            queryset=main.models.InstructionSet.objects.all(),
                                            widget=forms.Select(attrs={"v-model":"parameter_set.instruction_set.id"}))

    survey_required = forms.ChoiceField(label='Show Survey',
                                       choices=((True, 'Yes'), (False,'No' )),
                                       widget=forms.Select(attrs={"v-model":"parameter_set.survey_required",}))

    survey_link =  forms.CharField(label='Survey Link',
                                   required=False,
                                   widget=forms.TextInput(attrs={"v-model":"parameter_set.survey_link",}))
    
    prolific_mode = forms.ChoiceField(label='Prolific Mode',
                                       choices=((True, 'Yes'), (False,'No' )),
                                       widget=forms.Select(attrs={"v-model":"parameter_set.prolific_mode",}))

    prolific_completion_link =  forms.CharField(label='After Session, Forward Subjects to URL',
                                   required=False,
                                   widget=forms.TextInput(attrs={"v-model":"parameter_set.prolific_completion_link",}))
    
    reconnection_limit = forms.IntegerField(label='Re-connection Limit',
                                    min_value=1,
                                    widget=forms.NumberInput(attrs={"v-model":"parameter_set.reconnection_limit",
                                                                    "step":"1",
                                                                    "min":"1"}))

    tokens_per_period = forms.IntegerField(label='Tokens per Period',
                                    min_value=1,
                                    widget=forms.NumberInput(attrs={"v-model":"parameter_set.tokens_per_period",
                                                                    "step":"1",
                                                                    "min":"0"}))

    world_width = forms.IntegerField(label='World Width (pixels)',
                                    min_value=1,
                                    widget=forms.NumberInput(attrs={"v-model":"parameter_set.world_width",
                                                                    "step":"1",
                                                                    "min":"1000"}))
    
    world_height = forms.IntegerField(label='World Height (pixels)',
                                    min_value=1,
                                    widget=forms.NumberInput(attrs={"v-model":"parameter_set.world_height",
                                                                    "step":"1",
                                                                    "min":"1000"}))
                                                                

    test_mode = forms.ChoiceField(label='Test Mode',
                                       choices=((True, 'Yes'), (False,'No' )),
                                       widget=forms.Select(attrs={"v-model":"parameter_set.test_mode",}))

    class Meta:
        model=ParameterSet
        fields =['period_count', 'period_length', 'show_instructions', 'instruction_set', 
                 'survey_required', 'survey_link', 'test_mode', 'prolific_mode', 'prolific_completion_link', 'reconnection_limit',
                 'tokens_per_period', 'world_width', 'world_height']

    def clean_survey_link(self):
        
        try:
           survey_link = self.data.get('survey_link')
           survey_required = self.data.get('survey_required')

           if survey_required == 'True' and not "http" in survey_link:
               raise forms.ValidationError('Invalid link')
            
        except ValueError:
            raise forms.ValidationError('Invalid Entry')

        return survey_link
    
    def clean_prolific_completion_link(self):
        
        try:
           prolific_completion_link = self.data.get('prolific_completion_link')
           prolific_mode = self.data.get('prolific_mode')

           if prolific_mode == 'True' and not "http" in prolific_completion_link:
               raise forms.ValidationError('Enter Prolific completion URL')
            
        except ValueError:
            raise forms.ValidationError('Invalid Entry')

        return prolific_completion_link
