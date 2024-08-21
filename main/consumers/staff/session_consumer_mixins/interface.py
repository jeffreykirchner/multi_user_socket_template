
import logging

from main.models import Session
from main.models import SessionPlayer
from main.models import SessionEvent

class InterfaceMixin():
    '''
    messages from the staff screen interface
    '''
    
    async def load_session_events(self, event):
        '''
        load session events
        '''
        session = await Session.objects.aget(id=self.session_id)
        session_events_local = {}

        # if session.replay_data:
        #     session_events_local = session.replay_data
        # else:
        async for i in session.session_periods.all():

            session_events_local[str(i.period_number)] = {}

            total_period_length = self.parameter_set_local["period_length"]

            if i.period_number % self.parameter_set_local["break_frequency"] == 0:
                total_period_length += self.parameter_set_local["break_length"]

            for j in range(total_period_length+1):
                session_events_local[str(i.period_number)][str(j)] = []

        async for i in session.session_events.exclude(type="help_doc"):
            v = {"type" : i.type, "data" : i.data}
            session_events_local[str(i.period_number)][str(i.time_remaining)].append(v)

        # session.replay_data = session_events_local
        # await session.asave()

        result = {"session_events": session_events_local}


        await self.send_message(message_to_self=result, message_to_group=None,
                                message_type=event['type'], send_to_client=True, send_to_group=False)
    


