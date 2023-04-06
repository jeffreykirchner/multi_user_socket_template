from asgiref.sync import sync_to_async

from main.models import Session

class DataMixin():
    '''
    data mixin for staff session consumer
    '''
    
    async def download_summary_data(self, event):
        '''
        download summary data
        '''

        result = await sync_to_async(take_download_summary_data, thread_sensitive=self.thread_sensitive)(self.session_id)

        await self.send_message(message_to_self=result, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)

    async def download_action_data(self, event):
        '''
        download action data
        '''

        result = await sync_to_async(take_download_action_data, thread_sensitive=self.thread_sensitive)(self.session_id)

        await self.send_message(message_to_self=result, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)
    
    async def download_recruiter_data(self, event):
        '''
        download recruiter data
        '''

        result = await sync_to_async(take_download_recruiter_data, thread_sensitive=self.thread_sensitive)(self.session_id)

        await self.send_message(message_to_self=result, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)
    
    async def download_payment_data(self, event):
        '''
        download payment data
        '''

        result = await sync_to_async(take_download_payment_data, thread_sensitive=self.thread_sensitive)(self.session_id)

        await self.send_message(message_to_self=result, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)
        

def take_download_summary_data(session_id):
    '''
    download summary data for session
    '''

    session = Session.objects.get(id=session_id)

    return {"value" : "success", "result" : session.get_download_summary_csv()}

def take_download_action_data(session_id):
    '''
    download action data for session
    '''

    session = Session.objects.get(id=session_id)

    return {"value" : "success", "result" : session.get_download_action_csv()}

def take_download_recruiter_data(session_id):
    '''
    download recruiter data for session
    '''

    session = Session.objects.get(id=session_id)

    return {"value" : "success", "result" : session.get_download_recruiter_csv()}

def take_download_payment_data(session_id):
    '''
    download payment data for session
    '''

    session = Session.objects.get(id=session_id)

    return {"value" : "success", "result" : session.get_download_payment_csv()}
    
   