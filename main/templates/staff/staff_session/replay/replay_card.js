/**
 * send request to load session events
 */
send_load_session_events()
{
    app.working = true;
    app.send_message("load_session_events", {});  
},

/**
 * take load session events
 */
take_load_session_events(message_data)
{
    if(message_data.value == "fail")
    {
        
    }
    else
    {
        app.session_events = message_data.session_events;

        app.replay_current_period = 1;
        app.replay_time_remaining = app.session.parameter_set.period_length;

        app.replay_load_world_state();
    }
},

/**
 * load world state for replay
 */
replay_load_world_state: function replay_load_world_state()
{
    let events = app.session_events[app.replay_current_period][app.replay_time_remaining];

    for(let i in events)
    {
        if(events[i].type == "world_state")
        { 
            app.session.world_state = JSON.parse(JSON.stringify(events[i].data));
           
            app.session.world_state["current_experiment_phase"] = "Done";

            app.destroy_setup_pixi_subjects();
            app.do_reload();  

            break;
        }
    }
},

/**
 * update the replay mode
 */
update_replay_mode: function update_replay_mode(new_replay_mode)
{
    app.replay_mode = new_replay_mode;

    if(app.replay_mode == "playing")
    {
        app.replay_mode_play();
    }
},

/**
 * replay mode play
 */
replay_mode_play: function replay_mode_play()
{
    if(app.replay_mode == "paused") return;

    app.process_replay_events();

    if(app.replay_time_remaining > 0)
    {
        app.replay_time_remaining--;
    }
    else if(app.replay_current_period == app.session.parameter_set.period_count)
    {
        //end of the session
        return;
    }
    else
    {
        app.replay_current_period++;

        app.replay_time_remaining = app.session.parameter_set.period_length;

        if(app.replay_current_period % app.session.parameter_set.break_frequency == 0)
        {
            app.replay_time_remaining += app.session.parameter_set.break_length;
        }
    }

    app.replay_timeout = setTimeout(app.replay_mode_play, 1000);
},

/**
 * reset replay mode
 */
reset_replay: function reset_replay()
{
    app.replay_mode = "paused";
    if (app.replay_timeout) clearTimeout(app.replay_timeout);

    app.replay_current_period = 1;
    app.replay_time_remaining = app.session.parameter_set.period_length;

    app.replay_load_world_state();
    app.the_feed = [];
    
},

/**
 * process replay events
 */
process_replay_events: function process_replay_events(update_current_location = false)
{
    let current_period = app.replay_current_period;
    let time_remaining = app.replay_time_remaining;

    for(let i in app.session_events[current_period][time_remaining])
    {   
        let event =  app.session_events[current_period][time_remaining][i];

        if(event.type == "target_location_update")
        {
            for(let i in event.data.target_locations)
            {
                app.session.world_state.session_players[i].target_location = JSON.parse(JSON.stringify(event.data.target_locations[i]));

                if(update_current_location)
                {
                    app.session.world_state.session_players[i].current_location = JSON.parse(JSON.stringify(event.data.current_locations[i]));
                }
            }
        }
        else
        {
            let data = {message:{message_data:JSON.parse(JSON.stringify(event.data)),
                                 message_type:"update_" + event.type},}
            app.take_message(data);
        }
        
    }

    app.session.world_state["current_experiment_phase"] = "Done";
    app.session.world_state["time_remaining"] = app.replay_time_remaining;
    app.session.world_state["current_period"] = app.replay_current_period;
},

/**
 * move avatars to their target location
 */
move_avatars_to_current_location: function move_avatars_to_current_location()
{
    let current_period = app.replay_current_period;
    let time_remaining = app.replay_time_remaining;

    let event = app.session_events[current_period][time_remaining].target_locations;

    for(let i in event.data.current_locations)
    {
        app.session.world_state.session_players[i].current_location = JSON.parse(JSON.stringify(event.data.current_locations[i]));
    }
    
},

/**
 * advance period
 */
advance_period: function advance_period(direction)
{
    if(direction == 1)
    {
        if(app.replay_current_period < app.session.parameter_set.period_count)
        {
            app.replay_current_period++;
        }
    }
    else
    {
        if(app.replay_current_period > 1)
        {
            app.replay_current_period--;
        }
    }

    app.replay_time_remaining = app.session.parameter_set.period_length;

    if(app.replay_current_period % app.session.parameter_set.break_frequency == 0)
    {
        app.replay_time_remaining += app.session.parameter_set.break_length;
    }

    app.process_replay_events(true);
},