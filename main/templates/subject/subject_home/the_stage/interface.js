target_location_update(){
    app.send_message("target_location_update", 
                    {"target_location" : app.session.world_state.session_players[app.session_player.id].target_location},
                    "self");                   
},

take_target_location_update(message_data){
    if(message_data.value == "success")
    {
        app.session.world_state.session_players[message_data.session_player_id].target_location = message_data.target_location;                 
    } 
    else
    {
        
    }
},

take_update_collect_token(message_data){

    let token = app.session.world_state.tokens[message_data.period_id][message_data.token_id];

    token.token_container.getChildAt(0).stop();
    token.token_container.getChildAt(0).alpha = 0.25;
    token.token_graphic.visible = false;

    token.status = message_data.player_id;


},
