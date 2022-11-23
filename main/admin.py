'''
admin interface
'''
from django.contrib import admin
from django.contrib import messages
from django.conf import settings

from main.forms import ParametersForm
from main.forms import SessionFormAdmin
from main.forms import InstructionFormAdmin
from main.forms import InstructionSetFormAdmin

from main.models import Parameters
from main.models import ParameterSet
from main.models import ParameterSetPlayer

from main.models import Session
from main.models import SessionPlayer
from main.models import SessionPlayerChat
from main.models import SessionPlayerPeriod

from main.models import  HelpDocs

from main.models.instruction_set import InstructionSet
from main.models.instruction import Instruction

admin.site.site_header = settings.ADMIN_SITE_HEADER

@admin.register(ParameterSetPlayer)
class ParameterSetPlayerAdmin(admin.ModelAdmin):

    def has_add_permission(self, request, obj=None):
        return False

    readonly_fields=['parameter_set']
    list_display = ['id_label']

    inlines = [
        
      ]

class ParameterSetPlayerInline(admin.TabularInline):

    def has_add_permission(self, request, obj=None):
        return False

    extra = 0  
    model = ParameterSetPlayer
    can_delete = True   
    show_change_link = True

@admin.register(ParameterSet)
class ParameterSetAdmin(admin.ModelAdmin):
    inlines = [
        ParameterSetPlayerInline,
      ]

    list_display = ['id', 'period_count', 'period_length']

@admin.register(Parameters)
class ParametersAdmin(admin.ModelAdmin):
    '''
    parameters model admin
    '''
    def has_add_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    form = ParametersForm

    actions = []

admin.site.register(SessionPlayerChat)
admin.site.register(SessionPlayerPeriod)
admin.site.register(HelpDocs)

@admin.register(SessionPlayer)
class SessionPlayerAdmin(admin.ModelAdmin):
    
    def render_change_form(self, request, context, *args, **kwargs):
         context['adminform'].form.fields['parameter_set_player'].queryset = kwargs['obj'].parameter_set_player.parameter_set.parameter_set_players.all()

         return super(SessionPlayerAdmin, self).render_change_form(request, context, *args, **kwargs)

    readonly_fields=['session','player_number','player_key']
    list_display = ['parameter_set_player', 'name', 'student_id', 'email',]
    fields = ['session','name', 'student_id', 'email', 'parameter_set_player','player_number','player_key', 'name_submitted', 'survey_complete']
    inlines = [
        
      ]

class SessionPlayerInline(admin.TabularInline):

    def has_add_permission(self, request, obj=None):
        return False
    
    @admin.display(description='Player ID')
    def get_parameter_set_player_id_label(self, obj):
        return obj.parameter_set_player.id_label

    extra = 0  
    model = SessionPlayer
    can_delete = False   
    show_change_link = True
    fields = ['name', 'student_id', 'email', 'name_submitted', 'survey_complete']
    readonly_fields = ('get_parameter_set_player_id_label',)

@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    form = SessionFormAdmin

    readonly_fields=['parameter_set', 'session_key','channel_key']
    inlines = [SessionPlayerInline]

#instruction set page
class InstructionPageInline(admin.TabularInline):
      '''
      instruction page admin screen
      '''
      extra = 0  
      form = InstructionFormAdmin
      model = Instruction
      can_delete = True

@admin.register(InstructionSet)
class InstructionSetAdmin(admin.ModelAdmin):
    form = InstructionSetFormAdmin

    def duplicate_set(self, request, queryset):
            '''
            duplicate instruction set
            '''
            if queryset.count() != 1:
                  self.message_user(request,"Select only one instruction set to copy.", messages.ERROR)
                  return

            base_instruction_set = queryset.first()

            instruction_set = InstructionSet()
            instruction_set.save()
            instruction_set.copy_pages(base_instruction_set.instructions)

            self.message_user(request,f'{base_instruction_set} has been duplicated', messages.SUCCESS)

    duplicate_set.short_description = "Duplicate Instruction Set"

    inlines = [
        InstructionPageInline,
      ]
    
    actions = [duplicate_set]

