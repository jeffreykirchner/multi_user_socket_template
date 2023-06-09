/**
 * send request to load session events
 */
send_load_session_events()
{
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
        app.session.world_state = message_data.world_state_initial;
        app.session.world_state["current_experiment_phase"] = "Done";
    }
},