'''
web socket routing
'''
from django.urls import re_path

from main.consumers import StaffHomeConsumer
from main.consumers import StaffSessionConsumer
from main.consumers import StaffSessionParametersConsumer
from main.consumers import SubjectHomeConsumer
from main.consumers import StaffInstructionsConsumer
from main.consumers import StaffInstructionEditConsumer

from django.contrib.auth.decorators import login_required
from channels.auth import AuthMiddlewareStack

#web socket routing
websocket_urlpatterns = [
    re_path(r'ws/staff-home/(?P<room_name>[-\w]+)/(?P<page_key>[-\w]+)/(?P<player_key>[-\w]+)', StaffHomeConsumer.as_asgi()),
    re_path(r'ws/staff-instructions/(?P<room_name>[-\w]+)/(?P<page_key>[-\w]+)/(?P<player_key>[-\w]+)', StaffInstructionsConsumer.as_asgi()),
    re_path(r'ws/staff-instruction-edit/(?P<room_name>[-\w]+)/(?P<page_key>[-\w]+)/(?P<player_key>[-\w]+)', StaffInstructionEditConsumer.as_asgi()),
    re_path(r'ws/staff-session/(?P<room_name>[-\w]+)/(?P<page_key>[-\w]+)/(?P<player_key>[-\w]+)', StaffSessionConsumer.as_asgi()),
    re_path(r'ws/staff-session-parameters/(?P<room_name>[-\w]+)/(?P<page_key>[-\w]+)/(?P<player_key>[-\w]+)', StaffSessionParametersConsumer.as_asgi()),
    re_path(r'ws/subject-home/(?P<room_name>[-\w]+)/(?P<page_key>[-\w]+)/(?P<player_key>[-\w]+)', SubjectHomeConsumer.as_asgi()),
]