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

admin.site.register(Parameters, ParametersAdmin)

admin.site.register(ParameterSet)
admin.site.register(ParameterSetPlayer)


class SessionAdmin(admin.ModelAdmin):
    form = SessionFormAdmin

admin.site.register(Session, SessionAdmin)


admin.site.register(SessionPlayer)
admin.site.register(SessionPlayerChat)
admin.site.register(SessionPlayerPeriod)

#instruction set page
class InstructionPageInline(admin.TabularInline):
      '''
      instruction page admin screen
      '''
      extra = 0  
      form = InstructionFormAdmin
      model = Instruction
      can_delete = True

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

admin.site.register(InstructionSet, InstructionSetAdmin)

admin.site.register(HelpDocs)