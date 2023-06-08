
import logging

from main.models import Session
from main.models import SessionPlayer
from main.models import SessionEvent

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
    
    async def load_session_events(self, event):
        '''
        load session events
        '''
        session_events = {}

        session = await Session.objects.aget(id=self.session_id)

        async for i in session.session_periods.all():
            session_events[i.id] = {}
            for j in range(self.parameter_set_local["period_length"]):
                session_events[i.id][str(j+1)] = []


        async for i in session.session_events.all():
            v = {}
            session_events[i.period_number][str(i.time_remaining)].append(v)

        result = {"session_events": session_events}

        await self.send_message(message_to_self=result, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)
    


