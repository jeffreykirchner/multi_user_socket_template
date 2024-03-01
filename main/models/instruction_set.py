'''
instruction set
'''

#import logging

from django.db import models

import main

class InstructionSet(models.Model):
    '''
    instruction set model
    '''

    label = models.CharField(max_length = 100, default="Name Here", verbose_name="Label")                 #label text

    action_page_1 = models.IntegerField(verbose_name='Required Action: 1', default=1)
    action_page_2 = models.IntegerField(verbose_name='Required Action: 2', default=2)
    action_page_3 = models.IntegerField(verbose_name='Required Action: 3', default=3)
    action_page_4 = models.IntegerField(verbose_name='Required Action: 4', default=4)
    action_page_5 = models.IntegerField(verbose_name='Required Action: 5', default=5)
    action_page_6 = models.IntegerField(verbose_name='Required Action: 6', default=6)
        
    timestamp = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.label}"

    class Meta:
        
        verbose_name = 'Instruction Set'
        verbose_name_plural = 'Instruction Sets'
        ordering = ['label']
        constraints = [
            models.UniqueConstraint(fields=['label', ], name='unique_instruction_set'),
        ]

    def copy_pages(self, i_set):
        '''
        copy instruction pages
        '''
        
        #session player periods
        instructions = []

        for i in i_set.all():
            instructions.append(main.models.Instruction(instruction_set=self, text_html=i.text_html, page_number=i.page_number))
        
        main.models.Instruction.objects.bulk_create(instructions)
    
    def copy_help_docs_subject(self, i_set):
        
        help_docs_subject = []

        for i in i_set.all():
            help_docs_subject.append(main.models.HelpDocsSubject(instruction_set=self, title=i.title, text=i.text))

        main.models.HelpDocsSubject.objects.bulk_create(help_docs_subject)
        
    #return json object of class
    def json(self):
        '''
        json object of model
        '''

        return{
            "id" : self.id,         

            "label" : self.label,

            "action_page_1" : self.action_page_1,
            "action_page_2" : self.action_page_2,
            "action_page_3" : self.action_page_3,
            "action_page_4" : self.action_page_4,
            "action_page_5" : self.action_page_5,
            "action_page_6" : self.action_page_6,

            "instruction_pages" : [i.json() for i in self.instructions.all()],
        }
    
    #return json object of class
    def json_min(self):
        '''
        json object of model
        '''

        return{
            "id" : self.id,         

            "label" : self.label,
        }
        