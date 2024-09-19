from tinymce.widgets import TinyMCE

from django import forms
from main.models import Instruction

class InstructionForm(forms.ModelForm):

    text_html = forms.CharField(label='Text',
                                widget=TinyMCE(attrs={"rows":"12",
                                                      "v-model":"current_instruction.text_html",}))
    
    page_number = forms.CharField(label='Order in which pages appear',
                                  widget=forms.NumberInput(attrs={"min":"1",
                                                                  "class":"w-25",                                                                   
                                                                  "v-model":"current_instruction.page_number",}))

    class Meta:
        model=Instruction
        fields = ('page_number','text_html')