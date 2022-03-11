'''
log in form
'''
from django import forms

#form
class LoginForm(forms.Form):
    '''
    log in form
    '''
    username =  forms.EmailField(label='Email address (lower case)')

    password = forms.CharField(label='Password',
                               widget=forms.PasswordInput(attrs={"v-on:keyup.enter":"login"}))
