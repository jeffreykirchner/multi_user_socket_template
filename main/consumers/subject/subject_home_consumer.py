'''
websocket session list
'''
import json


from django.core.serializers.json import DjangoJSONEncoder

from main.consumers import SocketConsumerMixin
from main.consumers import StaffSubjectUpdateMixin

from .subject_home_consumer_mixins import *

class SubjectHomeConsumer(SocketConsumerMixin, 
                          StaffSubjectUpdateMixin, 
                          GetSessionMixin, 
                          ChatMixin,
                          NameMixin,
                          InstructionsMixin,
                          PhaseMixin,
                          TimeMixin,
                          GetHelpDocSubjectMixin,
                          InterfaceMixin):
    '''
    websocket methods for subject home
    '''    

    session_player_id = 0   #session player id number

    async def send_message(self, message_to_self:dict, message_to_subjects:dict, message_to_staff:dict,
                                 message_type:dict, send_to_client:bool, send_to_group:bool):
        '''
        send response to client
        '''
        # Send message to local client
        if send_to_client:
            message_to_self_data = {}
            message_to_self_data["message_type"] = message_type
            message_to_self_data["message_data"] = message_to_self

            await self.send(text_data=json.dumps({'message': message_to_self_data,}, cls=DjangoJSONEncoder))

        if send_to_group:
            await self.channel_layer.group_send(
                self.room_group_name,
                    {"type": f"update_{message_type}",
                     "subject_data": message_to_subjects,
                     "staff_data": message_to_staff,
                     "sender_channel_name": self.channel_name},
                )
    
    async def update_set_controlling_channel(self, event):
        '''
        update controlling channel
        '''
        event_data = json.loads(event["group_data"])
        self.controlling_channel = event_data["controlling_channel"]
           
    #consumer calls to ignore
    async def update_reset_connections(self, event):
        '''
        reset connections on subjects
        '''
        pass

    async def update_connection_status(self, event):
        '''
        handle connection status update from group member
        '''
        pass
    
    async def update_anonymize_data(self, event):
        '''
        no anonmyize data update on client
        '''

    async def update_survey_complete(self, event):
        '''
        no group broadcast of survey complete
        '''
        pass