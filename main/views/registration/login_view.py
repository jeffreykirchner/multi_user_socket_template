'''
log in user functionality
'''
import json
import logging
import requests

from django.contrib.auth import authenticate, login,logout
from django.shortcuts import render
from django.http import JsonResponse
from django.views.generic import TemplateView
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils.crypto import get_random_string

from main.models import Parameters
from main.forms import LoginForm

class LoginView(TemplateView):
    '''
    log in class view
    '''

    template_name = 'registration/login.html'

    def post(self, request, *args, **kwargs):
        '''
        handle post requests
        '''
        data = json.loads(request.body.decode('utf-8'))

        if data["action"] == "login":
            return login_function(request, data)

        return JsonResponse({"response" :  "error"},safe=False)

    def get(self, request, *args, **kwargs):
        '''
        handle get requests
        '''
        logout(request)

        request.session['redirect_path'] = request.GET.get('next','/')

        prm = Parameters.objects.first()

        form = LoginForm()

        form_ids=[]
        for i in form:
            form_ids.append(i.html_name)

        return render(request, self.template_name, {"labManager":prm.contact_email,
                                               "form":form,
                                               "form_ids":form_ids})

def login_function(request,data):
    '''
    handle login
    '''
    logger = logging.getLogger(__name__)
    #logger.info(data)

    #convert form into dictionary
    form_data_dict = {}

    for field in data["formData"]:
        form_data_dict[field["name"]] = field["value"]

    form = LoginForm(form_data_dict)

    if form.is_valid():

        username = form.cleaned_data['username']
        password = form.cleaned_data['password']

        #logger.info(f"Login user {username}")

        user = login_function_esi_auth(username=username.lower(), password=password)

        if not user:
            user = authenticate(request, username=username.lower(), password=password)

        if user is not None:
            login(request, user)

            redirect_path = request.session.get('redirect_path','/')

            logger.info(f"Login user {username} success , redirect {redirect_path}")

            return JsonResponse({"status":"success", "redirect_path" : redirect_path}, safe=False)
        else:
            logger.warning(f"Login user {username} fail user / pass")

            return JsonResponse({"status" : "error"}, safe=False)
    else:
        logger.info("Login user form validation error")
        return JsonResponse({"status":"validation", "errors":dict(form.errors.items())}, safe=False)

def login_function_esi_auth(username, password):
    '''
    check the esi auth server for account access
    return user if already exists or create new one.
    
    username: string, user name of account to login
    password: string, password of account to login
    '''

    logger = logging.getLogger(__name__)

    try:
        headers = {'Content-Type' : 'application/json', 'Accept' : 'application/json'}

        data = {"app_name" : settings.ESI_AUTH_APP,
                "username" : username,
                "password" :password }

        request_result = requests.get(f'{settings.ESI_AUTH_URL}/get-auth/',
                                    json=data,
                                    auth=(str(settings.ESI_AUTH_USERNAME), str(settings.ESI_AUTH_PASS)),
                                    headers=headers)
        
        if request_result.status_code != 200:        
            logger.warning(f'ESI auth error: {request_result}')
            return None

        request_result_json = request_result.json()

        if request_result_json['status'] == 'fail':        
            logger.warning(f'ESI auth error: {request_result}')
            return None

        logger.info(f"ESI auth response: {request_result_json}")

        profile = request_result_json['profile']
        
        users = get_user_model().objects.filter(username=profile['global_id'])

        if users.count() == 0:
            #check for duplicate email
            if get_user_model().objects.filter(email=profile['email']).count()>0:
                logger.warning(f"ESI auth response: email already exists {profile['email']}")
                return None

            user = get_user_model().objects.create_user(username=profile['global_id'],
                                                email=profile['email'],
                                                password=get_random_string(22),                                         
                                                first_name=profile['first_name'],
                                                last_name=profile['last_name'])
            
            logger.info(f"ESI auth user not found, create new user: {user}")
        else:
            user = users.first()
            user.email = profile['email']
            user.first_name = profile['first_name']
            user.last_name = profile['last_name']

            user.save()

            logger.info(f"ESI auth user found, update user: {user}")

        return user
    except Exception  as e: 
        logger.warning(f'ESI auth error: user {username} failed to connect to auth server. {e}')
        return None
