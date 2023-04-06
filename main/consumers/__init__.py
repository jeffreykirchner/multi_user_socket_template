'''
build consumers
'''

from .socket_consumer_mixin import SocketConsumerMixin
from .staff_subject_update_mixin import StaffSubjectUpdateMixin

from .staff.staff_home_consumer import *
from .subject_home_consumer import *

from .staff import *