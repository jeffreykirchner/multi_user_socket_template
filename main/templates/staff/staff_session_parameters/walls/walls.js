/**show edit parameter set wall
 */
show_edit_parameter_set_wall: function show_edit_parameter_set_wall(index){
    
    if(app.session.started) return;
    if(app.working) return;

    app.clear_main_form_errors();
    app.current_parameter_set_wall = Object.assign({}, app.parameter_set.parameter_set_walls[index]);
    
    app.edit_parameterset_wall_modal.toggle();
},

/** update parameterset wall
*/
send_update_parameter_set_wall: function send_update_parameter_set_wall(){
    
    app.working = true;

    app.send_message("update_parameter_set_wall", {"session_id" : app.session.id,
                                                     "parameterset_wall_id" : app.current_parameter_set_wall.id,
                                                     "form_data" : app.current_parameter_set_wall});
},

/** remove the selected parameterset wall
*/
send_remove_parameter_set_wall: function send_remove_parameter_set_wall(){

    app.working = true;
    app.send_message("remove_parameterset_wall", {"session_id" : app.session.id,
                                                    "parameterset_wall_id" : app.current_parameter_set_wall.id,});
                                                   
},

/** add a new parameterset wall
*/
send_add_parameter_set_wall: function send_add_parameter_set_wall(wall_id){
    app.working = true;
    app.send_message("add_parameterset_wall", {"session_id" : app.session.id});
                                                   
},