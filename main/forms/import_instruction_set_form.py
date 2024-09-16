from django import forms

from main.models import InstructionSet

#form
class ImportInstructionSetForm(forms.Form):
    # import instruction set

    instruction_set =  forms.ModelChoiceField(label="Select Instruction Set to import.",
                                              queryset=InstructionSet.objects.all(),
                                              empty_label=None,
                                              widget=forms.Select(attrs={"v-model":"instruction_set_import.instruction_set"}))



    