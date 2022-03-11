from django import forms
from django.db.models import Q

from main.models import Session

#form
class ImportParametersForm(forms.Form):
    # import parameters form for session view
    # pass auth user in declaration

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user', None)
        super(ImportParametersForm, self).__init__(*args, **kwargs)
        self.fields['session'].queryset = Session.objects.filter(soft_delete=False) \
                                                         .filter(Q(creator=self.user) | Q(shared=True))
    
    session =  forms.ModelChoiceField(label="Select session to import.",
                                      queryset=None,
                                      empty_label=None,
                                      widget=forms.Select(attrs={}))


    