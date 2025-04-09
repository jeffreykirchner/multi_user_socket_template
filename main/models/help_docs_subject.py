'''
help document subject
'''
from tinymce.models import HTMLField
from django.db import models

from main.models import InstructionSet

class HelpDocsSubject(models.Model):
    '''
    help document
    '''
    instruction_set = models.ForeignKey(InstructionSet, on_delete=models.CASCADE, related_name="help_docs_subject")

    title = models.CharField(verbose_name = 'Title', max_length = 300, default="")    
    text = HTMLField(verbose_name = 'Help Doc Text', max_length = 100000, default="")
    
    timestamp = models.DateTimeField(auto_now_add=True)
    updated= models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Help Doc Subject'
        verbose_name_plural = 'Help Docs Subject'
        ordering = ['title']
        constraints = [
            models.UniqueConstraint(fields=['instruction_set', 'title'], name='unique_help_doc_subject'),
        ]

    def __str__(self):
        return self.title
    
    def json(self):
        return{
            "id":self.id,
            "title":self.title,
            "text":self.text,
        }
    
    async def ajson(self):
        return{
            "id":self.id,
            "title":self.title,
            "text":self.text,
        }