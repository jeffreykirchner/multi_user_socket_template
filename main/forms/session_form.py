'''
session edit form
'''

from django import forms

from main.models import Session

class SessionForm(forms.ModelForm):
    '''
    session edit form
    '''
    title = forms.CharField(label='Title',
                            widget=forms.TextInput(attrs={"v-model":"session.title",
                                                           "v-on:keyup.enter":"send_update_session()"}))

    class Meta:
        model=Session
        fields =['title']
