from django import forms

from main.models import InstructionSet

#form
class ImportInstructionSetForm(forms.Form):
    # import instruction set

    def __init__(self, *args, **kwargs):        
        self.instruction_set_id = kwargs.pop('instruction_set_id', None)
        super(ImportInstructionSetForm, self).__init__(*args, **kwargs)
        self.fields['instruction_set'].queryset = InstructionSet.objects.only('label')\
                                                         .exclude(id=self.instruction_set_id) \
                                                         .order_by('label')

    instruction_set =  forms.ModelChoiceField(label="Select Instruction Set to import.",
                                              queryset=None,
                                              empty_label=None,
                                              widget=forms.Select(attrs={"v-model":"instruction_set_import.instruction_set"}))



    