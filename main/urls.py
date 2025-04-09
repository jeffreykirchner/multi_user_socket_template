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
    path('staff-instructions/', views.StaffInstructionsView.as_view(), name='staff-instructions'),
     path('staff-instruction-edit/<int:pk>/', views.StaffInstructionEditView.as_view(), name='staff-instruction-edit'),
    path('staff-session/<int:pk>/', views.StaffSessionView.as_view(), name='staff_session'),
    path('staff-session/<int:pk>/parameters', views.StaffSessionParametersView.as_view(), name='staff_session_parameters'),
    path('staff-session-subject-earnings/<int:pk>/', views.StaffSessionSubjectEarnings.as_view(), name='staff_session_subject_earnings'),
    path('staff-session-instructions/<int:pk>/<int:fill>/', views.StaffSessionInstructions.as_view(), name='staff_session_instructions'),
    
    path('subject-home/<uuid:player_key>', views.SubjectHomeView.as_view(), name='subject_home'),

    re_path(r'^auto-login/(?P<id_string>[a-z]{6})/$', views.SubjectHomeAutoConnectView.as_view(), name='subject_home_auto_connect'),
    re_path(r'^auto-login/(?P<id_string>[a-z]{6})/(?P<player_number>[0-9]+)/$', views.SubjectHomeAutoConnectView.as_view(), name='subject_home_auto_connect_player_number'),
    re_path(r'^auto-login-prolific/(?P<id_string>[a-z]{6})/$', views.SubjectHomeAutoConnectProlificView.as_view(), name='subject_home_auto_connect_prolific'),

    path('survey-complete/<uuid:player_key>', views.SubjectSurveyCompleteView.as_view(), name='subject_survey_complete'),

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
