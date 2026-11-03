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

    quiz_question = forms.BooleanField(label='Quiz Question', required=False)
    quiz_state = forms.CharField(label='Quiz State', required=False)
    quiz_answer = forms.CharField(label='Quiz Answer', required=False)

    class Meta:
        model=Instruction
        fields = ('page_number', 'text_html', 'quiz_question', 'quiz_answer')