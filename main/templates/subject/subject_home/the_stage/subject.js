/**
 * subject screen offset from the origin
 */
get_offset:function get_offset()
{
    let obj = app.session.world_state.session_players[app.session_player.id];

    return {x:obj.current_location.x * app.pixi_scale - pixi_app.screen.width/2,
            y:obj.current_location.y * app.pixi_scale - pixi_app.screen.height/2};
},

/**
 *pointer up on subject screen
 */
 subject_pointer_up: function subject_pointer_up(event)
{
    if(!app.session.world_state.hasOwnProperty('started')) return;
    let local_pos = event.data.getLocalPosition(event.currentTarget);
    let local_player = app.session.world_state.session_players[app.session_player.id];

    if(event.button == 0)
    {

        if(local_player.frozen)
        {
            app.add_text_emitters("No movement while interacting.", 
                            local_player.current_location.x, 
                            local_player.current_location.y,
                            local_player.current_location.x,
                            local_player.current_location.y-100,
                            0xFFFFFF,
                            28,
                            null);
            return;
        }
        
        local_player.target_location.x = local_pos.x;
        local_player.target_location.y = local_pos.y;

        app.target_location_update();
    }
    else if(event.button == 2)
    {
        if(local_player.frozen)
        {
            app.add_text_emitters("No actions while interacting.", 
                            local_player.current_location.x, 
                            local_player.current_location.y,
                            local_player.current_location.x,
                            local_player.current_location.y-100,
                            0xFFFFFF,
                            28,
                            null);
            return;
        }

        if(local_player.cool_down > 0)
        {
            app.add_text_emitters("No actions cooling down.", 
                            local_player.current_location.x, 
                            local_player.current_location.y,
                            local_player.current_location.x,
                            local_player.current_location.y-100,
                            0xFFFFFF,
                            28,
                            null);
            return;
        }
        
        for(i in app.session.world_state.session_players)
        {
            let obj = app.session.world_state.session_players[i];

            if(app.get_distance(obj.current_location, local_pos) < 100 &&
               app.get_distance(obj.current_location, local_player.current_location) <= app.session.parameter_set.interaction_range+125)
            {
                app.subject_avatar_click(i);              
                break;
            }
        }
    }
},

/**
 * update the amount of shift needed to center the player
 */
update_offsets_player: function update_offsets_player(delta)
{
    offset = app.get_offset();

    pixi_container_main.x = -offset.x;
    pixi_container_main.y = -offset.y;   
    
    obj = app.session.world_state.session_players[app.session_player.id];

    pixi_target.x = obj.target_location.x;
    pixi_target.y = obj.target_location.y;
},