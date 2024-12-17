'''
staff view
'''
import logging
import uuid
import json
import os

from django.views import View
from django.shortcuts import render
from django.views.generic.detail import SingleObjectMixin
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.http import JsonResponse
from django.core.serializers.json import DjangoJSONEncoder

from main.decorators import user_is_owner

from main.models import Session
from main.models import Parameters

from main.forms import SessionForm
from main.forms import SessionInvitationForm
from main.forms import StaffEditNameEtcForm

class StaffSessionView(SingleObjectMixin, View):
    '''
    class based staff view
    '''
    template_name = "staff/staff_session.html"
    websocket_path = "staff-session"
    model = Session
    
    @method_decorator(user_is_owner)
    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        '''
        handle get requests
        '''

        parameters = Parameters.objects.first()

        session = Session.objects.only("id", "parameter_set").get(id=self.kwargs['pk'])

        staff_edit_name_etc_form_ids=[]
        for i in StaffEditNameEtcForm():
            staff_edit_name_etc_form_ids.append(i.html_name)

        website_instance_id = os.environ.get('WEBSITE_INSTANCE_ID', None)
        Session.objects.filter(id=session.id).update(website_instance_id=website_instance_id)

        return render(request=request,
                      template_name=self.template_name,
                      context={"channel_key" : session.channel_key,
                               "player_key" :  session.channel_key,                               
                               "id" : session.id,
                               "session_form" : SessionForm(),
                               "session_invitation_form" : SessionInvitationForm(),
                               "staff_edit_name_etc_form" : StaffEditNameEtcForm(prolific_mode=session.parameter_set.prolific_mode),
                               "staff_edit_name_etc_form_ids" : staff_edit_name_etc_form_ids,
                               "websocket_path" : self.websocket_path,
                               "page_key" : f'session-{session.id}',
                               "parameters" : parameters,
                               "session" : session,
                               "website_instance_id" : website_instance_id,
                               })
    
    @method_decorator(login_required)
    def post(self, request, *args, **kwargs):
        '''
        handle post requests
        '''

        logger = logging.getLogger(__name__) 
        session = self.get_object()        

        return JsonResponse({"response" :  "fail"},safe=False)