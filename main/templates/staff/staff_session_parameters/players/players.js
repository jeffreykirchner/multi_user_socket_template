/**show edit parameter set player
 */
 show_edit_parameter_set_player:function(id){
    
    if(app.session.started) return;

    let parameter_set_players = app.session.parameter_set.parameter_set_players;

    index = -1;
    for(i=0;i<parameter_set_players.length;i++)
    {
        if(parameter_set_players[i].id == id)
        {
            index = i;
            break;
        }
    }
    
    app.clear_main_form_errors();
    app.cancel_modal=true;
    app.parameter_set_player_before_edit = Object.assign({}, app.session.parameter_set.parameter_set_players[index]);
    
    app.parameter_set_player_before_edit_index = index;
    app.current_parameter_set_player = app.session.parameter_set.parameter_set_players[index];
    

    app.edit_parameterset_player_modal.toggle();
},

/** hide edit parmeter set player
*/
hide_edit_parameter_set_player:function(){
    if(app.cancel_modal)
    {
        Object.assign(app.session.parameter_set.parameter_set_players[app.parameter_set_player_before_edit_index], app.parameter_set_player_before_edit);
       
        app.parameter_set_player_before_edit=null;
    }
},

/** update parameterset type settings
*/
send_update_parameter_set_player(){
    
    app.working = true;

    let parameter_set_players = app.session.parameter_set.parameter_set_players;

    index=-1;
    for(i=0;i<parameter_set_players.length;i++)
    {
        if(parameter_set_players[i].id == app.current_parameter_set_player.id)
        {
            index=i;
            break;
        }
    }

    form_data = {}    

    for(i=0;i<app.parameterset_player_form_ids.length;i++)
    {
        v = app.parameterset_player_form_ids[i];
        form_data[v] = parameter_set_players[index][v];
    }

    app.send_message("update_parameter_set_player", {"session_id" : app.session_id,
                                                     "paramterset_player_id" : app.current_parameter_set_player.id,
                                                     "form_data" : form_data});
},

/** handle result of updating parameter set player
*/
take_update_parameter_setPlayer(message_data){

    app.cancel_modal=false;
    app.clear_main_form_errors();

    if(message_data.status.value == "success")
    {
        app.take_get_session(message_data);       
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
    app.send_message("remove_parameterset_player", {"session_id" : app.session_id,
                                                    "paramterset_player_id" : app.current_parameter_set_player.id,});
                                                   
},

/** handle result of copying groups forward
*/
take_remove_parameter_set_player(message_data){
    app.cancel_modal=false;

    app.take_get_session(message_data);   
    app.edit_parameterset_player_modal.hide();
},

/** copy specified period's groups forward to future groups
*/
send_add_parameter_set_player(player_id){
    app.working = true;
    app.send_message("add_parameterset_player", {"session_id" : app.session_id});
                                                   
},

/** handle result of copying groups forward
*/
take_add_parameter_set_player(message_data){

    app.take_get_session(message_data); 
},
