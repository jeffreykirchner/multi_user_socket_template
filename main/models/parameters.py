'''
single row site parameters
'''
from django.db import models
from tinymce.models import HTMLField

#gloabal parameters for site
class Parameters(models.Model):
    '''
    single row site parameters
    '''

    contact_email =  models.CharField(max_length = 1000, default="JohnSmith@abc.edu")       #primary contact for subjects
    experiment_time_zone = models.CharField(max_length = 1000, default="US/Pacific")        #time zone the experiment is in

    site_url = models.CharField(max_length = 200, default="http://localhost:8000")         #site URL used for display in emails

    invitation_text = HTMLField(default="", verbose_name="Invitation Text")
    invitation_subject =  models.CharField(max_length = 200, default="", verbose_name="Invitation Subject")

    timestamp = models.DateTimeField(auto_now_add=True)
    updated= models.DateTimeField(auto_now=True)

    def __str__(self):
        return "Site Parameters"

    class Meta:
        verbose_name = 'Parameters'
        verbose_name_plural = 'Parameters'

    def json(self):
        '''
        model json object
        '''
        return{
            "id" : self.id
        }
        