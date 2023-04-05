send_chat(){

    if(app.working) return;
    if(app.chat_text.trim() == "") return;
    if(app.chat_text.trim().length > 200) return;
    
    app.working = true;
    app.send_message("chat", {"recipients" : app.chat_recipients,
                             "text" : app.chat_text.trim(),
                            });

    app.chat_text="";                   
},

/** take result of moving goods
*/
take_chat(message_data){
    //app.cancel_modal=false;
    //app.clear_main_form_errors();

    if(message_data.value == "success")
    {
        app.take_update_chat(message_data);                        
    } 
    else
    {
        
    }
},

/** take updated data from goods being moved by another player
*    @param message_data {json} session day in json format
*/
take_update_chat(message_data){
    
    let chat = message_data.chat;
    let session_player = app.session_player;

    if(message_data.chat_type=="All")
    {
        if(session_player.chat_all.length >= 100)
            session_player.chat_all.shift();

        session_player.chat_all.push(chat);
        if(app.chat_recipients != "all")
        {
            session_player.new_chat_message = true;
        }
    }
    else
    {
        var sesson_player_target =  message_data.sesson_player_target;
        var session_players = app.session.session_players;

        var target = -1;
        if(sesson_player_target == session_player.id)
        {
            target = message_data.chat.sender_id;
        }
        else
        {
            target = sesson_player_target;
        }

        session_player = app.session.session_players[target];

        if(session_player)
        {
            if(session_player.chat_individual.length >= 100)
               session_player.chat_individual.shift();

            session_player.chat_individual.push(chat);

            if(session_player.id != app.chat_recipients)
            {
                session_player.new_chat_message = true;
            }
        }      
    }

    app.update_chat_display();
},

/** update who should receive chat
*    @param message_data {json} session day in json format
*/
update_chat_recipients(chat_recipients){
    app.chat_recipients = chat_recipients;
    

    app.update_chat_display();

    if(app.chat_recipients=="all")
    {
        app.session_player.new_chat_message = false;
        app.chat_button_label = "Everyone";
    }
    else
    {
        let session_player = app.session.session_players[chat_recipients];
        session_player.new_chat_message = false;
        app.chat_button_label =session_player.parameter_set_player.id_label;
    }
},

/** update chat displayed on the screen
 */
update_chat_display(){

    if(app.chat_recipients=="all")
    {
        app.chat_list_to_display=Array.from(app.session_player.chat_all);
    }
    else
    {
        app.chat_list_to_display=Array.from(app.session.session_players[app.chat_recipients].chat_individual);
    }
},

