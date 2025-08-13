'''
Settings used for local development
'''
import os

#local settings on used for development environments.
#change file name to local_settings.py, file will be excluded from repo

# SECURITY WARNING: keep the secret key used in production secret!
#SECRET_KEY = 'put a secret key here and remove comment'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

STATIC_ROOT = 'main/static/'

ALLOWED_HOSTS = ['localhost',
                 '127.0.0.1']

# Database
# https://docs.djangoproject.com/en/2.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'multi_user_socket_template',
        'USER': 'username',
        'PASSWORD': 'password',
        'HOST': 'localhost',
        'PORT': '',
    },
}

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            #'hosts': [('rediss://:password=@host_name:6380/0')], #remote server
            'hosts': [('localhost', 6379)], #local server
            'prefix' : 'multi_user_socket_template',
        },
    },
}


#logging, log both to console and to file log at the INFO level
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'info_format': {
            'format': '%(levelname)s %(asctime)s %(module)s: %(message)s'
            }
        },
    'handlers': {
        'console': {
            'level':'INFO',
            'class': 'logging.StreamHandler',
        },
       'logfile': {
           'level':'INFO',
           'class': 'logging.handlers.RotatingFileHandler',
           'filename': 'logs/debug.log',
           'maxBytes': 52428800,           #50 mb
           'backupCount' : 2,
           'formatter' : 'info_format',
           'delay': True,
       },
    },
    'loggers': {
        'django': {
            'handlers':['console','logfile'],
            'propagate': True,
            'level':'INFO',
        },
        'django.db.backends': {
            'handlers': ['console','logfile'],
            'level': 'INFO',
            'propagate': False,
        },
        'main': {
            'handlers': ['console', 'logfile'],
            'level': 'INFO',
        },
        'channels': {
            'handlers': ['console', 'logfile'],
            'level': 'INFO',
        },
    },
}

#ESI auth service
ESI_AUTH_URL = 'https://esi-auth-dev.azurewebsites.net'
ESI_AUTH_ACCOUNT_URL = 'https://esi-auth-dev.azurewebsites.net/account/'
ESI_AUTH_PASSWORD_RESET_URL = 'https://esi-auth-dev.azurewebsites.net/password-reset/'

ESI_AUTH_USERNAME = 'auth_username'
ESI_AUTH_PASS = 'auth_password'
ESI_AUTH_APP = 'auth_app_name'

#ESI mass email service
EMAIL_MS_HOST = 'https://chapman-experiments-mass-email-dev.azurewebsites.net'
EMAIL_MS_USER_NAME = 'mail_server_username'
EMAIL_MS_PASSWORD = 'mail_server_password'

AZURE_OPENAI_API_KEY = 'azure_openai_api_key'
