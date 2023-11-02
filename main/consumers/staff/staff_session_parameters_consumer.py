
from .. import SocketConsumerMixin
from .. import StaffSubjectUpdateMixin

from .session_parameters_consumer_mixins import *
from .send_message_mixin import SendMessageMixin

class StaffSessionParametersConsumer(SocketConsumerMixin, 
                                     StaffSubjectUpdateMixin,
                                     GetParameterSetMixin,
                                     ParameterSetPlayersMixin,
                                     ControlParameterSetMixin,
                                     ParameterSetNoticesMixin,
                                     ParameterSetWallsMixin,
                                     ParameterSetBarriersMixin,
                                     ParameterSetGroupsMixin,
                                     ParameterSetGroundsMixin,
                                     SendMessageMixin):
    '''
    websocket for parameter set
    '''    

    #consumer updates
    async def update_connection_status(self, event):
        '''
        handle connection status update from group member
        '''


             
