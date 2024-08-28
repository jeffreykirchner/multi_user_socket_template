'''
instruction form admin screen
'''
from django import forms
from main.models import InstructionSet
from tinymce.widgets import TinyMCE

class InstructionSetFormAdmin(forms.ModelForm):
    '''
    instruction set form admin screen
    '''

    label = forms.CharField(label='Instruction Set Name',
                            widget=forms.TextInput(attrs={"width":"300px"}))
    
    action_page_1 = forms.IntegerField(label='Required Action: 1', initial=1, widget=forms.NumberInput(attrs={"min":"1", "placeholder" : "Page Number"}))
    action_page_2 = forms.IntegerField(label='Required Action: 2', initial=2, widget=forms.NumberInput(attrs={"min":"1", "placeholder" : "Page Number"}))
    action_page_3 = forms.IntegerField(label='Required Action: 3', initial=3, widget=forms.NumberInput(attrs={"min":"1", "placeholder" : "Page Number"}))
    action_page_4 = forms.IntegerField(label='Required Action: 4', initial=4, widget=forms.NumberInput(attrs={"min":"1", "placeholder" : "Page Number"}))
    action_page_5 = forms.IntegerField(label='Required Action: 5', initial=5, widget=forms.NumberInput(attrs={"min":"1", "placeholder" : "Page Number"}))
    action_page_6 = forms.IntegerField(label='Required Action: 6', initial=6, widget=forms.NumberInput(attrs={"min":"1", "placeholder" : "Page Number"}))

    class Meta:
        model=InstructionSet
        fields = ('label', 'action_page_1', 'action_page_2', 'action_page_3', 'action_page_4', 'action_page_5', 'action_page_6')