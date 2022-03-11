'''
URL Patterns
'''

from django.views.generic.base import RedirectView
from django.contrib.auth.decorators import login_required

from django.urls import path
from django.urls import re_path
from main import views

urlpatterns = [

    #auth
    re_path(r'^admin/login/$', views.LoginView.as_view()),
    re_path(r'^admin/logout/', views.logout_view),
    path('accounts/login/', views.LoginView.as_view(), name='login'),
    path('accounts/logout/', views.logout_view, name='logout'),

    #main    
    path('', views.StaffHomeView.as_view(), name='home'),
    path('staff-home/', views.StaffHomeView.as_view(), name='staff-home'),
    path('staff-session/<int:pk>/', views.StaffSessionView.as_view(), name='staff_session'),
    path('staff-session/<int:pk>/parameters', views.StaffSessionParametersView.as_view(), name='staff_session_parameters'),
    path('staff-session-subject-earnings/<int:pk>/', views.StaffSessionSubjectEarnings.as_view(), name='staff_session_subject_earnings'),

    path('subject-home/<uuid:player_key>', views.SubjectHomeView.as_view(), name='subject_home'),

    path('auto-login/<uuid:session_key>/', views.SubjectHomeAutoConnectView.as_view(), name='subject_home_auto_connect'),
    path('auto-login/<uuid:session_key>/<int:player_number>/', views.SubjectHomeAutoConnectView.as_view(), name='subject_home_auto_connect_player_number'),
    
    #txt
    path('robots.txt', views.RobotsTxt, name='robotsTxt'),
    path('ads.txt', views.AdsTxt, name='adsTxt'),
    path('.well-known/security.txt', views.SecurityTxt, name='securityTxt'),
    path('humans.txt', views.HumansTxt, name='humansTxt'),

    #icons
    path('favicon.ico', RedirectView.as_view(url='/static/favicon.ico'), name='favicon'),
    path('apple-touch-icon-precomposed.png', RedirectView.as_view(url='/static/apple-touch-icon-precomposed.png'), name='favicon'),
    path('apple-touch-icon.png', RedirectView.as_view(url='/static/apple-touch-icon-precomposed.png'), name='favicon'),
    path('apple-touch-icon-120x120-precomposed.png', RedirectView.as_view(url='/static/apple-touch-icon-precomposed.png'), name='favicon'),
]
