sendChat(){

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

    if(message_data.status.value == "success")
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
    
    let result = message_data.status;
    let chat = result.chat;
    let session_player = app.session_player;

    if(result.chat_type=="All")
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
        var sesson_player_target =  result.sesson_player_target;
        var session_players = app.session.session_players;

        var target = -1;
        if(sesson_player_target == session_player.id)
        {
            target = result.chat.sender_id;
        }
        else
        {
            target = sesson_player_target;
        }

        session_player = app.find_session_player(target);
        session_player_index = app.find_session_player_index(target);

        if(session_player)
        {
            if(session_player.chat_individual.length >= 100)
               session_player.chat_individual.shift();

            session_player.chat_individual.push(chat);

            if(session_player_index != app.chat_recipients_index)
            {
                session_player.new_chat_message = true;
            }
        }

        // for(let i=0; i<session_players.length; i++)
        // {
        //     if(session_players[i].id == target)
        //     {
                
                
        //         break;
        //     }
        // }        
    }

    app.update_chat_display();
},

/** update who should receive chat
*    @param message_data {json} session day in json format
*/
update_chat_recipients(chat_recipients, chat_button_label, chat_recipients_index){
    app.chat_recipients = chat_recipients;
    app.chat_button_label = chat_button_label;
    app.chat_recipients_index = chat_recipients_index;

    app.update_chat_display();

    if(app.chat_recipients=="all")
    {
        app.session_player.new_chat_message = false;
    }
    else
    {
        app.session.session_players[chat_recipients_index].new_chat_message = false;
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
        app.chat_list_to_display=Array.from(app.session.session_players[app.chat_recipients_index].chat_individual);
    }
},

