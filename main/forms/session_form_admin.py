from django import forms
from main.models import Session
from django.contrib.auth.models import User
from django.forms import ModelChoiceField
from django.forms import ModelMultipleChoiceField

from main.globals import ExperimentPhase

class UserModelChoiceField(ModelChoiceField):
    def label_from_instance(self, obj):
        return obj.email

class UserModelMultipleChoiceField(ModelMultipleChoiceField):
    def label_from_instance(self, obj):
        return obj.email

class SessionFormAdmin(forms.ModelForm):

    
    creator =  UserModelChoiceField(label="Creator",
                                     empty_label=None,
                                     queryset=User.objects.all(),
                                     widget=forms.Select(attrs={}))
    
    collaborators = UserModelMultipleChoiceField(label="Collaborators",
                                                 queryset=User.objects.all(),
                                                 required=False
                                                   )
    
    current_experiment_phase = forms.ChoiceField(label='Current Session Phase',
                                                 choices=ExperimentPhase.choices,)

    title = forms.CharField(label='Title',
                            widget=forms.TextInput(attrs={"size":"50"}))
    
    channel_key = forms.CharField(label='Channel Key',
                            widget=forms.TextInput(attrs={"size":"50"}))
    
    id_string = forms.CharField(label='ID String',
                            widget=forms.TextInput(attrs={"size":"6"}))

    
    shared = forms.BooleanField(label='Share parameterset with all.', required=False)
    locked = forms.BooleanField(label='Locked, prevent deletion.', required=False)
    soft_delete = forms.BooleanField(label='Soft Delete.', required=False)

    class Meta:
        model=Session
        fields = ('parameter_set', 'creator', 'collaborators', 'current_experiment_phase', 'title', 'world_state', 'shared', 'locked', 'soft_delete', 'controlling_channel', 'id_string')