
import logging
import string

from asgiref.sync import sync_to_async

from main.models import Session

from main.globals import ExperimentPhase

from main.forms import EndGameForm

class NameMixin():
    '''
    Get name mixin for subject home consumer
    '''

    async def name(self, event):
        '''
        take name and id number
        '''

        data = event["message_text"]

        logger = logging.getLogger(__name__) 
        # logger.info(f"Take name: {self.session_id} {self.session_player_id} {data}")

        form_data_dict =  data["form_data"]
        
        session = await Session.objects.aget(id=self.session_id)
        session_player = await session.session_players.aget(id=self.session_player_id)

        if session.world_state["current_experiment_phase"] != ExperimentPhase.NAMES:
            result = {"value" : "fail", "errors" : {f"name":["Session not complete."]},
                      "message" : "Session not complete."}
        else:
            # logger.info(f'form_data_dict : {form_data_dict}')       

            form = EndGameForm(form_data_dict)
                
            if form.is_valid():
                #print("valid form") 

                session_player.name = form.cleaned_data["name"]
                session_player.student_id = form.cleaned_data["student_id"]
                session_player.name_submitted = True

                session_player.name = string.capwords(session_player.name)

                # await sync_to_async(session_player.save, thread_sensitive=self.thread_sensitive)()    
                await session_player.asave()
                
                result = {"value" : "success",
                            "result" : {"id" : self.session_player_id,
                                        "name" : session_player.name, 
                                        "name_submitted" : session_player.name_submitted,
                                        "student_id" : session_player.student_id}}                      
            else:                            
                logger.warning("Invalid name form")

                result = {"value" : "fail", "errors" : dict(form.errors.items()), "message" : ""}

        await self.send_message(message_to_self=result, message_to_subjects=None, message_to_staff=result, 
                                message_type=event['type'], send_to_client=True, send_to_group=True)
    
    async def update_name(self, event):
        '''
        no group broadcast of name to subjects
        '''
        pass

