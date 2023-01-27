 /**
 * take update player groups
 * @param message_data {json} session day in json format
 */
  take_update_connection_status(message_data){
            
    if(message_data.status.value == "success")
    {
        let result = message_data.status.result;
        let session_players = app.session.session_players;

        session_player = app.find_session_player(result.id);

        if(session_player)
        {
            session_player.connected_count = result.connected_count;
        }
    }
},

/** take name and student id
* @param message_data {json} session day in json format
*/
take_update_name(message_data){
           
    if(message_data.status.value == "success")
    {
        let result = message_data.status.result;

        session_player = app.find_session_player(result.id);

        if(session_player)
        {
            session_player.name = result.name;
            session_player.student_id = result.student_id;
        }       
    }
 },

/** take name and student id
* @param message_data {json} session day in json format
*/
take_next_instruction(message_data){
           
    if(message_data.status.value == "success")
    {
        let result = message_data.status.result;

        session_player = app.find_session_player(result.id);

        if(session_player)
        {
            session_player.current_instruction = result.current_instruction;
            session_player.current_instruction_complete = result.current_instruction_complete;
        }       
    }
 },

 /** take name and student id
* @param message_data {json} session day in json format
*/
take_finished_instructions(message_data){
           
    if(message_data.status.value == "success")
    {
        let result = message_data.status.result;

        session_player = app.find_session_player(result.id);

        if(session_player)
        {
            session_player.instructions_finished = result.instructions_finished;
            session_player.current_instruction_complete = result.current_instruction_complete;
        }       
    }
 },

 /**
  * update subject earnings
  *  @param message_data {json} session day in json format
  */
 take_update_earnings(message_data){

    if(message_data.status.value == "success")
    {
        let session_player_earnings = message_data.status.result.session_player_earnings;
        let session_players = app.session.session_players;

        for(let i=0; i<session_player_earnings.length; i++)
        {
            session_player = app.find_session_player(session_player_earnings[i].id);

            if(session_player)
            {
                session_player.earnings = session_player_earnings[i].earnings;
            }
        }
    }
 },

 /**
  * return session player that has specified id
  */
 find_session_player(id){

    let session_players = app.session.session_players;
    for(let i=0; i<session_players.length; i++)
    {
        if(session_players[i].id == id)
        {
            return session_players[i];
        }
    }

    return null;
 },

/**
 * return session player index that has specified id
 */
find_session_player_index(id){

    let session_players = app.session.session_players;
    for(let i=0; i<session_players.length; i++)
    {
        if(session_players[i].id == id)
        {
            return i;
        }
    }

    return null;
},

/** send session update form   
*/
send_email_list(){
    app.cancel_modal = false;
    app.working = true;

    app.send_message("email_list",
                    {"csv_data" : app.csv_email_list});
},

/** take update subject response
 * @param message_data {json} result of update, either sucess or fail with errors
*/
take_update_email_list(message_data){
    app.clear_main_form_errors();

    if(message_data.status.value == "success")
    {            
        app.upload_email_modal.hide(); 
        app.session = message_data.status.result.session;
        app.email_list_error = "";
    } 
    else
    {
        app.email_list_error = message_data.status.result;
    } 
},

/** show edit subject modal
*/
show_send_email_list(){
    app.clear_main_form_errors();
    app.cancel_modal=true;

    app.email_list_error = "";

    app.csv_email_list = "";

    app.upload_email_modal.toggle();
},

/** hide edit subject modal
*/
hide_send_email_list(){
    app.csv_email_list = "";

    if(app.cancel_modal)
    {      
       
    }
},

/** send session update form   
*/
send_update_subject(){
    app.cancel_modal = false;
    app.working = true;
    app.send_message("update_subject",
                    {"form_data" : app.staff_edit_name_etc_form});
},

/** take update subject response
 * @param message_data {json} result of update, either sucess or fail with errors
*/
take_update_subject(message_data){
    app.clear_main_form_errors();

    if(message_data.status.value == "success")
    {            
        app.edit_subject_modal.hide();    

        let session_player = app.find_session_player(message_data.status.session_player.id);
        session_player.name = message_data.status.session_player.name;
        session_player.student_id = message_data.status.session_player.student_id;
        session_player.email = message_data.status.session_player.email;
    } 
    else
    {
        app.cancel_modal=true;                           
        app.display_errors(message_data.status.errors);
    } 
},

/** show edit subject modal
*/
show_edit_subject:function(id){
    app.clear_main_form_errors();
    app.cancel_modal=true;

    app.staff_edit_name_etc_form.id = id;

    let session_player = app.find_session_player(id);

    app.staff_edit_name_etc_form.name = session_player.name;
    app.staff_edit_name_etc_form.student_id = session_player.student_id;
    app.staff_edit_name_etc_form.email = session_player.email;

    app.edit_subject_modal.toggle();
},

/** hide edit subject modal
*/
hide_edit_subject:function(){
    if(app.cancel_modal)
    {
       
       
    }
},

/**
 * copy earnings to clipboard
 */
 copy_earnings(){

    var text="";
 
     for(i=0;i<app.session.session_players.length;i++)
     {
         text += app.session.session_players[i].student_id + ",";
         text += app.session.session_players[i].earnings;
 
         if(i<app.session.session_players.length-1) text += "\r\n";
     }
 
    app.copy_to_clipboard(text);
    app.earnings_copied = true;
 },
 
 //copy text to clipboard
 copy_to_clipboard(text){
 
     // Create a dummy input to copy the string array inside it
     var dummy = document.createElement("textarea");
 
     // Add it to the document
     document.body.appendChild(dummy);
 
     // Set its ID
     dummy.setAttribute("id", "dummy_id");
 
     // Output the array into it
     document.getElementById("dummy_id").value=text;
 
     // Select it
     dummy.select();
     dummy.setSelectionRange(0, 99999); /*For mobile devices*/
 
     // Copy its contents
     document.execCommand("copy");
 
     // Remove it as its not needed anymore
     document.body.removeChild(dummy);
 
     /* Copy the text inside the text field */
     document.execCommand("copy");
 },

 /** send request to anonymize the data
*/
send_anonymize_data(){
    
    if (!confirm('Anonymize data? Identifying information will be permanent removed.')) {
        return;
    }

    app.working = true;
    app.send_message("anonymize_data",{});
},

/** take anonymize data result for server
 * @param message_data {json} result of update, either sucess or fail with errors
*/
take_anonymize_data(message_data){
    app.clear_main_form_errors();

    if(message_data.status.value == "success")
    {            

        let session_player_updates = message_data.status.result;
        let session_players = app.session.session_players;

        for(let i=0; i<session_player_updates.length; i++)
        {
            session_player = app.find_session_player(session_player_updates[i].id);

            if(session_player)
            {
                session_player.email = session_player_updates[i].email;
                session_player.name = session_player_updates[i].name;
                session_player.student_id = session_player_updates[i].student_id;
            }
        }
    
    } 
},

/** take survey completed by subject
 * @param message_data {json} result of update, either sucess or fail with errors
*/
take_update_survey_complete(message_data){
    result = message_data.status;

    session_player = app.find_session_player(result.player_id);
    session_player.survey_complete = true;
},