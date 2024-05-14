
import json

from django.core.serializers.json import DjangoJSONEncoder

class SendMessageMixin:
    '''
    Mixin for sending messages to staff client
    '''

    async def send_message(self, message_to_self:dict, message_to_group:dict,
                                 message_type:dict, send_to_client:bool, 
                                 send_to_group:bool, target_list: list = None):
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
                         "group_data": json.dumps(message_to_group, cls=DjangoJSONEncoder),
                         "target_list": target_list,
                         "sender_channel_name": self.channel_name},
                    )