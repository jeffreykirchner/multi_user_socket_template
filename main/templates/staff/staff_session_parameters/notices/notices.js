/**show edit parameter set notice
 */
show_edit_parameter_set_notice: function show_edit_parameter_set_notice(index){
    
    if(app.session.started) return;
    if(app.working) return;

    app.clear_main_form_errors();
    app.current_parameter_set_notice = Object.assign({}, app.parameter_set.parameter_set_notices[index]);
    
    app.edit_parameterset_notice_modal.toggle();
},

/** update parameterset notice
*/
send_update_parameter_set_notice: function send_update_parameter_set_notice(){
    
    app.working = true;

    app.send_message("update_parameter_set_notice", {"session_id" : app.session.id,
                                                    "parameterset_notice_id" : app.current_parameter_set_notice.id,
                                                    "form_data" : app.current_parameter_set_notice});
},

/** remove the selected parameterset notice
*/
send_remove_parameter_set_notice: function send_remove_parameter_set_notice(){

    app.working = true;
    app.send_message("remove_parameterset_notice", {"session_id" : app.session.id,
                                                   "parameterset_notice_id" : app.current_parameter_set_notice.id,});
                                                   
},

/** add a new parameterset notice
*/
send_add_parameter_set_notice: function send_add_parameter_set_notice(notice_id){
    app.working = true;
    app.send_message("add_parameterset_notice", {"session_id" : app.session.id});
                                                   
},