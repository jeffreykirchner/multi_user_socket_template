'''
log in form
'''
from django import forms

#form
class LoginForm(forms.Form):
    '''
    log in form
    '''
    username =  forms.EmailField(label='Email address (lower case)',
                                 widget=forms.TextInput(attrs={"v-model":"username","v-on:keyup.enter":"login"}))

    password = forms.CharField(label='Password',
                               widget=forms.PasswordInput(attrs={"v-model":"password", "v-on:keyup.enter":"login"}))