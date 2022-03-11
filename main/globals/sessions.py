'''
gloabal functions related to parameter sets
'''

from django.db import models
from django.utils.translation import gettext_lazy as _

import main

class ChatTypes(models.TextChoices):
    '''
    chat types
    '''
    ALL = 'All', _('All')
    INDIVIDUAL = 'Individual', _('Individual')

class ExperimentPhase(models.TextChoices):
    '''
    experiment phases
    '''
    INSTRUCTIONS = 'Instructions', _('Instructions')
    RUN = 'Run', _('Run')
    DONE = 'Done', _('Done')
