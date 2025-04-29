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
 *pointer click on subject screen
*/
subject_pointer_click: function subject_pointer_click(event)
{
    if(!app.session.world_state.hasOwnProperty('started')) return;
    let local_pos = event.data.getLocalPosition(event.currentTarget);
    let local_player = app.session.world_state.session_players[app.session_player.id];

    if(event.data.detail > 1 && 
       local_player.cool_down == 0)
    {
        app.subject_pointer_right_click(event);
        return;
    }

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

    //can't move ontop of other players
    for(let i in app.session.world_state.session_players)
    {
        let obj = app.session.world_state.session_players[i];
    
        if(obj.id == app.session_player.id) continue;

        if(app.get_distance(obj.current_location, local_pos) < 100)
        {            
            return;
        }
    }
    
    local_player.target_location.x = local_pos.x;
    local_player.target_location.y = local_pos.y;

    app.target_location_update();

},

/**
 * subect_pointer_tap
 */
subject_pointer_tap: function subject_pointer_tap(event)
{
    let local_player = app.session.world_state.session_players[app.session_player.id];

    if(Date.now() - app.last_subject_pointer_tap > 200)
    {
        app.subject_pointer_click(event);
    }
    else if (local_player.cool_down == 0)
    {
        app.subject_pointer_right_click(event);
    }   

    app.last_subject_pointer_tap = Date.now();
},

/**
 * pointer right click on subject screen
 */
subject_pointer_right_click: function subject_pointer_right_click(event)
{
    if(!app.session.world_state.hasOwnProperty('started')) return;
    let local_pos = event.data.getLocalPosition(event.currentTarget);
    let local_player = app.session.world_state.session_players[app.session_player.id];

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
    
    for(let i in app.session.world_state.session_players)
    {
        let obj = app.session.world_state.session_players[i];

        if(app.get_distance(obj.current_location, local_pos) < 100 &&
            app.get_distance(obj.current_location, local_player.current_location) <= app.session.parameter_set.interaction_range+125)
        {

            if(app.session.world_state.time_remaining > app.session.parameter_set.period_length &&
                app.session.world_state.current_period % app.session.parameter_set.break_frequency == 0)
            {
                app.add_text_emitters("No interactions while on break.", 
                                        obj.current_location.x, 
                                        obj.current_location.y,
                                        obj.current_location.x,
                                        obj.current_location.y-100,
                                        0xFFFFFF,
                                        28,
                                        null);
                return;
            }

            app.subject_avatar_click(i);              
            break;
        }
    }
},

/**
 * update the amount of shift needed to center the player
 */
update_offsets_player: function update_offsets_player(delta)
{
    let offset = app.get_offset();

    pixi_container_main.x = -offset.x;
    pixi_container_main.y = -offset.y;   
    
    let obj = app.session.world_state.session_players[app.session_player.id];

    pixi_target.x = obj.target_location.x;
    pixi_target.y = obj.target_location.y;
},

/**
 * take rescue subject
 */
take_rescue_subject: function take_rescue_subject(message_data)
{
    let session_player = app.session.world_state.session_players[message_data.player_id];

    session_player.current_location = message_data.new_location; 
    session_player.target_location.x = message_data.new_location.x+1;
    session_player.target_location.y = message_data.new_location.y+1;

    if(message_data.player_id==app.session_player.id)
    {
       app.working = false;
    }
},