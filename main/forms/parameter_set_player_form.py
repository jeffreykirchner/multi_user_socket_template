'''
parameterset player edit form
'''

from django import forms
from django.db.models.query import RawQuerySet

from main.models import ParameterSetPlayer

class ParameterSetPlayerForm(forms.ModelForm):
    '''
    parameterset player edit form
    '''

    class Meta:
        model=ParameterSetPlayer
        fields =[]
    
