'''
staff view
'''
import logging
import json

from django.core.serializers.json import DjangoJSONEncoder
from django.http import Http404
from django.core.exceptions import ObjectDoesNotExist
from django.views import View
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.http import JsonResponse

from main.models import SessionPlayer
from main.models import Parameters

from main.forms import SessionForm
from main.forms import EndGameForm

class SubjectHomeView(View):
    '''
    class based staff view
    '''
    template_name = "subject/subject_home.html"
    websocket_path = "subject-home"
    
    def get(self, request, *args, **kwargs):
        '''
        handle get requests
        '''
        try:
            session_player = SessionPlayer.objects.get(player_key=kwargs['player_key'])
            session = session_player.session
        except ObjectDoesNotExist:
            raise Http404("Subject not found.")
        
        end_game_form_ids=[]
        for i in EndGameForm():
            end_game_form_ids.append(i.html_name)

        # sprite_sheet_css = generate_css_sprite_sheet('main/static/avatars.json', static('avatars.png'))

        parameters = Parameters.objects.first()

        return render(request=request,
                      template_name=self.template_name,
                      context={"channel_key" : session.channel_key,
                               "player_key" :  session_player.player_key,
                               "id" : session.id,
                               "session_form" : SessionForm(),
                               "end_game_form" : EndGameForm(),
                               "end_game_form_ids" : end_game_form_ids,
                               "websocket_path" : self.websocket_path,
                               "page_key" : f'session-{session.id}',
                               "instruction_pages" : json.dumps(session_player.get_instruction_set(), cls=DjangoJSONEncoder),
                               "session_player" : session_player,
                               "session_player_json" : json.dumps(session_player.json(), cls=DjangoJSONEncoder),
                               "session" : session,
                               "parameters" : parameters,
                               "session_json":json.dumps(session.json_for_subject(session_player), cls=DjangoJSONEncoder)})
    
    @method_decorator(login_required)
    def post(self, request, *args, **kwargs):
        '''
        handle post requests
        '''

        logger = logging.getLogger(__name__) 
        session = self.get_object()        

        return JsonResponse({"response" :  "fail"},safe=False)