'''
form for sending invitations
'''
from django import forms
from tinymce.widgets import TinyMCE

class SessionInvitationForm(forms.Form):
    '''
    form to send invitations
    '''

    invitation_subject = forms.CharField(label='Invitation Subject',
                              required=False,
                              widget=forms.TextInput(attrs={"v-model":"send_message_modal_form.subject",}))
    
    invitation_text = forms.CharField(label='Invitation Text',
                                         widget=TinyMCE(attrs={"rows":20, "cols":100,
                                                               "v-model":"send_message_modal_form.text"}))
