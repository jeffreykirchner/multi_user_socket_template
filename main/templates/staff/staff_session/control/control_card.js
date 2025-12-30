/**start the experiment
*/
start_experiment: function start_experiment(){
    app.working = true;
    app.send_message("start_experiment", {});
},

/** take start experiment response
 * @param message_data {json}
*/
take_start_experiment: function take_start_experiment(message_data){
    app.take_get_session(message_data);
},

/** update start status
*    @param message_data {json} session day in json format
*/
take_update_start_experiment: function take_update_start_experiment(message_data){
    app.take_get_session(message_data);
},

/**reset experiment, remove all bids, asks and trades
*/
reset_experiment: async function reset_experiment(){
    if (!await show_confirm_dialog('Reset session? All activity will be removed.')) {
        return;
    }

    if(worker) worker.terminate();

    app.session.world_state.timer_running = false;
    app.working = true;
    app.send_message("reset_experiment", {});
},

/** take reset experiment response
 * @param message_data {json}
*/
take_reset_experiment: function take_reset_experiment(message_data){
    app.take_get_session(message_data);
},

reset_connections: async function reset_connections(){
    if (!await show_confirm_dialog('Reset connection status?')) {
        return;
    }

    app.working = true;
    app.send_message("reset_connections", {});
},

/** update start status
*    @param message_data {json} session day in json format
*/
take_update_reset_connections: function take_update_reset_connections(message_data){
    app.take_get_session(message_data);
},

/** take reset experiment response
 * @param message_data {json}
*/
take_reset_connections: function take_reset_connections(message_data){
    app.take_get_session(message_data);
},

/**advance to next phase
*/
next_experiment_phase: async function next_experiment_phase(){

    if (!await show_confirm_dialog('Continue to the next phase of the experiment?')) {
        return;
    }    

    app.working = true;
    app.send_message("next_phase", {});
},

/** take next period response
 * @param message_data {json}
*/
take_next_phase: function take_next_phase(message_data){
    
    app.session.world_state.current_experiment_phase = message_data.current_experiment_phase;
    app.session.world_state.finished = message_data.finished;
    app.update_phase_button_text();

},

/** take next period response
 * @param message_data {json}
*/
take_update_next_phase: function take_update_next_phase(message_data){
    
    app.session.world_state.current_experiment_phase = message_data.current_experiment_phase;
    app.session.world_state.finished = message_data.finished;
    app.update_phase_button_text();
},

/**
 * start the period timer
*/
start_timer: function start_timer(){
    app.working = true;

    let action = "";

    if(app.session.world_state.timer_running)
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
take_start_timer: function take_start_timer(message_data){
   
    if(worker) worker.terminate();
    
    app.session.world_state.timer_running = message_data.timer_running;

    if(app.session.world_state.timer_running)
    {
        worker = new Worker("/static/js/worker_timer.js");

        worker.onmessage = function (evt) {   
            app.send_message("continue_timer", {});
        };

        worker.postMessage(0);
    }
},

/**
 * stop local timer pulse 
 */
take_stop_timer_pulse: function take_stop_timer_pulse(){
    if(worker) worker.terminate();
},

/**reset experiment, remove all bids, asks and trades
*/
end_early: async function end_early(){
    if (!await show_confirm_dialog('End the experiment after this period completes?')) {
        return;
    }

    app.working = true;
    app.send_message("end_early", {});
},

/** take reset experiment response
 * @param message_data {json}
*/
take_end_early: function take_end_early(message_data){
   app.session.parameter_set.period_count = message_data.result;
},

/** send invitations
*/
send_send_invitations: function send_send_invitations(){

    app.send_message_modal_form.text = tinymce.get("id_invitation_text").getContent();

    if(app.send_message_modal_form.subject == "" || app.send_message_modal_form.subject == "")
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
take_send_invitations: function take_send_invitations(message_data){
    app.clear_main_form_errors();

    if(message_data.value == "success")
    {           
        app.email_result = "Result: " + message_data.result.email_result.mail_count.toString() + " messages sent.";

        app.session.invitation_subject = message_data.result.invitation_subject;
        app.session.invitation_text = message_data.result.invitation_text;
    } 
    else
    {
        app.email_result = message_data.result;
    } 
},

/** show edit subject modal
*/
show_send_invitations: function show_send_invitations(){

    app.cancel_modal=true;

    app.send_message_modal_form.subject = app.session.invitation_subject;
    app.send_message_modal_form.text = app.session.invitation_text;

    tinymce.get("id_invitation_text").setContent(app.send_message_modal_form.text);

    app.send_message_modal.toggle();
},

/** hide edit subject modal
*/
hide_send_invitations: function hide_send_invitations(){
    app.email_result = "";
},

/**
 * fill invitation with default values
 */
fill_default_invitation: function fill_default_invitation(){
    app.send_message_modal_form.text = app.email_default_text;
    app.send_message_modal_form.subject = app.email_default_subject;

    tinymce.get("id_invitation_text").setContent(app.email_default_text);
},

send_refresh_screens: async function send_refresh_screens(message_data){
    if (!await show_confirm_dialog('Refresh the client and server screens?')) {
        return;
    }

    app.working = true;
    app.send_message("refresh_screens", {});
},

take_refresh_screens: function take_refresh_screens(message_data){
    if(message_data.session != {})
    {           
        app.session = message_data.session;
    } 
    else
    {
       
    }
},