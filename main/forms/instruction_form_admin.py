'''
instruction form admin screen
'''
from django import forms
from main.models import Instruction
from tinymce.widgets import TinyMCE

class InstructionFormAdmin(forms.ModelForm):
    '''
    instruction form admin screen
    '''

    page_number = forms.IntegerField(label='Page Number',
                                     min_value=1,
                                     widget=forms.NumberInput(attrs={"min":"1"}))
    
    text_html = forms.CharField(label='Page HTML Text',
                                widget=TinyMCE(attrs={"rows":20, "cols":200, "plugins": "link image code"}))

    class Meta:
        model=Instruction
        fields = ('page_number', 'text_html')