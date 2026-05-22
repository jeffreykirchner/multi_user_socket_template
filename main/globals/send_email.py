
'''
send email via ESI mass email service
'''
import logging
import requests
import sys

from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from django.conf import settings
from django.utils.html import strip_tags

from main.models import Parameters

def email_ms_auth() -> bool:
    '''
    check if email service needs a new token
    '''
    logger = logging.getLogger(__name__)
    logger.info("email service auth")

    prm = Parameters.objects.first()

    headers = {"Accept": "application/json",
               "Accept-Language": "en_US"}

    status = "fail"
    if prm.email_ms_access_token != "":
        #try to refresh token if it's expired
        data = {"grant_type":"refresh_token",
                "refresh_token": prm.email_ms_refresh_token,
                "client_id": settings.EMAIL_MS_CLIENT_ID,
                "client_secret": settings.EMAIL_MS_CLIENT_SECRET,}

        req = requests.post(f'{settings.EMAIL_MS_HOST}/o/token/',
                              headers = headers,
                              data = data)

        req_json = req.json()
        prm.email_ms_access_token = req_json.get("access_token", "")
        prm.email_ms_refresh_token = req_json.get("refresh_token", "")
        prm.email_ms_token_expiration = datetime.now() + timedelta(seconds=req_json.get("expires_in", 0))

        prm.save()

        if req.status_code == 200:
            status = "success"
        else:
            logger.info(f'email service auth failed to refresh token: {req_json}')
   
    if status == "fail":
        #no token or failed to refresh, need to login again with username/password
        data = {"grant_type":"password",
                "username": settings.EMAIL_MS_USER_NAME,
                "password": settings.EMAIL_MS_PASSWORD,}

        req = requests.post(f'{settings.EMAIL_MS_HOST}/o/token/',
                              headers = headers,
                              auth=(str(settings.EMAIL_MS_CLIENT_ID), str(settings.EMAIL_MS_CLIENT_SECRET)),
                              data = data)

        req_json = req.json()
        prm.email_ms_access_token = req_json.get("access_token", "")
        prm.email_ms_refresh_token = req_json.get("refresh_token", "")
        prm.email_ms_token_expiration = datetime.now() + timedelta(seconds=req_json.get("expires_in", 0))

        prm.save()

        if req.status_code == 200:
            status = "success"
        else:
            logger.info(f'email service auth failed with username/password: {req_json}')

    # logger.info(f'email_service_auth status code: {req.status_code}')

    if status == "fail":
        # logger.info(f'email service auth failed: {req_json}')
        return False
    
    return True

def send_mass_email_service(user_list: list, message_subject: str, message_text: str, message_text_html: str, memo: str) -> dict:
    '''
    send mass email through ESI mass pay service
    returns : {mail_count:int, error_message:str}

    :param user_list: List of users to email [{email:email, variables:[{name:""},{text:""}}, ]

    :param message_subject : string subject header of message

    :param message_text : message template, variables : [first name]
    
    :param memo : note about message's purpose

    :param unit_testing : if true do not send email, return expected result

    '''
    logger = logging.getLogger(__name__)

    if hasattr(sys, '_called_from_test'):
        logger.info(f"ESI mass email API: Unit Test")
        return {"mail_count":len(user_list), "error_message":""}
    
    prm = Parameters.objects.first()

    #check for token expiration, refresh will expire in the next 5 minutes to avoid failed requests due to expired token
    if prm.email_ms_token_expiration is None or prm.email_ms_token_expiration < datetime.now(ZoneInfo(prm.experiment_time_zone)) + timedelta(minutes=5):
        logger.info("email service action: token expired, refreshing")
        if not email_ms_auth():
            logger.info("email service action: token refresh failed to refresh")
            return {"error":"Authorization failed", "status": "fail"}

    headers = {"Content-Type": "application/json",
               "Authorization": f"Bearer {prm.email_ms_access_token}"}

    data = {"user_list" : user_list,
            "message_subject" : message_subject,
            "message_text" : strip_tags(message_text).replace("&nbsp;", " "),
            "message_text_html" : message_text_html,
            "memo" : memo}
    
    # logger.info(f"ESI mass email API: users: {user_list}, message_subject : {message_subject}, message_text : {message_text}")

    request_result = requests.post(f'{settings.EMAIL_MS_HOST}/send-email/',
                                   json=data,
                                   headers=headers,
                                   timeout=60)
    
    if request_result.status_code == 500:        
        logger.warning(f'send_mass_email_service error: {request_result}')
        return {"mail_count":0, "error_message":"Mail service error"}

    #check failed auth code
    if request_result.status_code != 201:
        if email_ms_auth():
            return send_mass_email_service(user_list, message_subject, message_text, message_text_html, memo)
             
        logger.info("esi account action: API authorization failed")
        return {"error":"Authorization failed", "status": "fail"}
    else:
    # logger.info(f"ESI mass email API response: {request_result.json()}")
        return request_result.json()