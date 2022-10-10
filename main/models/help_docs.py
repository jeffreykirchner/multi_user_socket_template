'''
help document
'''
from tinymce.models import HTMLField
from django.db import models

class HelpDocs(models.Model):
    '''
    help document
    '''
    title = models.CharField(verbose_name = 'Title', max_length = 300, default="")    
    text = HTMLField(verbose_name = 'Help Doc Text', max_length = 100000, default="")

    timestamp = models.DateTimeField(auto_now_add=True)
    updated= models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Help Doc'
        verbose_name_plural = 'Help Docs'
        ordering = ['title']
        constraints = [
            models.UniqueConstraint(fields=['title'], name='unique_help_doc'),
        ]

    def __str__(self):
        return self.title
    
    def json(self):
        return{
            "id":self.id,
            "title":self.title,
            "text":self.text,
        }