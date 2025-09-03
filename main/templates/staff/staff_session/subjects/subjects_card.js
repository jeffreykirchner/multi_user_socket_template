 /**
 * take update player groups
 * @param message_data {json} session day in json format
 */
 take_update_connection_status: function take_update_connection_status(message_data){
            
    if(message_data.value == "success")
    {
        let result = message_data.result;
        let session_players = app.session.session_players;

        let session_player = app.session.session_players[result.id];

        if(session_player)
        {
            session_player.connected_count = result.connected_count;
            session_player.name = result.name;
            session_player.student_id = result.student_id;
            session_player.current_instruction = result.current_instruction;
            session_player.instructions_finished = result.instructions_finished;
            session_player.survey_complete = result.survey_complete;
        }
    }
},

/** take name and student id
* @param message_data {json} session day in json format
*/
take_update_name: function take_update_name(message_data){
           
    if(message_data.value == "success")
    {
        let result = message_data.result;
        let session_player = app.session.session_players[result.id];

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
take_next_instruction: function take_next_instruction(message_data){
           
    if(message_data.value == "success")
    {
        let result = message_data.result;

        let session_player = app.session.session_players[result.id];

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
take_finished_instructions: function take_finished_instructions(message_data){
           
    if(message_data.value == "success")
    {
        let result = message_data.result;

        let session_player = app.session.session_players[result.id];

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
 take_update_earnings: function take_update_earnings(earnings){

    for(let i in earnings)
    {
        app.session.world_state.session_players[i].earnings = earnings[i].total_earnings;
    }
    
 },

/** send list of subjects emails to server
*/
send_email_list: function send_email_list(){
    app.cancel_modal = false;
    app.working = true;

    app.send_message("email_list",
                    {"csv_data" : app.csv_email_list});
},

/** take update subject response
 * @param message_data {json} result of update, either sucess or fail with errors
*/
take_update_email_list: function take_update_email_list(message_data){
    app.clear_main_form_errors();

    if(message_data.value == "success")
    {            
        app.upload_email_modal.hide(); 
        app.session = message_data.result.session;
        app.email_list_error = "";
    } 
    else
    {
        app.email_list_error = message_data.result;
    } 
},

/** show edit subject modal
*/
show_send_email_list: function show_send_email_list(){
    app.clear_main_form_errors();
    app.cancel_modal=true;

    app.email_list_error = "";

    app.csv_email_list = "";

    app.upload_email_modal.toggle();
},

/** hide edit subject modal
*/
hide_send_email_list: function hide_send_email_list(){
    app.csv_email_list = "";

    if(app.cancel_modal)
    {      
       
    }
},

/** send session update form   
*/
send_update_subject: function send_update_subject(){
    app.cancel_modal = false;
    app.working = true;
    app.send_message("update_subject",
                    {"form_data" : app.staff_edit_name_etc_form});
},

/** take update subject response
 * @param message_data {json} result of update, either sucess or fail with errors
*/
take_update_subject: function take_update_subject(message_data){
    app.clear_main_form_errors();

    if(message_data.value == "success")
    {            
        app.edit_subject_modal.hide();    

        let session_player = app.session.session_players[message_data.session_player.id];

        if(session_player)
        {
            session_player.name = message_data.session_player.name;
            session_player.student_id = message_data.session_player.student_id;
            session_player.email = message_data.session_player.email;
        }
    } 
    else
    {
        app.cancel_modal=true;                           
        app.display_errors(message_data.errors);
    } 
},

/** show edit subject modal
*/
show_edit_subject: function show_edit_subject(id){

    if(!app.session.started) return;

    app.clear_main_form_errors();
    app.cancel_modal=true;

    app.staff_edit_name_etc_form.id = id;

    let session_player = app.session.session_players[id];

    if(session_player)
    {
        app.staff_edit_name_etc_form.name = session_player.name;
        app.staff_edit_name_etc_form.student_id = session_player.student_id;
        app.staff_edit_name_etc_form.email = session_player.email;
    }

    app.edit_subject_modal.toggle();
},

/** hide edit subject modal
*/
hide_edit_subject: function hide_edit_subject(){
    if(app.cancel_modal)
    {
       
       
    }
},

/**
 * copy earnings to clipboard
 */
copy_earnings: function copy_earnings()
{

    let text="";
 
    for(let i=0;i<app.session.session_players_order.length;i++)
    {
       let session_player = app.session.session_players[app.session.session_players_order[i]];

       text += session_player.student_id + ",";
       text += app.get_earnings_display(app.session.world_state.session_players[session_player.id].earnings);

       if(i<app.session.session_players_order.length-1) text += "\r\n";
    }

    app.copy_to_clipboard(text);
    app.earnings_copied = true;
},
 
 //copy text to clipboard
 copy_to_clipboard: function copy_to_clipboard(text)
 {
 
     // Create a dummy input to copy the string array inside it
     let dummy = document.createElement("textarea");
 
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
send_anonymize_data: async function send_anonymize_data(){

    if (!await show_confirm_dialog('Anonymize data? Identifying information will be permanent removed.')) {
        return;
    }

    app.working = true;
    app.send_message("anonymize_data",{});
},

/** take anonymize data result for server
 * @param message_data {json} result of update, either sucess or fail with errors
*/
take_anonymize_data: function take_anonymize_data(message_data){
    app.clear_main_form_errors();

    if(message_data.value == "success")
    {            

        let session_player_updates = message_data.result;
        let session_players = app.session.session_players;

        for(let i=0; i<session_player_updates.length; i++)
        {
            let session_player = app.session.session_players[session_player_updates[i].id];

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
take_update_survey_complete: function take_update_survey_complete(message_data){
    let result = message_data;

    let session_player = app.session.session_players[result.player_id];
    session_player.survey_complete = true;
},

/**
 * rescue subject if stuck
 */
send_rescue_subject: async function send_rescue_subject()
{
    if (!await show_confirm_dialog('Return subject to their starting location?')) {
        return;
    }

    let player_id = app.staff_edit_name_etc_form.id;

    app.send_message("rescue_subject", {player_id:player_id});
},

/**
 * take rescue subject
 */
take_rescue_subject: function take_rescue_subject(message_data)
{
    let session_player = app.session.world_state.session_players[message_data.player_id];

    session_player.current_location = message_data.new_location; 
    session_player.target_location.x = message_data.new_location.x+1;
    session_player.target_location.y = message_data.new_location.y+1;

    app.edit_subject_modal.hide();
},

/**
 * get average subject earnings
 */
get_average_earnings: function get_average_earnings()
{
    let total_earnings = 0;
    let count = 0;

    for(let i in app.session.world_state.session_players)
    {
        total_earnings += parseFloat(app.session.world_state.session_players[i].earnings);
        count++;
    }

    let v = Math.ceil(total_earnings/count)/100

    if (isNaN(v)) {
        return "---";
    }
    
    return "$" + v.toFixed(2);
},

/**
 * get earnings display
 */
get_earnings_display: function get_earnings_display(earnings)
{
    // $[[(Math.ceil(Number(session.world_state.session_players[p].earnings))/100).toFixed(2)]]

    let v = (Math.ceil(Number( Math.abs(earnings)))/100).toFixed(2);
    
    if(earnings < 0)
    {
        return "-$" + v;
    }
    else
    {
        return "$" + v;
    }
},  