'''
auto log subject in view
'''
import logging
import uuid

from django.db import transaction

from django.http import Http404
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponseRedirect
from django.http import HttpResponse
from django.urls import reverse
from django.views import View

from main.models import Session

from main.globals import ExperimentPhase

class SubjectHomeAutoConnectProlificView(View):
    '''
    class based auto login for subject for Prolific
    '''
        
    def get(self, request, *args, **kwargs):
        '''
        handle get requests
        '''
        prolific_pid = request.GET.get('PROLIFIC_PID', None)
        prolific_session_id = request.GET.get('SESSION_ID', None)
        subject_id = request.GET.get('SUBJECT_ID', None)
        player_type = request.GET.get('PLAYER_TYPE', None)

        if not prolific_pid:
            return HttpResponse("<br><br><center><h1>PROLIFIC_PID not found.</h1></center>")
        
        if not prolific_session_id:
            return HttpResponse("<br><br><center><h1>SESSION_ID not found.</h1></center>")

        try:
            with transaction.atomic():

                try:
                    session = Session.objects.get(id_string=kwargs['id_string'])
                except ObjectDoesNotExist:
                    return HttpResponse("<br><br><center><h1>Session not found.</h1></center>")
                
                if not session.started:
                    return HttpResponse("<br><br><center><h1>The session has not started, refresh your screen when instructed to do so on the Prolific messenger.</h1></center>")

                first_connect = False
                session_player = None

                #if subjct id given direct connect to subject
                if subject_id:
                    session_player = session.session_players.filter(player_key=subject_id).first()

                    if not session_player:
                        return HttpResponse("<br><br><center><h1>Subject ID not found.</h1></center>")

                #check is subject already connected with prolific id
                if not session_player:
                    session_player = session.session_players.filter(student_id=prolific_pid).first()

                    if session_player:
                        html_response = f'''<h1><center>
                                            <br>
                                            <br>
                                            <a href="{reverse('subject_home', args=(session_player.player_key,))}">Click to login</a></center>
                                            </h1></center>
                                         '''
                        return HttpResponse(html_response)

                if not session_player:
                    if session.world_state["current_experiment_phase"] != ExperimentPhase.INSTRUCTIONS:
                        return HttpResponse("<br><br><center><h1>The session has already started.</h1></center>")
                    
                    first_connect = True
                    session_player = session.session_players.select_for_update().filter(connecting=False, connected_count=0)
                    
                    if player_type:
                        session_player = session_player.filter(parameter_set_player__parameter_set_type__subject_type=player_type)
                    
                    session_player = session_player.first()

                if session_player:
                    player_key = session_player.player_key
                else:
                    return HttpResponse("<br><br><center><h1>All connections are full.<br><br>Wait a few moments and refresh your screen, a slot may open up.</h1></center>")
                
                if first_connect:
                    session_player.reset(full_reset=False)

                session_player.connecting = True
                session_player.student_id = prolific_pid
                session_player.name = prolific_session_id

                session_player.save()

        except ObjectDoesNotExist:
            return HttpResponse("<br><br><center><h1>All connections are full.</h1></center>")
    
        return HttpResponseRedirect(reverse('subject_home', args=(player_key,)))