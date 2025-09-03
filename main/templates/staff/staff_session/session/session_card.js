/** send session update form   
*/
send_update_session: function send_update_session(){
    app.cancel_modal = false;
    app.working = true;
    app.send_message("update_session",{"form_data" : {title:app.session.title}});
},

/** take update session reponse
 * @param message_data {json} result of update, either sucess or fail with errors
*/
take_update_session: function take_update_session(message_data){
    app.clear_main_form_errors();

    if(message_data.status == "success")
    {
        app.take_get_session(message_data.result);       
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
show_edit_session: function show_edit_session(){
    app.clear_main_form_errors();
    app.cancel_modal=true;
    app.session_before_edit = Object.assign({}, app.session);

    app.edit_session_modal.toggle();
},

/** hide edit session modal
*/
hide_edit_session:function hide_edit_session(){
    if(app.cancel_modal)
    {
        Object.assign(app.session, app.session_before_edit);
        app.session_before_edit=null;
    }
},

/** send session update form   
*/
send_add_collaborators: function send_add_collaborators(){
    app.cancel_modal = false;
    app.working = true;

    app.send_message("add_collaborators",
                    {"csv_data" : app.csv_collaborators_list});
},

/**
 * take add collaborators response
 */
take_add_collaborators: function take_add_collaborators(message_data){
    app.clear_main_form_errors();

    if(message_data.status == "success")
    {
        app.upload_collaborators_modal.hide(); 
        app.session.collaborators = message_data.collaborators;
        app.session.collaborators_order = message_data.collaborators_order;
        app.collaborators_list_error = "";
    } 
    else
    {
        app.collaborators_list_error = message_data.error_message;
    }
},

/**
 * remove collaborator from session
 */
send_remove_collaborator: async function send_remove_collaborator(collaborator_id){
    if (!await show_confirm_dialog('Remove collaborator from the session?')) {
        return;
    }

    app.send_message("remove_collaborator",{"collaborator_id" : collaborator_id});
},

/** show edit subject modal
*/
show_upload_collaborators_list_modal : function show_upload_collaborators_list_modal (){
    app.clear_main_form_errors();
    app.cancel_modal=true;

    app.email_list_error = "";

    app.collaborators_list_error = "";

    app.upload_collaborators_modal.toggle();
},

/** hide edit subject modal
*/
hide_send_collaborators_list: function hide_send_collaborators_list(){
    app.csv_collaborators_list = "";

    if(app.cancel_modal)
    {      
       
    }
},

/**
 * send lock session
 */
send_lock_session: function send_lock_session(){
    app.cancel_modal = false;
    app.working = true;

    app.send_message("lock_session",{"session_id" : app.session.id});
},

/**
 * take lock session response
 */
take_lock_session: function take_lock_session(message_data){
    app.working=false;
    if(message_data.status == "success")
    {
        app.edit_session_modal.hide();
        app.session.locked = message_data.locked;
    }
},