/**show edit parameter set group
 */
show_edit_parameter_set_group: function show_edit_parameter_set_group(index){
    
    if(app.session.started) return;
    if(app.working) return;

    app.clear_main_form_errors();
    app.current_parameter_set_group = Object.assign({}, app.parameter_set.parameter_set_groups[index]);
    
    app.edit_parameterset_group_modal.toggle();
},

/** update parameterset group
*/
send_update_parameter_set_group: function send_update_parameter_set_group(){
    
    app.working = true;

    app.send_message("update_parameter_set_group", {"session_id" : app.session.id,
                                                    "parameterset_group_id" : app.current_parameter_set_group.id,
                                                    "form_data" : app.current_parameter_set_group});
},

/** remove the selected parameterset group
*/
send_remove_parameter_set_group: function send_remove_parameter_set_group(){

    app.working = true;
    app.send_message("remove_parameterset_group", {"session_id" : app.session.id,
                                                   "parameterset_group_id" : app.current_parameter_set_group.id,});
                                                   
},

/** add a new parameterset group
*/
send_add_parameter_set_group: function send_add_parameter_set_group(group_id){
    app.working = true;
    app.send_message("add_parameterset_group", {"session_id" : app.session.id});
                                                   
},