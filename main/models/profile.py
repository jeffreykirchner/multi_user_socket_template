'''
people model
'''
import uuid

from django.db import models
from django.conf import settings

from django.dispatch import receiver
from django.db.models.signals import post_delete


#gloabal parameters for site
class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, primary_key=True)                 #log in key used to reset subject password

    can_edit_instructions = models.BooleanField(verbose_name="Can Edit Instructions", default=False)                  #true if user can edit instructions
    
    mfa_hash = models.CharField(verbose_name="Multi-factor Hash", max_length = 50, null=True, blank=True)             #hash for multi-factor authentication
    mfa_required = models.BooleanField(verbose_name="Multi-factor Required", default=False)                           #true if multi-factor authentication is required
    mfa_setup_complete = models.BooleanField(verbose_name="Multi-factor Setup Complete", default=False)               #true if multi-factor authentication is setup
                                      
    timestamp = models.DateTimeField(auto_now_add= True)
    updated= models.DateTimeField(auto_now= True)

    def __str__(self):
        return f"{self.user.last_name}, {self.user.first_name} "

    class Meta:
        verbose_name = 'Profile'
        verbose_name_plural = 'Profiles'
    
    def json(self):
        '''
        return json object of model
        '''

        return {'first_name' : self.user.first_name,
                'last_name' : self.user.last_name,
                'email' : self.user.email,
                'can_edit_instructions' : self.can_edit_instructions,
                'mfa_required' : self.mfa_required,
                }

#delete associated user model when profile is deleted
@receiver(post_delete, sender=Profile)
def post_delete_user(sender, instance, *args, **kwargs):
    if instance.user: # just in case user is not specified
        instance.user.delete()