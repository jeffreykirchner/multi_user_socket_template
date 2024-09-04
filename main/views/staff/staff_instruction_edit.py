'''
staff session subject earnings view
'''
import uuid

from django.views import View
from django.shortcuts import render
from django.views.generic.detail import SingleObjectMixin
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator

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

        instruction_set = self.get_object()

        return render(request=request,
                      template_name=self.template_name,
                      context={"id" : instruction_set.id,
                               "channel_key" : uuid.uuid4(),
                               "player_key" :  uuid.uuid4(),
                               "page_key" : "staff-instructions",
                               "instrution_set_id" : instruction_set.id,
                               "websocket_path" : self.websocket_path
                               })