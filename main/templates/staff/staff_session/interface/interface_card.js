/**
 * take update from client for new location target
 */
// take_target_location_update: function take_target_location_update(message_data)
// {
//     if(message_data.value == "success")
//     {
//         app.session.world_state.session_players[message_data.session_player_id].target_location = message_data.target_location;             
//     } 
//     else
//     {
        
//     }
// },

// take_collect_token: function take_collect_token(message_data)
// {

//     if(message_data.period_id != app.session.session_periods_order[app.session.world_state.current_period-1]) return;

//     let token = app.session.world_state.tokens[message_data.period_id][message_data.token_id];

//     try{
//         pixi_tokens[message_data.period_id][message_data.token_id].token_graphic.stop();
//         pixi_tokens[message_data.period_id][message_data.token_id].token_graphic.alpha = 0.25;
//         // token.token_graphic.visible = false;
//     } catch (error) {

//     }

//     token.status = message_data.player_id;

//     let session_player = app.session.world_state.session_players[message_data.player_id];
//     let current_location =  app.session.world_state.session_players[message_data.player_id].current_location;

//     session_player.inventory[message_data.period_id] = message_data.inventory;
//     pixi_avatars[message_data.player_id].inventory_label.text = message_data.inventory;

//     let token_graphic = PIXI.Sprite.from(app.pixi_textures.sprite_sheet_2.textures["cherry_small.png"]);
//     token_graphic.anchor.set(1, 0.5)
//     token_graphic.scale.set(0.4);
//     token_graphic.alpha = 0.7;

//     app.add_text_emitters("+1", 
//                           current_location.x, 
//                           current_location.y,
//                           current_location.x,
//                           current_location.y-100,
//                           0xFFFFFF,
//                           28,
//                           token_graphic)
// },

update_player_inventory: function update_player_inventory()
{

    let period_id = app.session.session_periods_order[app.session.world_state.current_period-1];

    for(const i in app.session.session_players_order)
    {
        const player_id = app.session.session_players_order[i];
        pixi_avatars[player_id].inventory_label = app.session.world_state.session_players[player_id].inventory[period_id];
    }
},

