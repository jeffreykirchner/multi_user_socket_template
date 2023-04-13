
from main.models import Session

class InterfaceMixin():
    '''
    messages from the staff screen interface
    '''
    
    async def world_state_update(self, event):
        '''
        take update for world_state
        '''

        client_side_world_state = event["message_text"]["world_state"]
        
        for i in client_side_world_state["session_players"]:            
            self.world_state_local["session_players"][i]["current_location"] = client_side_world_state["session_players"][i]["current_location"]
        
        await Session.objects.filter(id=self.session_id).aupdate(world_state=self.world_state_local)

