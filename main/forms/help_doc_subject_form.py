from tinymce.widgets import TinyMCE

from django import forms
from main.models import HelpDocsSubject

class HelpDocSubjectForm(forms.ModelForm):

    text = forms.CharField(label='Text',
                                widget=TinyMCE(attrs={"rows":"12",
                                                      "v-model":"current_help_doc_subject.text_html",}))
    
    title = forms.CharField(label='Title',
                                   required=False,
                                   widget=forms.TextInput(attrs={"v-model":"current_help_doc_subject.title",}))

    class Meta:
        model=HelpDocsSubject
        fields = ('title','text')