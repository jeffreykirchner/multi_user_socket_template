

class InterfaceMixin():
    '''
    interface actions from subject screen mixin
    '''

    async def target_location_update(self, event):
        '''
        update target location from subject screen
        '''
        
        data = event["message_text"]

        result = {"value" : "success"}

        try:
            target_location = data["target_location"]            
        except KeyError:
            result = {"value" : "fail", "result" : {"message" : "Invalid location."}}
        

        if result["value"] != "fail":
            result["target_location"] = target_location
            result["session_player_id"] = self.session_player_id

            await self.send_message(message_to_self=None, message_to_subjects=result, message_to_staff=result, 
                                    message_type=event['type'], send_to_client=False, send_to_group=True)

    
    async def update_target_location_update(self, event):
        '''
        update target location from subject screen
        '''
        
        event_data = event["subject_data"]

        #don't send message to self
        if event_data["session_player_id"] == self.session_player_id:
            return

        await self.send_message(message_to_self=event_data, message_to_subjects=None, message_to_staff=None, 
                                message_type=event['type'], send_to_client=True, send_to_group=False)
    
    async def collect_token(self, event):
        '''
        subject collects token
        '''
        pass

    async def collect_token_update(self, event):
        '''
        subject collects token
        '''
        pass


        