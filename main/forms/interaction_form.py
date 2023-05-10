'''
interaction form
'''

from django import forms

class InteractionForm(forms.Form):
    '''
    interaction form
    '''
    direction =  forms.CharField(label='Transfer Direction',
                                widget=forms.TextInput(attrs={"v-model":"interaction_form.direction",
                                }))

    amount =  forms.CharField(label='Amount to Transfer', 
                              widget=forms.TextInput(attrs={"v-model":"interaction_form.amount",
                                }))
