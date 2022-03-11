'''
context processors
'''
from django.conf import settings # import the settings file

def get_debug(request):
    '''
    return debug settings to templates
    '''
    # return the value you want as a dictionnary. you may add multiple values in there.
    return {'DEBUG': settings.DEBUG}

def get_auth_account_url(request):
    '''
    return debug settings to templates
    '''
    # return the value you want as a dictionnary. you may add multiple values in there.
    return {'ESI_AUTH_ACCOUNT_URL': settings.ESI_AUTH_ACCOUNT_URL}

def get_auth_password_reset_url(request):
    '''
    return debug settings to templates
    '''
    # return the value you want as a dictionnary. you may add multiple values in there.
    return {'ESI_AUTH_PASSWORD_RESET_URL': settings.ESI_AUTH_PASSWORD_RESET_URL}