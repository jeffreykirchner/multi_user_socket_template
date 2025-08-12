import os

#production settings are used on live server

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ['SECRET_KEY']

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DEBUG', False)

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
STATIC_ROOT = 'main/static/'

ALLOWED_HOSTS = [os.environ['WEBSITE_HOSTNAME']] if 'WEBSITE_HOSTNAME' in os.environ else []
CSRF_TRUSTED_ORIGINS = os.environ.get('CSRF_TRUSTED_ORIGINS').split()

# Database

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ['DBNAME'],
        'HOST': os.environ['DBHOST'],
        'USER': os.environ['DBUSER'],
        'PASSWORD': os.environ['DBPASS'],
        'OPTIONS': {'sslmode': 'prefer'},
        'CONN_MAX_AGE' : 60,
    },
}

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            # 'hosts': [(os.environ['REDIS'])],
            'hosts' :  [("localhost", 6379)],
            'prefix' : 'multi_user_socket_template',
            'capacity': 1500,
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
           'filename': os.environ['LOG_LOCATION'],
           'maxBytes': 10485760,           #10 mb
           'backupCount' : 5,
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

#esi portal
ESI_AUTH_URL = os.environ['ESI_AUTH_URL']
ESI_AUTH_ACCOUNT_URL = os.environ['ESI_AUTH_ACCOUNT_URL']
ESI_AUTH_PASSWORD_RESET_URL = os.environ['ESI_AUTH_PASSWORD_RESET_URL']
ESI_AUTH_USERNAME = os.environ['ESI_AUTH_USERNAME']
ESI_AUTH_PASS = os.environ['ESI_AUTH_PASS']
ESI_AUTH_APP = os.environ['ESI_AUTH_APP']

#email service
EMAIL_MS_HOST = os.environ['EMAIL_MS_HOST']
EMAIL_MS_USER_NAME = os.environ['EMAIL_MS_USER_NAME']
EMAIL_MS_PASSWORD = os.environ['EMAIL_MS_PASSWORD']

AZURE_OPENAI_API_KEY = os.environ['AZURE_OPENAI_API_KEY']
