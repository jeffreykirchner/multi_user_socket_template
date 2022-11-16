/**start the experiment
*/
start_experiment(){
    app.working = true;
    app.sendMessage("start_experiment", {});
},

/** take start experiment response
 * @param messageData {json}
*/
takeStartExperiment(messageData){
    app.takeGetSession(messageData);
},

/** update start status
*    @param messageData {json} session day in json format
*/
takeUpdateStartExperiment(messageData){
    app.takeGetSession(messageData);
},

/** update start status
*    @param messageData {json} session day in json format
*/
takeUpdateResetExperiment(messageData){
    app.takeGetSession(messageData);
},

/**reset experiment, remove all bids, asks and trades
*/
reset_experiment(){
    if (!confirm('Reset session? All activity will be removed.')) {
        return;
    }

    app.working = true;
    app.sendMessage("reset_experiment", {});
},

/** take reset experiment response
 * @param messageData {json}
*/
takeResetExperiment(messageData){
    app.chat_list_to_display=[];
    app.takeGetSession(messageData);
},

resetConnections(){
    if (!confirm('Reset connection status?.')) {
        return;
    }

    app.working = true;
    app.sendMessage("reset_connections", {});
},

/** update start status
*    @param messageData {json} session day in json format
*/
takeUpdateResetConnections(messageData){
    app.takeGetSession(messageData);
},

/** take reset experiment response
 * @param messageData {json}
*/
takeResetConnections(messageData){
    app.takeGetSession(messageData);
},

/**advance to next phase
*/
next_experiment_phase(){
   
    if (!confirm('Continue to the next phase of the experiment?')) {
        return;
    }    

    app.working = true;
    app.sendMessage("next_phase", {});
},

/** take next period response
 * @param messageData {json}
*/
takeNextPhase(messageData){
    
    app.session.current_experiment_phase = messageData.status.current_experiment_phase;
    app.updatePhaseButtonText();

},

/** take next period response
 * @param messageData {json}
*/
takeUpdateNextPhase(messageData){
    
    app.session.current_experiment_phase = messageData.status.current_experiment_phase;
    app.session.finished = messageData.status.finished;
    app.updatePhaseButtonText();
},

/**
 * start the period timer
*/
startTimer(){
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

    app.sendMessage("start_timer", {action : action});
},

/** take start experiment response
 * @param messageData {json}
*/
takeStartTimer(messageData){
    app.takeUpdateTime(messageData);
},

/**reset experiment, remove all bids, asks and trades
*/
endEarly(){
    if (!confirm('End the experiment after this period completes?')) {
        return;
    }

    app.working = true;
    app.sendMessage("end_early", {});
},

/** take reset experiment response
 * @param messageData {json}
*/
takeEndEarly(messageData){
   app.session.parameter_set.period_count = messageData.status.result;
},

/** send invitations
*/
sendSendInvitations(){

    app.sendMessageModalForm.text = tinymce.get("id_invitation_subject").getContent();

    if(app.sendMessageModalForm.subject == "" || app.sendMessageModalForm.text == "")
    {
        app.emailResult = "Error: Please enter a subject and email body.";
        return;
    }

    app.cancelModal = false;
    app.working = true;
    app.emailResult = "Sending ...";

    app.sendMessage("send_invitations",
                   {"formData" : app.sendMessageModalForm});
},

/** take update subject response
 * @param messageData {json} result of update, either sucess or fail with errors
*/
takeSendInvitations(messageData){
    app.clearMainFormErrors();

    if(messageData.status.value == "success")
    {           
        app.emailResult = "Result: " + messageData.status.result.email_result.mail_count.toString() + " messages sent.";

        app.session.invitation_subject = messageData.status.result.invitation_subject;
        app.session.invitation_text = messageData.status.result.invitation_text;
    } 
    else
    {
        app.emailResult = messageData.status.result;
    } 
},

/** show edit subject modal
*/
showSendInvitations(){

    app.cancelModal=true;

    app.sendMessageModalForm.subject = app.session.invitation_subject;
    app.sendMessageModalForm.text = app.session.invitation_text;

    tinymce.get("id_invitation_subject").setContent(app.sendMessageModalForm.text);

    app.sendMessageModal.toggle();
},

/** hide edit subject modal
*/
hideSendInvitations(){
    app.emailResult = "";
},

/**
 * fill invitation with default values
 */
fillDefaultInvitation(){
    app.sendMessageModalForm.subject = app.emailDefaultSubject;
    
    tinymce.get("id_invitation_subject").setContent(app.emailDefaultText);
},