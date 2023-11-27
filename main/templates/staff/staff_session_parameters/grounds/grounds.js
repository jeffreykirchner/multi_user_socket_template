/**show edit parameter set ground
 */
show_edit_parameter_set_ground: function show_edit_parameter_set_ground(index){
    
    if(app.session.started) return;
    if(app.working) return;

    app.clear_main_form_errors();
    app.current_parameter_set_ground = Object.assign({}, app.parameter_set.parameter_set_grounds[index]);
    
    app.edit_parameterset_ground_modal.toggle();
},

/** update parameterset ground
*/
send_update_parameter_set_ground: function send_update_parameter_set_ground(){
    
    app.working = true;

    app.send_message("update_parameter_set_ground", {"session_id" : app.session.id,
                                                     "parameterset_ground_id" : app.current_parameter_set_ground.id,
                                                     "form_data" : app.current_parameter_set_ground});
},

/** remove the selected parameterset ground
*/
send_remove_parameter_set_ground: function send_remove_parameter_set_ground(){

    app.working = true;
    app.send_message("remove_parameterset_ground", {"session_id" : app.session.id,
                                                    "parameterset_ground_id" : app.current_parameter_set_ground.id,});
                                                   
},

/** add a new parameterset ground
*/
send_add_parameter_set_ground: function send_add_parameter_set_ground(ground_id){
    app.working = true;
    app.send_message("add_parameterset_ground", {"session_id" : app.session.id});
                                                   
},