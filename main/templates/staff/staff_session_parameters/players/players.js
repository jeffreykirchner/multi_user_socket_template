/**show edit parameter set player
 */
show_edit_parameter_set_player:function(index){
    
    if(app.session.started) return;
    if(app.working) return;

    app.clear_main_form_errors();
    app.current_parameter_set_player = Object.assign({}, app.parameter_set.parameter_set_players[index]);
    
    app.edit_parameterset_player_modal.toggle();
},

/** update parameterset type settings
*/
send_update_parameter_set_player(){
    
    app.working = true;

    app.send_message("update_parameter_set_player", {"session_id" : app.session.id,
                                                     "parameterset_player_id" : app.current_parameter_set_player.id,
                                                     "form_data" : app.current_parameter_set_player});
},

/** handle result of updating parameter set player
*/
take_update_parameter_setPlayer(message_data){

    app.cancel_modal=false;
    app.clear_main_form_errors();

    if(message_data.status.value == "success")
    {
        app.take_get_parameter_set(message_data);       
        app.edit_parameterset_player_modal.hide();        
    } 
    else
    {
        app.cancel_modal=true;                           
        app.display_errors(message_data.status.errors);
    } 
},

/** copy specified period's groups forward to future groups
*/
send_remove_parameter_set_player(){

    app.working = true;
    app.send_message("remove_parameterset_player", {"session_id" : app.session.id,
                                                    "parameterset_player_id" : app.current_parameter_set_player.id,});
                                                   
},

/** handle result of copying groups forward
*/
take_remove_parameter_set_player(message_data){
    app.cancel_modal=false;

    app.take_get_parameter_set(message_data);   
    app.edit_parameterset_player_modal.hide();
},

/** copy specified period's groups forward to future groups
*/
send_add_parameter_set_player(player_id){
    app.working = true;
    app.send_message("add_parameterset_player", {"session_id" : app.session.id});
                                                   
},

/** handle result of copying groups forward
*/
take_add_parameter_set_player(message_data){

    app.take_get_parameter_set(message_data); 
},
