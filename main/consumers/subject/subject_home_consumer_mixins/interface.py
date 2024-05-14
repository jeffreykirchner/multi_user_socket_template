
import json

class InterfaceMixin():
    '''
    interface actions from subject screen mixin
    '''

    async def target_location_update(self, event):
        '''
        update target location from subject screen, handled by staff consumer
        '''
        pass
    
    async def update_target_location_update(self, event):
        '''
        update target location from subject screen
        '''
        
        event_data = json.loads(event["group_data"])

        #don't send message to self
        if event_data["session_player_id"] == self.session_player_id:
            return

        await self.send_message(message_to_self=event_data, message_to_subjects=None, message_to_staff=None, 
                                message_type=event['type'], send_to_client=True, send_to_group=False)
    
    async def collect_token(self, event):
        '''
        subject collects token, handled by staff consumer
        '''
        pass

    async def update_collect_token(self, event):
        '''
        subject collects token update
        '''
        event_data = json.loads(event["group_data"])

        await self.send_message(message_to_self=event_data, message_to_subjects=None, message_to_staff=None, 
                                message_type=event['type'], send_to_client=True, send_to_group=False)
    
    async def tractor_beam(self, event):
        '''
        subject activates tractor beam, handled by staff consumer
        '''
        pass

    async def update_tractor_beam(self, event):
        '''
        subject activates tractor beam update
        '''

        event_data = json.loads(event["group_data"])

        await self.send_message(message_to_self=event_data, message_to_subjects=None, message_to_staff=None, 
                                message_type=event['type'], send_to_client=True, send_to_group=False)
        
    async def interaction(self, event):
        '''
        a subject has submitted an interaction, handled by staff consumer
        '''
        pass

    async def update_interaction(self, event):
        '''
        a subject has submitted an interaction, update
        '''

        event_data = json.loads(event["group_data"])

        await self.send_message(message_to_self=event_data, message_to_subjects=None, message_to_staff=None, 
                                message_type=event['type'], send_to_client=True, send_to_group=False)
        
    async def cancel_interaction(self, event):
        '''
        a subject has canceled an interaction, handled by staff consumer
        '''
        pass

    async def update_cancel_interaction(self, event):
        '''
        a subject has canceled an interaction, update
        '''

        event_data = json.loads(event["group_data"])

        await self.send_message(message_to_self=event_data, message_to_subjects=None, message_to_staff=None, 
                                message_type=event['type'], send_to_client=True, send_to_group=False)
    
    async def update_rescue_subject(self, event):
        '''
        update rescue subject
        '''

        event_data = json.loads(event["group_data"])

        await self.send_message(message_to_self=event_data, message_to_subjects=None, message_to_staff=None, 
                                message_type=event['type'], send_to_client=True, send_to_group=False)


        