'''
instruction set form
'''
from django import forms
from main.models import InstructionSet

class InstructionSetForm(forms.ModelForm):
    '''
    instruction set form 
    '''

    label = forms.CharField(label='Instruction Set Name',
                            widget=forms.TextInput(attrs={"width":"300px",
                                                          "v-model":"instruction_set.label",
                                                          "placeholder" : "Instruction Set Name"}))
    
    action_page_1 = forms.IntegerField(label='Required Action: Move Avatar', 
                                       widget=forms.NumberInput(attrs={"min":"1", 
                                                                       "v-model":"instruction_set.action_page_1",
                                                                       "placeholder" : "Page Number"}))
    
    action_page_2 = forms.IntegerField(label='Required Action: Interaction', 
                                       widget=forms.NumberInput(attrs={"min":"1", 
                                                                        "v-model":"instruction_set.action_page_2",
                                                                       "placeholder" : "Page Number"}))
    
    action_page_3 = forms.IntegerField(label='Required Action: Chat', 
                                       widget=forms.NumberInput(attrs={"min":"1", 
                                                                       "v-model":"instruction_set.action_page_3",
                                                                       "placeholder" : "Page Number"}))
    
    action_page_4 = forms.IntegerField(label='Required Action: 4', 
                                       widget=forms.NumberInput(attrs={"min":"1", 
                                                                       "v-model":"instruction_set.action_page_4",
                                                                       "placeholder" : "Page Number"}))
    
    action_page_5 = forms.IntegerField(label='Required Action: 5', 
                                       widget=forms.NumberInput(attrs={"min":"1", 
                                                                       "v-model":"instruction_set.action_page_5",
                                                                       "placeholder" : "Page Number"}))
    
    action_page_6 = forms.IntegerField(label='Required Action: 6', 
                                       widget=forms.NumberInput(attrs={"min":"1", 
                                                                       "v-model":"instruction_set.action_page_6",
                                                                       "placeholder" : "Page Number"}))

    class Meta:
        model=InstructionSet
        fields = ('label', 'action_page_1', 'action_page_2', 'action_page_3', 'action_page_4', 'action_page_5', 'action_page_6')