'''
websocket session list
'''
import json

from django.core.serializers.json import DjangoJSONEncoder

from main.consumers import SocketConsumerMixin
from main.consumers import StaffSubjectUpdateMixin

from main.consumers.staff_session_consumer_mixins import *

class StaffSessionConsumer(SocketConsumerMixin, 
                           StaffSubjectUpdateMixin,
                           GetSessionMixin,
                           UpdateSessionMixin,
                           ExperimentControlsMixin,
                           TimerMixin,
                           SubjectControlsMixin,
                           DataMixin,
                           SubjectUpdatesMixin):
    '''
    websocket methods
    '''    

    has_timer_control = False         #this instance is controlling the timer
    timer_running = False              

    async def send_message(self, message_to_self:dict, message_to_group:dict,
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
                     "group_data": message_to_group,
                     "sender_channel_name": self.channel_name},
                )


