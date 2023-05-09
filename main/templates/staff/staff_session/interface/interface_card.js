/**
 * take update from client for new location target
 */
take_target_location_update(message_data)
{
    if(message_data.value == "success")
    {
        app.session.world_state.session_players[message_data.session_player_id].target_location = message_data.target_location;        
        app.send_world_state_update()         
    } 
    else
    {
        
    }
},

/**
 * send an update to the server to store the current world state
 */
send_world_state_update(){
    if(app.last_world_state_update == null) 
    {
        app.last_world_state_update = Date.now();
        return;
    }

    if(Date.now() - app.last_world_state_update < 1000) return;

    let temp_world_state = {"session_players":{}}

    for(i in app.session.world_state.session_players)
    {
        temp_world_state["session_players"][i] = {"current_location" : app.session.world_state.session_players[i].current_location};
    }

    app.last_world_state_update = Date.now();
    app.send_message("world_state_update", {"world_state" : temp_world_state});       
},


take_update_collect_token(message_data){

    if(message_data.period_id != app.session.session_periods_order[app.session.current_period-1]) return;

    let token = app.session.world_state.tokens[message_data.period_id][message_data.token_id];

    try{
        token.token_container.getChildAt(0).stop();
        token.token_container.getChildAt(0).alpha = 0.25;
        token.token_graphic.visible = false;
    } catch (error) {

    }

    token.status = message_data.player_id;

    let session_player = app.session.world_state.session_players[message_data.player_id];

    session_player.inventory[message_data.period_id] = message_data.inventory;
    session_player.pixi.avatar_container.getChildAt(4).text = message_data.inventory;

    let token_graphic = new PIXI.AnimatedSprite(app.pixi_textures.cherry_token.animations['walk']);
    token_graphic.animationSpeed = app.animation_speed;
    token_graphic.anchor.set(1, 0.5)
    token_graphic.eventMode = 'none';
    token_graphic.scale.set(0.4);
    token_graphic.alpha = 0.7;

    app.add_text_emitters("+1", 
                          session_player.current_location.x, 
                          session_player.current_location.y,
                          session_player.current_location.x,
                          session_player.current_location.y-100,
                          0xFFFFFF,
                          28,
                          token_graphic)
},

update_player_inventory(){

    let period_id = app.session.session_periods_order[app.session.current_period];

    for(const i in app.session.session_players_order)
    {
        const player_id = app.session.session_players_order[i];
        let session_player = app.session.world_state.session_players[player_id];
        session_player.pixi.avatar_container.getChildAt(4).text = app.session.world_state.session_players[player_id].inventory[period_id];
    }
},

take_update_tractor_beam(message_data){
    let player_id = message_data.player_id;
    let target_player_id = message_data.target_player_id;

    app.session.world_state.session_players[player_id].tractor_beam_target = target_player_id;

    app.session.world_state.session_players[player_id].frozen = true
    app.session.world_state.session_players[target_player_id].frozen = true

    app.session.world_state.session_players[player_id].interaction = app.session.parameter_set.interaction_length;
    app.session.world_state.session_players[target_player_id].interaction = app.session.parameter_set.interaction_length;
},

take_update_transfer_tokens(message_data){

},