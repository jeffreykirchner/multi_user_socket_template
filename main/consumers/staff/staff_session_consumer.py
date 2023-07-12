'''
websocket session list
'''
from .. import SocketConsumerMixin
from.. import StaffSubjectUpdateMixin

from .session_consumer_mixins import *

from .send_message_mixin import SendMessageMixin

class StaffSessionConsumer(SocketConsumerMixin, 
                           StaffSubjectUpdateMixin,
                           GetSessionMixin,
                           UpdateSessionMixin,
                           ExperimentControlsMixin,
                           TimerMixin,
                           SubjectControlsMixin,
                           DataMixin,
                           SubjectUpdatesMixin,
                           InterfaceMixin,
                           SendMessageMixin):

    has_timer_control = False         #this instance is controlling the timer           
    world_state_local = {}            #local copy of world state
    session_players_local = {}        #local copy of session players
    parameter_set_local = {}          #local copy of parameter set   


