'''
help doc subject form admin screen
'''
from django import forms
from main.models import Instruction
from tinymce.widgets import TinyMCE

class HelpDocSubjectFormAdmin(forms.ModelForm):
    '''
    help doc subject form admin screen
    '''

    title = forms.CharField(label='Title',
                            widget=forms.TextInput(attrs={"width":"300px"}))
    
    text = forms.CharField(label='Page HTML Text',
                                widget=TinyMCE(attrs={"rows":20, "cols":200, "plugins": "link image code"}))

    class Meta:
        model=Instruction
        fields = ('title', 'text')