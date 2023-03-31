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
                           SendMessageMixin):

    has_timer_control = False         #this instance is controlling the timer
    timer_running = False              


