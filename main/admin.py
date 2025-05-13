'''
admin interface
'''
import logging
import datetime

from django.utils.translation import ngettext
from django.db.backends.postgresql.psycopg_any import DateTimeTZRange
from django.contrib import admin
from django.contrib import messages
from django.conf import settings
from django.utils import timezone

from main.forms import ParametersForm
from main.forms import SessionFormAdmin
from main.forms import InstructionFormAdmin
from main.forms import InstructionSetFormAdmin
from main.forms import HelpDocSubjectFormAdmin

from main.models import Profile
from main.models import ProfileLoginAttempt

from main.models import Parameters
from main.models import ParameterSet
from main.models import ParameterSetPlayer

from main.models import Session
from main.models import SessionEvent
from main.models import SessionPlayer
from main.models import SessionPlayerPeriod

from main.models import  HelpDocs

from main.models.instruction_set import InstructionSet
from main.models.instruction import Instruction
from main.models.help_docs_subject import HelpDocsSubject

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
    fields = ['id_label', 'player_number']

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

admin.site.register(HelpDocs)

@admin.register(SessionPlayerPeriod)
class SessionPlayerPeriodAdmin(admin.ModelAdmin):
    
    # def render_change_form(self, request, context, *args, **kwargs):
    #      context['adminform'].form.fields['parameter_set_player'].queryset = kwargs['obj'].parameter_set_player.parameter_set.parameter_set_players.all()

    #      return super(SessionPlayerAdmin, self).render_change_form(request, context, *args, **kwargs)

    readonly_fields=['session_period','session_player']
    list_display = ['earnings',]
    fields = ['session_period','session_player', 'earnings']
    inlines = [
       
      ]

class SessionPlayerPeriodInline(admin.TabularInline):

    def has_add_permission(self, request, obj=None):
        return False
    
    @admin.display(description='Period Number')
    def get_period_number(self, obj):
        return obj.session_period.period_number

    extra = 0  
    model = SessionPlayerPeriod
    can_delete = False   
    show_change_link = True
    fields = ['earnings']
    readonly_fields = ()

@admin.register(SessionPlayer)
class SessionPlayerAdmin(admin.ModelAdmin):
    
    # def render_change_form(self, request, context, *args, **kwargs):
    #      context['adminform'].form.fields['parameter_set_player'].queryset = kwargs['obj'].parameter_set_player.parameter_set.parameter_set_players.all()

    #      return super(SessionPlayerAdmin, self).render_change_form(request, context, *args, **kwargs)

    readonly_fields=['session','player_number','player_key', 'parameter_set_player']
    list_display = ['parameter_set_player', 'name', 'student_id', 'email',]
    fields = ['session','parameter_set_player', 'name', 'student_id', 'email' ,'player_number','player_key', 'name_submitted', 'survey_complete']
    inlines = [
        SessionPlayerPeriodInline,
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
    fields = ['get_parameter_set_player_id_label', 'name', 'student_id', 'email', 'name_submitted', 'survey_complete']
    readonly_fields = ('get_parameter_set_player_id_label',)

@admin.register(SessionEvent)
class SessionEventAdmin(admin.ModelAdmin):

    readonly_fields=['session']

    list_display = ['session', 'period_number', 'time_remaining','type']

@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    form = SessionFormAdmin

    @admin.display(description='Creator')
    def get_creator_email(self, obj):
        return obj.creator.email
    
    def reset(self, request, queryset):

        for i in queryset.all():
            i.reset_experiment()

        self.message_user(request, ngettext(
                '%d session is reset.',
                '%d sessions are reset.',
                queryset.count(),
        ) % queryset.count(), messages.SUCCESS)
    
    def refresh(self, request, queryset):

        for i in queryset.all():
            i.parameter_set.json(update_required=True)

        self.message_user(request, ngettext(
                '%d session is refreshed.',
                '%d sessions are refreshed.',
                queryset.count(),
        ) % queryset.count(), messages.SUCCESS)

    readonly_fields=['parameter_set', 'session_key','channel_key', 'controlling_channel']
    inlines = [SessionPlayerInline]

    actions = ['reset', 'refresh']

    list_display = ['title', 'get_creator_email']

#instruction set page
class InstructionPageInline(admin.TabularInline):
      '''
      instruction page admin screen
      '''
      extra = 0  
      form = InstructionFormAdmin
      model = Instruction
      can_delete = True

#instruction set page
class HelpDocSubjectInline(admin.TabularInline):
      '''
      instruction page admin screen
      '''
      extra = 0  
      form = HelpDocSubjectFormAdmin
      model = HelpDocsSubject
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

            instruction_set.action_page_1 = base_instruction_set.action_page_1
            instruction_set.action_page_2 = base_instruction_set.action_page_2
            instruction_set.action_page_3 = base_instruction_set.action_page_3
            instruction_set.action_page_4 = base_instruction_set.action_page_4
            instruction_set.action_page_5 = base_instruction_set.action_page_5
            instruction_set.action_page_6 = base_instruction_set.action_page_6

            instruction_set.save()
            instruction_set.copy_pages(base_instruction_set.instructions)
            instruction_set.copy_help_docs_subject(base_instruction_set.help_docs_subject)

            self.message_user(request,f'{base_instruction_set} has been duplicated', messages.SUCCESS)

    duplicate_set.short_description = "Duplicate Instruction Set"

    inlines = [
        InstructionPageInline,
        HelpDocSubjectInline,
      ]
    
    actions = [duplicate_set]

@admin.register(ProfileLoginAttempt)
class ProfileLoginAttemptAdmin(admin.ModelAdmin):
    '''
    profile login attempt admin
    '''
    list_display = ['profile','success','timestamp','note']
    readonly_fields=['success', 'note','profile', 'success', 'timestamp', 'note']

    def has_add_permission(self, request, obj=None):
        return False
    def has_change_permission(self, request, obj=None):
        return False
    def has_delete_permission(self, request, obj=None):
        return True
    
#profile login attempt inline
class ProfileLoginAttemptInline(admin.TabularInline):
      '''
      profile login attempt inline
      '''
      def get_queryset(self, request):
            qs = super().get_queryset(request)
            
            return qs.filter(timestamp__contained_by=DateTimeTZRange(timezone.now() - datetime.timedelta(days=30), timezone.now()))
      
      def has_add_permission(self, request, obj=None):
            return False

      def has_change_permission(self, request, obj=None):
            return False

      extra = 0  
      model = ProfileLoginAttempt
      can_delete = True
      
      fields=('id','success','note')
      readonly_fields = ('timestamp',)
    
@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    '''
    profile admin
    '''

    ordering = ['user__last_name', 'user__first_name']
    search_fields = ['user__last_name', 'user__first_name', 'user__email']

    list_display = ['__str__', 'can_edit_instructions']
    inlines = [ProfileLoginAttemptInline]


