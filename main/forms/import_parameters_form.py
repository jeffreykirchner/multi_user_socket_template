from django import forms
from django.db.models import Q

from main.models import Session

#form
class ImportParametersForm(forms.Form):
    # import parameters form for session view
    # pass auth user in declaration

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user', None)
        self.session_id = kwargs.pop('session_id', None)
        super(ImportParametersForm, self).__init__(*args, **kwargs)
        self.fields['session'].queryset = Session.objects.only('title','creator', 'shared', 'collaborators')\
                                                         .filter(soft_delete=False) \
                                                         .exclude(id=self.session_id) \
                                                         .filter(Q(creator=self.user) | Q(shared=True) | Q(collaborators=self.user))\
                                                         .distinct() \
                                                         .order_by('title')
    
    session =  forms.ModelChoiceField(label="Select session to import.",
                                      queryset=None,
                                      empty_label=None,
                                      widget=forms.Select(attrs={"v-model":"session_import"}))



    