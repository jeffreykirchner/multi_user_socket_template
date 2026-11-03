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

    quiz_question = forms.ChoiceField(label='Quiz Question',
                                    choices=((1, 'Yes'), (0, 'No')),
                                    widget=forms.Select(attrs={"v-model":"current_instruction.quiz_question","class":"w-25"}))

    quiz_answer = forms.CharField(label='Quiz Answer (CSV)',
                                  required=False,
                                  widget=forms.TextInput(attrs={"v-model":"current_instruction.quiz_answer", "class":"w-25"}))

    quiz_state = forms.JSONField(label='Quiz State',
                                required=False,
                                widget=forms.Textarea(attrs={"v-model":"current_instruction.quiz_state", "class":"w-50", "rows":"20"}))

    class Meta:
        model=Instruction
        fields = ('page_number','text_html', 'quiz_question', 'quiz_answer', 'quiz_state')

    def clean_quiz_answer(self):
            
        try:
            
            quiz_question = self.data.get('quiz_question')
            quiz_answer = self.data.get('quiz_answer')
            
            if quiz_question and quiz_answer.strip() == "":
                raise forms.ValidationError('Quiz answer required if quiz question is selected.')
            
        except ValueError:
            raise forms.ValidationError('Invalid Entry')

        return quiz_answer

    
    def clean_quiz_question(self):
        quiz_question = self.cleaned_data.get('quiz_question')
        page_number = self.cleaned_data.get('page_number')

        if quiz_question == '1' and page_number is not None:
            instruction_set = self.instance.instruction_set
            action_pages = (
                getattr(instruction_set, field.name)
                for field in instruction_set._meta.get_fields()
                if field.name.startswith('action_page_')
            )
            page_number = str(page_number).strip()
            if any(
                action_page is not None
                and str(action_page).strip() == page_number
                for action_page in action_pages
            ):
                raise forms.ValidationError(
                    'Quiz question cannot be on an action page.'
                )

        return quiz_question