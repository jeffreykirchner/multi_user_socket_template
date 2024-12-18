'''
staff instructions
'''
import uuid

from django.views.generic import View
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseForbidden

from main.models import Parameters

class StaffInstructionsView(View):
    '''
    class based staff instructions view
    '''
    template_name = "staff/staff_instructions.html"
    websocket_path = "staff-instructions"
    
    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        '''
        handle get requests
        '''

        user = request.user

        if not user.is_staff:
            if not user.profile.can_edit_instructions:
                return HttpResponseForbidden("You don't have permission to access this page.")

        return render(request, self.template_name, {"channel_key" : uuid.uuid4(),
                                                    "player_key" :  uuid.uuid4(),
                                                    "page_key" : "staff-instructions",
                                                    "websocket_path" : self.websocket_path})