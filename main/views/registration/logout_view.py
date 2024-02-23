'''
log out user
'''
import logging

from django.contrib.auth import logout
from django.shortcuts import render

def logout_view(request):
    '''
    log out user
    '''
    logger = logging.getLogger(__name__)     
    # logger.info(f"Log out {request.user}")

    logout(request)

    return render(request,'registration/logged_out.html',{})

    
