/** send session update form   
*/
send_update_session(){
    app.cancel_modal = false;
    app.working = true;
    app.send_message("update_session",{"form_data" : {title:app.session.title}});
},

/** take update session reponse
 * @param message_data {json} result of update, either sucess or fail with errors
*/
take_update_session(message_data){
    app.clear_main_form_errors();

    if(message_data.status == "success")
    {
        app.take_get_session(message_data);       
        app.edit_session_modal.hide();    
    } 
    else
    {
        app.cancel_modal=true;                           
        app.display_errors(message_data.errors);
    } 
},

/** show edit session modal
*/
show_edit_session:function(){
    app.clear_main_form_errors();
    app.cancel_modal=true;
    app.session_before_edit = Object.assign({}, app.session);

    app.edit_session_modal.toggle();
},

/** hide edit session modal
*/
hide_edit_session:function(){
    if(app.cancel_modal)
    {
        Object.assign(app.session, app.session_before_edit);
        app.session_before_edit=null;
    }
},