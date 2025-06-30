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

    def from_dict(self, new_ps):
        '''
        copy source values into this instruction set
        '''
        # self.label = new_ps.get("label")
        
        self.action_page_1 = new_ps.get("action_page_1")
        self.action_page_2 = new_ps.get("action_page_2")
        self.action_page_3 = new_ps.get("action_page_3")
        self.action_page_4 = new_ps.get("action_page_4")
        self.action_page_5 = new_ps.get("action_page_5")
        self.action_page_6 = new_ps.get("action_page_6")

        self.save()
        
        message = "Parameters loaded successfully."

        return message

    def copy_pages(self, i_set):
        '''
        copy instruction pages
        '''
        
        self.instructions.all().delete()  # Clear existing instructions

        instructions = []

        for i in i_set.all():
            instructions.append(main.models.Instruction(instruction_set=self, text_html=i.text_html, page_number=i.page_number))
        
        main.models.Instruction.objects.bulk_create(instructions)
    
    def copy_pages_from_dict(self, instruction_pages):
        '''
        copy instruction pages from dict
        '''
        
        self.instructions.all().delete()

        instructions = []

        for instruction_page in instruction_pages:
            instructions.append(main.models.Instruction(instruction_set=self, 
                                                        text_html=instruction_page['text_html'], 
                                                        page_number=instruction_page['page_number']))

        main.models.Instruction.objects.bulk_create(instructions)

    def copy_help_docs_subject(self, i_set):
        
        help_docs_subject = []

        for i in i_set.all():
            help_docs_subject.append(main.models.HelpDocsSubject(instruction_set=self, title=i.title, text=i.text))

        main.models.HelpDocsSubject.objects.bulk_create(help_docs_subject)

    def copy_help_docs_subject_from_dict(self, help_docs_subject):
        self.help_docs_subject.all().delete()
        
        help_docs_subjects = []

        for help_doc in help_docs_subject:
            help_docs_subjects.append(main.models.HelpDocsSubject(instruction_set=self, 
                                                        title=help_doc['title'], 
                                                        text=help_doc['text']))
        
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
            "help_docs_subject" : [i.json() for i in self.help_docs_subject.all()],
        }
    
    async def ajson(self):
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

            "instruction_pages" : [await i.ajson() async for i in self.instructions.all()],
            "help_docs_subject" : [await i.ajson() async for i in self.help_docs_subject.all()],
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
        