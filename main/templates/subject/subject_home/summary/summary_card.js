send_name: function send_name(){

    app.working = true;
    app.send_message("name", {"form_data" : {name : app.session_player.name, student_id : app.session_player.student_id}});
                     
},

/** take result of submitting name
*/
take_name: function take_name(message_data){

    app.clear_main_form_errors();
    app.working = false;

    if(message_data.value == "success")
    {
        app.session_player.name = message_data.result.name; 
        app.session_player.student_id = message_data.result.student_id;           
        app.session_player.name_submitted = message_data.result.name_submitted;       
    } 
    else
    {
        app.display_errors(message_data.errors);
    }
},

/**
 * after session link
 */
post_session_link: function post_session_link(){

    if(app.session.parameter_set.survey_required && 
       app.session_player.survey_complete == false)
    {
        location.href = app.session_player.survey_link;
    }
    else if(app.session.parameter_set.prolific_mode)
    {
        location.href = app.session.parameter_set.prolific_completion_link;
    }

},