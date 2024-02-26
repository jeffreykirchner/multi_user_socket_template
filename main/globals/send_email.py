
'''
send email via ESI mass email service
'''
import logging
import requests
import sys

from django.conf import settings
from django.utils.html import strip_tags

def send_mass_email_service(user_list, message_subject, message_text, message_text_html, memo):
    '''
    send mass email through ESI mass pay service
    returns : {mail_count:int, error_message:str}

    :param user_list: List of users to email [{email:email, variables:[{name:""},{text:""}}, ]
    :type user_list: List

    :param message_subject : string subject header of message
    :type message_subject

    :param message_text : message template, variables : [first name]
    :type message_text: string 
    
    :param memo : note about message's purpose
    :type memo: string 

    :param unit_testing : if true do not send email, return expected result
    :type unit_testing: bool

    '''
    logger = logging.getLogger(__name__)

    if hasattr(sys, '_called_from_test'):
        logger.info(f"ESI mass email API: Unit Test")
        return {"mail_count":len(user_list), "error_message":""}

    data = {"user_list" : user_list,
            "message_subject" : message_subject,
            "message_text" : strip_tags(message_text).replace("&nbsp;", " "),
            "message_text_html" : message_text_html,
            "memo" : memo}
    
    # logger.info(f"ESI mass email API: users: {user_list}, message_subject : {message_subject}, message_text : {message_text}")

    headers = {'Content-Type' : 'application/json', 'Accept' : 'application/json'}

    request_result = requests.post(f'{settings.EMAIL_MS_HOST}/send-email/',
                                   json=data,
                                   auth=(str(settings.EMAIL_MS_USER_NAME), str(settings.EMAIL_MS_PASSWORD)),
                                   headers=headers,
                                   timeout=60)
    
    if request_result.status_code == 500:        
        logger.warning(f'send_mass_email_service error: {request_result}')
        return {"mail_count":0, "error_message":"Mail service error"}
   
    # logger.info(f"ESI mass email API response: {request_result.json()}")
    return request_result.json()