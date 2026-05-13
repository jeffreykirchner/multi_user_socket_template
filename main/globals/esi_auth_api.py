'''
 ESI Account Auth API functions
'''
import logging
from venv import logger
from wsgiref import headers
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

import requests

from django.conf import settings

from main.models import Parameters

def esi_account_auth() -> bool:
    '''
    check if esi account needs a new token
    '''
    logger = logging.getLogger(__name__)
    logger.info("esi account auth")

    prm = Parameters.objects.first()

    headers = {"Accept": "application/json",
               "Accept-Language": "en_US"}

    status = "fail"
    if prm.esi_auth_access_token != "":
        #try to refresh token if it's expired
        data = {"grant_type":"refresh_token",
                "refresh_token": prm.esi_auth_refresh_token,
                "client_id": settings.ESI_AUTH_CLIENT_ID,
                "client_secret": settings.ESI_AUTH_CLIENT_SECRET,}

        req = requests.post(f'{settings.ESI_AUTH_URL}/o/token/',
                              headers = headers,
                              data = data)

        req_json = req.json()
        prm.esi_auth_access_token = req_json.get("access_token", "")
        prm.esi_auth_refresh_token = req_json.get("refresh_token", "")
        prm.esi_auth_token_expiration = datetime.now() + timedelta(seconds=req_json.get("expires_in", 0))

        prm.save()

        if req.status_code == 200:
            status = "success"
        else:
            logger.info(f'esi account auth failed to refresh token: {req_json}')
   
    if status == "fail":
        #no token or failed to refresh, need to login again with username/password
        data = {"grant_type":"password",
                "username": settings.ESI_AUTH_USERNAME,
                "password": settings.ESI_AUTH_PASS,}

        req = requests.post(f'{settings.ESI_AUTH_URL}/o/token/',
                              headers = headers,
                              auth=(str(settings.ESI_AUTH_CLIENT_ID), str(settings.ESI_AUTH_CLIENT_SECRET)),
                              data = data)

        req_json = req.json()
        prm.esi_auth_access_token = req_json.get("access_token", "")
        prm.esi_auth_refresh_token = req_json.get("refresh_token", "")
        prm.esi_auth_token_expiration = datetime.now() + timedelta(seconds=req_json.get("expires_in", 0))

        prm.save()

        if req.status_code == 200:
            status = "success"
        else:
            logger.info(f'esi account auth failed with username/password: {req_json}')

    # logger.info(f'esi_account_auth status code: {req.status_code}')

    if status == "fail":
        # logger.info(f'esi account auth failed: {req_json}')
        return False
    
    return True

def esi_account_action(val, mode, data) -> dict:
    '''
    check if esi account token needs refresh, and perform action with token
    '''
    logger = logging.getLogger(__name__)
    logger.info(f"esi_account_action {val}")

    prm = Parameters.objects.first()

    #check for token expiration, refresh will expire in the next 5 minutes to avoid failed requests due to expired token
    if prm.esi_auth_token_expiration is None or prm.esi_auth_token_expiration < datetime.now(ZoneInfo(prm.experiment_time_zone)) + timedelta(minutes=5):
        logger.info("esi account action: token expired, refreshing")
        if not esi_account_auth():
            logger.info("esi account action: token refresh failed to refresh")
            return {"error":"Authorization failed", "status": "fail"}

    prm = Parameters.objects.first()
    
    #do the action with the access token
    headers = {"Content-Type": "application/json",
               "Authorization": f"Bearer {prm.esi_auth_access_token}"}

    if mode == "get":
        req = requests.get(f'{settings.ESI_AUTH_URL}/{val}/',
                           headers = headers,
                           json = data,
                           timeout=20)
    else:
        logger.info("post")
        req = requests.post(f'{settings.ESI_AUTH_URL}/{val}/',
                            headers = headers,
                            json = data,
                            timeout=20)
    
    #check failed auth code
    if req.status_code != 200:
        if esi_account_auth():
            return esi_account_action(val, mode, data)
             
        logger.info("esi account action: API authorization failed")
        return {"error":"Authorization failed", "status": "fail"}
    
    req_json = req.json()
    req_json["status"] = "success" if req.status_code == 200 else "fail"

    logger.info(f'esi account action {req_json}')

    return req_json