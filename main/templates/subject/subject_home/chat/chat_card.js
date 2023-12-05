send_chat: function send_chat(){

    if(app.working) return;
    if(app.chat_text.trim() == "") return;
    if(app.chat_text.trim().length > 200) return;
    
    if(app.session.world_state.current_experiment_phase == 'Instructions')
    {
        
    }
    else
    {
        app.working = true;
        app.send_message("chat", 
                        {"text" : app.chat_text.trim(),
                        "current_location" : app.session.world_state.session_players[app.session_player.id].current_location,},
                        "group");
    }
    
    app.chat_text = "";       
                   
},

/** take updated data from goods being moved by another player
*    @param message_data {json} session day in json format
*/
take_update_chat: function take_update_chat(message_data){
    
    if(message_data.status == "success")
    {
        let text = message_data.text;

        app.session.world_state.session_players[message_data.sender_id].show_chat = true;    
        app.session.world_state.session_players[message_data.sender_id].chat_time = Date.now();
        pixi_avatars[message_data.sender_id].chat.bubble_text.text = text;

        if(message_data.sender_id == app.session_player.id)
        {
            app.working = false;
        }
    }
    else
    {
        if(app.is_subject && message_data.sender_id == app.session_player.id)
        {
            app.working = false;
        }
    }

},

