'''
staff view
'''
import logging
import uuid

import channels.layers
from asgiref.sync import async_to_sync

from django.views.generic import View
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required

from main.models import Parameters

class StaffHomeView(View):
    '''
    class based staff view
    '''
    template_name = "staff/staff_home.html"
    websocket_path = "staff-home"
    
    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        '''
        handle get requests
        '''

        #logger = logging.getLogger(__name__) 

        parameters = Parameters.objects.first()

        return render(request, self.template_name, {"channel_key" : uuid.uuid4(),
                                                    "player_key" :  uuid.uuid4(),
                                                    "page_key" : "staff-home",
                                                    "websocket_path" : self.websocket_path})