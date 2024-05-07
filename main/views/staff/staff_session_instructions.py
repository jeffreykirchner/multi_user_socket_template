'''
staff session subject earnings view
'''
from django.views import View
from django.shortcuts import render
from django.views.generic.detail import SingleObjectMixin
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator

from main.models import Parameters
from main.models import Session
from main.models import SessionPlayer

from main.decorators import user_is_owner

class StaffSessionInstructions(SingleObjectMixin, View):
    '''
    class based staff session instructions set view
    '''
    template_name = "staff/staff_session_instructions.html"
    websocket_path = "staff-session-instructions"
    model = SessionPlayer
    
    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        '''
        handle get requests
        '''

        parameters = Parameters.objects.first()
        session_player = self.get_object()

        instruction_set = []

        if session_player:
            instruction_set = session_player.get_instruction_set()

        return render(request=request,
                      template_name=self.template_name,
                      context={"parameters" : parameters,
                               "id" : session_player.session.id,
                               "instruction_set" : instruction_set,
                               "session_player" : session_player,
                               "session" : session_player.session})