'''
interaction form
'''

from django import forms

class InteractionForm(forms.Form):
    '''
    interaction form
    '''
    direction =  forms.ChoiceField(label='Transfer Direction',
                                   choices=(('give', 'You to them'), ('take','Them to you' )),
                                   widget=forms.Select(attrs={"v-model":"interaction_form.direction",}))

    amount =  forms.IntegerField(label='Amount to Transfer',
                                  min_value=1,
                                  widget=forms.NumberInput(attrs={"min":"1", "v-model":"interaction_form.amount"}))
