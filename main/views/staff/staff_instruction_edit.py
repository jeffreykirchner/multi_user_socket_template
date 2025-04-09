'''
staff session subject earnings view
'''
import uuid

from django.views import View
from django.shortcuts import render
from django.views.generic.detail import SingleObjectMixin
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.http import HttpResponseForbidden

from main.forms import InstructionSetForm
from main.forms import InstructionForm
from main.forms import ImportInstructionSetForm
from main.forms import HelpDocSubjectForm

from main.models import InstructionSet

class StaffInstructionEditView(SingleObjectMixin, View):
    '''
    class based staff session instruction set view
    '''
    template_name = "staff/staff_instruction_edit.html"
    websocket_path = "staff-instruction-edit"
    model = InstructionSet
    
    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        '''
        handle get requests
        '''

        user = request.user

        if not user.is_staff:
            if not user.profile.can_edit_instructions:
                return HttpResponseForbidden("You don't have permission to access this page.")

        instruction_set = self.get_object()

        instruction_set_form = InstructionSetForm()
        instruction_form = InstructionForm()
        import_instruction_set_form = ImportInstructionSetForm(instruction_set_id=instruction_set.id)
        help_doc_subject_form = HelpDocSubjectForm()

        form_ids=[]
        for i in InstructionSetForm():
            form_ids.append(i.html_name)

        for i in InstructionForm():
            form_ids.append(i.html_name)

        for i in ImportInstructionSetForm():
            form_ids.append(i.html_name)

        for i in HelpDocSubjectForm():
            form_ids.append(i.html_name)

        return render(request=request,
                      template_name=self.template_name,
                      context={"id" : instruction_set.id,
                               "channel_key" : uuid.uuid4(),
                               "player_key" :  uuid.uuid4(),
                               "page_key" : "staff-instructions",
                               "instrution_set_id" : instruction_set.id,
                               "instruction_set_form" : instruction_set_form,
                               "instruction_form" : instruction_form,
                               "import_instruction_set_form" : import_instruction_set_form,
                               "help_doc_subject_form" : help_doc_subject_form,
                               "form_ids" : form_ids,
                               "websocket_path" : self.websocket_path
                               })