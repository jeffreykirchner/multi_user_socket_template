'''
end game form
'''

from django import forms

class EndGameForm(forms.Form):
    '''
    end game form
    '''
    name =  forms.CharField(label='Enter your full name',
                            widget=forms.TextInput(attrs={"v-model":"session_player.name",
                                                          "autocomplete":"off",
                            }))

    student_id =  forms.CharField(label='Student ID', 
                                  required=False,
                                  widget=forms.TextInput(attrs={"v-model":"session_player.student_id",
                                  }))
