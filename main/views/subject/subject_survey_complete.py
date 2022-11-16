'''
subject survey complete view
'''
import logging
import json

from django.http import Http404
from django.core.exceptions import ObjectDoesNotExist
from django.views import View
from django.shortcuts import render
from django.urls import reverse
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from main.models import Parameters
from main.models import SessionPlayer

class SubjectSurveyCompleteView(View):
    '''
    class based staff view
    '''
    template_name = "subject/survey_complete.html"
    websocket_path = "subject-home"
    
    def get(self, request, *args, **kwargs):
        '''
        handle get requests
        '''

        try:
            session_player = SessionPlayer.objects.get(player_key=kwargs['player_key'])
            session_player.survey_complete = True    
            session_player.save()           

        except ObjectDoesNotExist:
            raise Http404("Subject not found.")

        channel_layer = get_channel_layer()
        data = {"player_id" : session_player.id}
        session_player.session.send_message_to_group("update_survey_complete", data)

        parameters = Parameters.objects.first()

        return_link = reverse('subject_home', kwargs={'player_key': session_player.player_key})

        return render(request=request,
                      template_name=self.template_name,
                      context={"return_link" : return_link})
    