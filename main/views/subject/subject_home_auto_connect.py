'''
auto log subject in view
'''

from django.db import transaction
from django.http import Http404
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponseRedirect
from django.http import HttpResponse
from django.urls import reverse
from django.views import View

from main.models import Session

class SubjectHomeAutoConnectView(View):
    '''
    class based auto login for subject
    '''
        
    def get(self, request, *args, **kwargs):
        '''
        handle get requests
        '''
        try:
            session = Session.objects.get(id_string=kwargs['id_string'])
        except ObjectDoesNotExist:
            raise Http404("Session not found.")
        
        if session.parameter_set.prolific_mode:
            raise Http404("Not available for Prolfic.")
        
        player_number = kwargs.get('player_number', -1)
        player_key = ""

        if player_number == -1:
            #find available player

            try:
                with transaction.atomic():
                    session_player = session.session_players.select_for_update().filter(connecting=False, connected_count=0).first()

                    if session_player:
                        player_key = session_player.player_key
                    else:
                        return HttpResponse("<br><br><center><h1>All connections are full.</h1></center>")
                    
                    session_player.connecting = True
                    session_player.save()

            except ObjectDoesNotExist:
               return HttpResponse("<br><br><center><h1>All connections are full.</h1></center>")
        else:
            try:
                player_key = session.session_players.get(player_number=player_number).player_key
            except ObjectDoesNotExist:
                raise Http404("Subject not found.")

        return HttpResponseRedirect(reverse('subject_home', args=(player_key,)))