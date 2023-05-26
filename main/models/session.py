'''
session model
'''

from datetime import datetime
from tinymce.models import HTMLField
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

import logging
import uuid
import csv
import io
import json
import random

from django.conf import settings

from django.dispatch import receiver
from django.db import models
from django.db.models.signals import post_delete
from django.utils.timezone import now
from django.core.exceptions import ObjectDoesNotExist
from django.core.serializers.json import DjangoJSONEncoder

import main

from main.models import ParameterSet

from main.globals import ExperimentPhase

#experiment sessoin
class Session(models.Model):
    '''
    session model
    '''
    parameter_set = models.ForeignKey(ParameterSet, on_delete=models.CASCADE)
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sessions_a")
    collaborators = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="sessions_b")

    title = models.CharField(max_length = 300, default="*** New Session ***")    #title of session
    start_date = models.DateField(default=now)                                   #date of session start

    current_experiment_phase = models.CharField(max_length=100, choices=ExperimentPhase.choices, default=ExperimentPhase.RUN)         #current phase of expeirment

    channel_key = models.UUIDField(default=uuid.uuid4, editable=False, verbose_name = 'Channel Key')     #unique channel to communicate on
    session_key = models.UUIDField(default=uuid.uuid4, editable=False, verbose_name = 'Session Key')     #unique key for session to auto login subjects by id

    started =  models.BooleanField(default=False)                                #starts session and filll in session
    current_period = models.IntegerField(default=0)                              #current period of the session
    time_remaining = models.IntegerField(default=0)                              #time remaining in current phase of current period
    timer_running = models.BooleanField(default=False)                           #true when period timer is running
    finished = models.BooleanField(default=False)                                #true after all session periods are complete

    shared = models.BooleanField(default=False)                                  #shared session parameter sets can be imported by other users
    locked = models.BooleanField(default=False)                                  #locked models cannot be deleted

    invitation_text = HTMLField(default="", verbose_name="Invitation Text")       #inviataion email subject and text
    invitation_subject = HTMLField(default="", verbose_name="Invitation Subject")

    world_state = models.JSONField(encoder=DjangoJSONEncoder, null=True, blank=True, verbose_name="Current Session State")       #world state at this point in session

    soft_delete =  models.BooleanField(default=False)                             #hide session if true

    timestamp = models.DateTimeField(auto_now_add=True)
    updated= models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    def creator_string(self):
        return self.creator.email
    creator_string.short_description = 'Creator'

    class Meta:
        verbose_name = 'Session'
        verbose_name_plural = 'Sessions'
        ordering = ['-start_date']

    def get_start_date_string(self):
        '''
        get a formatted string of start date
        '''
        return  self.start_date.strftime("%#m/%#d/%Y")

    def get_group_channel_name(self):
        '''
        return channel name for group
        '''
        page_key = f"session-{self.id}"
        room_name = f"{self.channel_key}"
        return  f'{page_key}-{room_name}'
    
    def send_message_to_group(self, message_type, message_data):
        '''
        send socket message to group
        '''
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(self.get_group_channel_name(),
                                                {"type" : message_type,
                                                 "data" : message_data})

    def start_experiment(self):
        '''
        setup and start experiment
        '''

        self.started = True
        self.finished = False
        self.current_period = 1
        self.start_date = datetime.now()
        self.time_remaining = self.parameter_set.period_length

        if self.parameter_set.show_instructions:
            self.current_experiment_phase = ExperimentPhase.INSTRUCTIONS
        else:
            self.current_experiment_phase = ExperimentPhase.RUN
        
        session_periods = []

        for i in range(self.parameter_set.period_count):
            session_periods.append(main.models.SessionPeriod(session=self, period_number=i+1))
        
        main.models.SessionPeriod.objects.bulk_create(session_periods)

        self.save()

        for i in self.session_players.all():
            i.start()

        self.setup_world_state()

    def setup_world_state(self):
        '''
        setup world state
        '''
        self.world_state = {"last_update":str(datetime.now()), 
                            "session_players":{},
                            "current_period":1,
                            "current_experiment_phase":ExperimentPhase.INSTRUCTIONS if self.parameter_set.show_instructions else ExperimentPhase.RUN,
                            "time_remaining":self.parameter_set.period_length,
                            "timer_running":False,
                            "started":self.started,
                            "finished":self.finished,
                            "session_periods":{str(i.id) : i.json() for i in self.session_periods.all()},
                            "session_periods_order" : list(self.session_periods.all().values_list('id', flat=True)),
                            "tokens":{},}
        
        inventory = {str(i):0 for i in list(self.session_periods.all().values_list('id', flat=True))}
        
        #session players
        for i in self.session_players.prefetch_related('parameter_set_player').all().values('id', 
                                                                                            'parameter_set_player__start_x',
                                                                                            'parameter_set_player__start_y' ):
            v = {}

            v['current_location'] = {'x':i['parameter_set_player__start_x'], 'y':i['parameter_set_player__start_y']}
            v['target_location'] = v['current_location']
            v['inventory'] = inventory
            v['tractor_beam_target'] = None
            v['frozen'] = False
            v['cool_down'] = 0
            v['interaction'] = 0
            v['earnings'] = 0
            
            self.world_state["session_players"][str(i['id'])] = v
        
        #tokens
        tokens = {}
        for i in self.session_periods.all():
            tokens[str(i)] = {}

            for j in range(self.parameter_set.tokens_per_period):
                
                token = {"current_location" : {
                            "x":random.randint(25, self.parameter_set.world_width-25),
                            "y":random.randint(25, self.parameter_set.world_height-25)},
                        "status":"available",}
                
                tokens[str(i)][str(j)] = token
            

        self.world_state["tokens"] = tokens

        self.save()

    def reset_experiment(self):
        '''
        reset the experiment
        '''
        self.started = False
        self.finished = False
        self.current_period = 1
        self.time_remaining = self.parameter_set.period_length
        self.timer_running = False
        self.current_experiment_phase = ExperimentPhase.RUN
        self.world_state ={}
        self.save()

        for p in self.session_players.all():
            p.reset()

        self.session_periods.all().delete()
        self.session_events.all().delete()

        # self.parameter_set.setup()
    
    def reset_connection_counts(self):
        '''
        reset connection counts
        '''
        self.session_players.all().update(connecting=False, connected_count=0)
    
    def get_current_session_period(self):
        '''
        return the current session period
        '''
        if not self.started:
            return None

        return self.session_periods.get(period_number=self.current_period)

    async def aget_current_session_period(self):
        '''
        return the current session period
        '''
        if not self.started:
            return None

        return await self.session_periods.aget(period_number=self.current_period)
    
    def update_player_count(self):
        '''
        update the number of session players based on the number defined in the parameterset
        '''

        self.session_players.all().delete()
    
        for count, i in enumerate(self.parameter_set.parameter_set_players.all()):
            new_session_player = main.models.SessionPlayer()

            new_session_player.session = self
            new_session_player.parameter_set_player = i
            new_session_player.player_number = i.player_number

            new_session_player.save()

    def do_period_timer(self):
        '''
        do period timer actions
        '''

        status = "success"        
        stop_timer = False

        #check session over
        if self.time_remaining == 0 and \
           self.current_period >= self.parameter_set.period_count:

            self.current_experiment_phase = ExperimentPhase.NAMES
            stop_timer = True
           
        if not status == "fail" and \
           self.current_experiment_phase != ExperimentPhase.NAMES:

            if self.time_remaining == 0:
                self.get_current_session_period().store_earnings()

                self.current_period += 1
                self.time_remaining = self.parameter_set.period_length
            else:                                     
                self.time_remaining -= 1

        self.save()

        result = self.json_for_timer()

        return {"value" : status,
                "result" : result,
                "stop_timer" : stop_timer,
                }

    def user_is_owner(self, user):
        '''
        return turn is user is owner or an admin
        '''

        if user.is_staff:
            return True

        if user==self.creator:
            return True
        
        return False

    def get_download_summary_csv(self):
        '''
        return data summary in csv format
        '''
        output = io.StringIO()

        writer = csv.writer(output, quoting=csv.QUOTE_NONNUMERIC)

        writer.writerow(["Session ID", "Period", "Client #", "Label", "Earnings ¢"])

        session_player_periods = main.models.SessionPlayerPeriod.objects.filter(session_player__in=self.session_players.all()) \
                                                                        .order_by('session_period__period_number', 'session_player__player_number')

        for p in session_player_periods.all():
            p.write_summary_download_csv(writer)

        return output.getvalue()
    
    def get_download_action_csv(self):
        '''
        return data actions in csv format
        '''
        output = io.StringIO()

        writer = csv.writer(output, quoting=csv.QUOTE_NONNUMERIC)

        writer.writerow(["Session ID", "Period", "Time", "Client #", "Label", "Action", "Info", "Info (JSON)", "Timestamp"])

        session_player_chats = main.models.SessionPlayerChat.objects.filter(session_player__in=self.session_players.all())

        for p in session_player_chats.all():
            p.write_action_download_csv(writer)

        return output.getvalue()
    
    def get_download_recruiter_csv(self):
        '''
        return data recruiter in csv format
        '''
        output = io.StringIO()

        writer = csv.writer(output)

        session_players = self.session_players.all()

        for p in session_players:
            writer.writerow([p.student_id, p.earnings/100])

        return output.getvalue()
    
    def get_download_payment_csv(self):
        '''
        return data payments in csv format
        '''
        output = io.StringIO()

        writer = csv.writer(output)

        writer.writerow(['Session', 'Date', 'Player', 'Name', 'Student ID', 'Earnings'])

        session_players = self.session_players.all()

        for p in session_players:
            writer.writerow([self.id, self.get_start_date_string(), p.player_number,p.name, p.student_id, p.earnings/100])

        return output.getvalue()

    def json(self):
        '''
        return json object of model
        '''
                                                                      
        return{
            "id":self.id,
            "title":self.title,
            "locked":self.locked,
            "start_date":self.get_start_date_string(),
            "started":self.started,
            "current_experiment_phase":self.current_experiment_phase,
            "current_period":self.current_period,
            "time_remaining":self.time_remaining,
            "timer_running":self.timer_running,
            "finished":self.finished,
            "parameter_set":self.parameter_set.json(),
            "session_periods":{i.id : i.json() for i in self.session_periods.all()},
            "session_periods_order" : list(self.session_periods.all().values_list('id', flat=True)),
            "session_players":{i.id : i.json(False) for i in self.session_players.all()},
            "session_players_order" : list(self.session_players.all().values_list('id', flat=True)),
            "invitation_text" : self.invitation_text,
            "invitation_subject" : self.invitation_subject,
            "world_state" : self.world_state,
        }
    
    def json_for_subject(self, session_player):
        '''
        json object for subject screen
        session_player : SessionPlayer() : session player requesting session object
        '''
        
        return{
            "started":self.started,
            "current_experiment_phase":self.current_experiment_phase,
            "current_period":self.current_period,
            "time_remaining":self.time_remaining,
            "timer_running":self.timer_running,
            "finished":self.finished,
            "parameter_set":self.parameter_set.get_json_for_subject(),

            "session_players":{i.id : i.json_for_subject(session_player) for i in self.session_players.all()},
            "session_players_order" : list(self.session_players.all().values_list('id', flat=True)),

            "session_periods":{i.id : i.json() for i in self.session_periods.all()},
            "session_periods_order" : list(self.session_periods.all().values_list('id', flat=True)),

            "world_state" : self.world_state,
        }
    
    def json_for_timer(self):
        '''
        return json object for timer update
        '''

        session_players = []

        return{
            "started":self.started,
            "current_period":self.current_period,
            "time_remaining":self.time_remaining,
            "timer_running":self.timer_running,
            "finished":self.finished,
            "session_players":session_players,
            "current_experiment_phase" : self.current_experiment_phase,
            "session_player_earnings": [i.json_earning() for i in self.session_players.all()]
        }
    
    def json_for_parameter_set(self):
        '''
        return json for parameter set setup.
        '''
        message = {
            "id" : self.id,
            "started": self.started,
        }
    
        return message
        
@receiver(post_delete, sender=Session)
def post_delete_parameterset(sender, instance, *args, **kwargs):
    '''
    use signal to delete associated parameter set
    '''
    if instance.parameter_set:
        instance.parameter_set.delete()
