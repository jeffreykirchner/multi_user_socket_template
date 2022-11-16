/**start the experiment
*/
start_experiment(){
    app.working = true;
    app.send_message("start_experiment", {});
},

/** take start experiment response
 * @param message_data {json}
*/
take_start_experiment(message_data){
    app.take_get_session(message_data);
},

/** update start status
*    @param message_data {json} session day in json format
*/
take_update_start_experiment(message_data){
    app.take_get_session(message_data);
},

/** update start status
*    @param message_data {json} session day in json format
*/
take_update_reset_experiment(message_data){
    app.take_get_session(message_data);
},

/**reset experiment, remove all bids, asks and trades
*/
reset_experiment(){
    if (!confirm('Reset session? All activity will be removed.')) {
        return;
    }

    app.working = true;
    app.send_message("reset_experiment", {});
},

/** take reset experiment response
 * @param message_data {json}
*/
take_reset_experiment(message_data){
    app.chat_list_to_display=[];
    app.take_get_session(message_data);
},

reset_connections(){
    if (!confirm('Reset connection status?.')) {
        return;
    }

    app.working = true;
    app.send_message("reset_connections", {});
},

/** update start status
*    @param message_data {json} session day in json format
*/
take_update_reset_connections(message_data){
    app.take_get_session(message_data);
},

/** take reset experiment response
 * @param message_data {json}
*/
take_reset_connections(message_data){
    app.take_get_session(message_data);
},

/**advance to next phase
*/
next_experiment_phase(){
   
    if (!confirm('Continue to the next phase of the experiment?')) {
        return;
    }    

    app.working = true;
    app.send_message("next_phase", {});
},

/** take next period response
 * @param message_data {json}
*/
take_next_phase(message_data){
    
    app.session.current_experiment_phase = message_data.status.current_experiment_phase;
    app.update_phase_button_text();

},

/** take next period response
 * @param message_data {json}
*/
take_update_next_phase(message_data){
    
    app.session.current_experiment_phase = message_data.status.current_experiment_phase;
    app.update_phase_button_text();
},

/**
 * start the period timer
*/
start_timer(){
    app.working = true;

    let action = "";

    if(app.session.timer_running)
    {
        action = "stop";
    }
    else
    {
        action = "start";
    }

    app.send_message("start_timer", {action : action});
},

/** take start experiment response
 * @param message_data {json}
*/
take_start_timer(message_data){
    app.take_update_time(message_data);
},

/**reset experiment, remove all bids, asks and trades
*/
end_early(){
    if (!confirm('End the experiment after this period completes?')) {
        return;
    }

    app.working = true;
    app.send_message("end_early", {});
},

/** take reset experiment response
 * @param message_data {json}
*/
take_end_early(message_data){
   app.session.parameter_set.period_count = message_data.status.result;
},

/** send invitations
*/
send_send_invitations(){

    app.send_message_modal_form.text = tinymce.get("id_invitation_subject").getContent();

    if(app.send_message_modal_form.subject == "" || app.send_message_modal_form.text == "")
    {
        app.email_result = "Error: Please enter a subject and email body.";
        return;
    }

    app.cancel_modal = false;
    app.working = true;
    app.email_result = "Sending ...";

    app.send_message("send_invitations",
                   {"form_data" : app.send_message_modal_form});
},

/** take update subject response
 * @param message_data {json} result of update, either sucess or fail with errors
*/
take_send_invitations(message_data){
    app.clear_main_form_errors();

    if(message_data.status.value == "success")
    {           
        app.email_result = "Result: " + message_data.status.result.email_result.mail_count.toString() + " messages sent.";

        app.session.invitation_subject = message_data.status.result.invitation_subject;
        app.session.invitation_text = message_data.status.result.invitation_text;
    } 
    else
    {
        app.email_result = message_data.status.result;
    } 
},

/** show edit subject modal
*/
show_send_invitations(){

    app.cancel_modal=true;

    app.send_message_modal_form.subject = app.session.invitation_subject;
    app.send_message_modal_form.text = app.session.invitation_text;

    tinymce.get("id_invitation_subject").setContent(app.send_message_modal_form.text);

    app.send_message_modal.toggle();
},

/** hide edit subject modal
*/
hide_send_invitations(){
    app.email_result = "";
},

/**
 * fill invitation with default values
 */
fill_default_invitation(){
    app.send_message_modal_form.subject = app.email_default_subject;
    
    tinymce.get("id_invitation_subject").setContent(app.email_default_text);
},