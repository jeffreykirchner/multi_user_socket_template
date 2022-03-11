'''
staff view
'''
import logging
import json
import uuid

from django.views import View
from django.shortcuts import render
from django.views.generic.detail import SingleObjectMixin
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.http import JsonResponse
from django.core.serializers.json import DjangoJSONEncoder

from main.decorators import user_is_owner

from main.models import Session

from main.forms import ImportParametersForm
from main.forms import ParameterSetForm
from main.forms import ParameterSetPlayerForm

class StaffSessionParametersView(SingleObjectMixin, View):
    '''
    class based staff view
    '''
    template_name = "staff/staff_session_parameters.html"
    websocket_path = "staff-session-parameters"
    model = Session
    
    @method_decorator(user_is_owner)
    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        '''
        handle get requests
        '''
        session = self.get_object()

        parameterset_player_form = ParameterSetPlayerForm()

        parameterset_form_ids=[]
        for i in ParameterSetForm():
            parameterset_form_ids.append(i.html_name)

        parameterset_player_form_ids=[]
        for i in parameterset_player_form:
            parameterset_player_form_ids.append(i.html_name)

        return render(request=request,
                      template_name=self.template_name,
                      context={"channel_key" : uuid.uuid4(),
                               "player_key" :  uuid.uuid4(),
                               "id" : session.id,
                               "parameter_set_form" : ParameterSetForm(),
                               "parameter_set_player_form" : parameterset_player_form,
                               "parameterset_form_ids" : parameterset_form_ids,
                               "parameterset_player_form_ids" : parameterset_player_form_ids,
                               "import_parameters_form" : ImportParametersForm(user=request.user),     
                               "websocket_path" : self.websocket_path,
                               "page_key" : f'{self.websocket_path}-{session.id}',
                               "number_of_player_types" : range(4),
                               "session" : session,
                               "session_json":json.dumps(session.json(), cls=DjangoJSONEncoder)
                               })
    
    @method_decorator(login_required)
    def post(self, request, *args, **kwargs):
        '''
        handle post requests
        '''

        logger = logging.getLogger(__name__) 
        session = self.get_object()

        #check for file upload
        try:
            f = request.FILES['file']
        except Exception  as e: 
            logger.info(f'Staff_Session no file upload: {e}')
            f = -1
        
         #check for file upload
        if f != -1:
            return takeFileUpload(f, session)
        else:
            data = json.loads(request.body.decode('utf-8'))
        

        return JsonResponse({"response" :  "fail"},safe=False)

#take parameter file upload
def takeFileUpload(f, session):
    logger = logging.getLogger(__name__) 
    logger.info("Upload file")

    #format incoming data
    v=""

    for chunk in f.chunks():
        v += str(chunk.decode("utf-8-sig"))

    message = ""

    try:
        if v[0]=="{":
            return upload_parameter_set(v, session)
        else:
            message = "Invalid file format."
    except Exception as e:
        message = f"Failed to load file: {e}"
        logger.info(message)       

    return JsonResponse({"session" : session.json(),
                         "message" : message,
                                },safe=False)

#take parameter set to upload
def upload_parameter_set(v, session):
    logger = logging.getLogger(__name__) 
    logger.info("Upload parameter set")
    

    ps = session.parameter_set

    logger.info(v)
    v = eval(v.replace("null", "None"))
    #logger.info(v)       

    message = ps.from_dict(v)

    session.update_player_count()

    return JsonResponse({"session" : session.json(),
                         "message" : message,
                                },safe=False)
