/**
 * process incoming message for the feed
 */
process_the_feed: function process_the_feed(message_type, message_data)
{
    if(message_data.status != "success") return;
    
    let html_text = "";
    let sender_label = "";
    let receiver_label = "";
    let group_label = "";

    switch(message_type) {                
        
        case "update_chat":

            sender_label = app.get_parameter_set_player_from_player_id(message_data.sender_id).id_label;
            let source_player_group_label = app.get_parameter_set_group_from_player_id(message_data.sender_id).name;
            receiver_label = "";

            for(let i in message_data.nearby_players) {
                if(receiver_label != "") receiver_label += ", ";
                group_label = app.get_parameter_set_group_from_player_id(message_data.nearby_players[i]).name;
                receiver_label += "<b>" + app.get_parameter_set_player_from_player_id(message_data.nearby_players[i]).id_label + "</b>(" + group_label + ")";
            }

            html_text = "<b>" + sender_label + "</b>(" + source_player_group_label + ") @ " + receiver_label + ": " +  message_data.text;

            break;
        case "update_interaction":
                sender_label = app.get_parameter_set_player_from_player_id(message_data.source_player_id).id_label;
                receiver_label = app.get_parameter_set_player_from_player_id(message_data.target_player_id).id_label;
    
                if(message_data.direction == "send")
                {
                    html_text = "<b>" + sender_label + "</b> sent " + parseInt(message_data.target_player_change) + " <img src='/static/"+  "cherry.png' height='20'> to <b>" + receiver_label + "</b>. ";
                }
                else if(message_data.direction == "take")
                {
                    html_text = "<b>" + sender_label + "</b> took " + parseInt(message_data.source_player_change) + " <img src='/static/"+  "cherry.png' height='20'> from <b>" + receiver_label + "</b>. ";
                }
    }

    if(html_text != "") {
        if(app.the_feed.length > 100) app.the_feed.pop();
        app.the_feed.unshift(html_text);
    }

},