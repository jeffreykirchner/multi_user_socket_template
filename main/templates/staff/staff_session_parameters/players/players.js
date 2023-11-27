/**show edit parameter set player
 */
show_edit_parameter_set_player:function show_edit_parameter_set_player(index){
    
    if(app.session.started) return;
    if(app.working) return;

    app.clear_main_form_errors();
    app.current_parameter_set_player = Object.assign({}, app.parameter_set.parameter_set_players[index]);
    
    app.edit_parameterset_player_modal.toggle();
},

/** update parameterset player
*/
send_update_parameter_set_player: function send_update_parameter_set_player(){
    
    app.working = true;

    app.send_message("update_parameter_set_player", {"session_id" : app.session.id,
                                                     "parameterset_player_id" : app.current_parameter_set_player.id,
                                                     "form_data" : app.current_parameter_set_player});
},

/** remove the selected parameterset player
*/
send_remove_parameter_set_player: function send_remove_parameter_set_player(){

    app.working = true;
    app.send_message("remove_parameterset_player", {"session_id" : app.session.id,
                                                    "parameterset_player_id" : app.current_parameter_set_player.id,});
                                                   
},

/** add a new parameterset player
*/
send_add_parameter_set_player: function send_add_parameter_set_player(player_id){
    app.working = true;
    app.send_message("add_parameterset_player", {"session_id" : app.session.id});
                                                   
},