sendName(){

    app.working = true;
    app.send_message("name", {"form_data" : {name : app.session_player.name, student_id : app.session_player.student_id}});
                     
},

/** take result of submitting name
*/
take_name(message_data){

    app.clear_main_form_errors();

    if(message_data.status.value == "success")
    {
        app.session_player.name = message_data.status.result.name; 
        app.session_player.student_id = message_data.status.result.student_id;           
        app.session_player.name_submitted = message_data.status.result.name_submitted;       
    } 
    else
    {
        app.display_errors(message_data.status.errors);
    }
},