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

from main.decorators import user_is_owner

class StaffSessionSubjectEarnings(SingleObjectMixin, View):
    '''
    class based staff session subject earnings view
    '''
    template_name = "staff/staff_session_subject_earnings.html"
    websocket_path = "staff-session-subject-earnings"
    model = Session
    
    @method_decorator(user_is_owner)
    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        '''
        handle get requests
        '''

        parameters = Parameters.objects.first()
        session = self.get_object()

        return render(request=request,
                      template_name=self.template_name,
                      context={"parameters" : parameters,
                               "id" : session.id,
                               "session" : session})
    
