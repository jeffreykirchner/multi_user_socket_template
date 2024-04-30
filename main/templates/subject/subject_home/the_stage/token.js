/**
 * setup the pixi components for each token
 */
setup_pixi_tokens_for_current_period: function setup_pixi_tokens_for_current_period()
{
    if(!app.session) return;
    if(!app.session.started) return;

    app.destroy_pixi_tokens_for_all_periods();

    const current_period_id = app.session.session_periods_order[app.session.world_state.current_period-1];

    pixi_tokens[current_period_id] = {};

    for(const i in app.session.world_state.tokens[current_period_id]){

        let token =  app.session.world_state.tokens[current_period_id][i];
        let token_container = new PIXI.Container();

        token_container.zIndex = 100;

        let token_graphic = new PIXI.AnimatedSprite(app.pixi_textures.cherry_token.animations['walk']);
        token_graphic.animationSpeed = app.animation_speed;
        token_graphic.anchor.set(0.5)

        if(token.status=="available")
        {
            token_graphic.play();
        }
        else
        {
            token_graphic.alpha = 0.25;
        }

        token_container.addChild(token_graphic);
        // token_container.pivot.set(token_container.width/2, token_container.height/2);
        token_container.position.set(token.current_location.x, token.current_location.y);

        //bounding box outline
        if(app.draw_bounding_boxes)
        {
            let bounding_box = new PIXI.Graphics();

            bounding_box.width = token_container.width;
            bounding_box.height = token_container.height;
           
            bounding_box.rect(0, 0, token_container.width, token_container.height);
            bounding_box.stroke(1, 0x000000);

            bounding_box.pivot.set(bounding_box.width/2, bounding_box.height/2);
            bounding_box.position.set(0, 0);
            token_container.addChild(bounding_box);
        }

        let v = {"token_container":token_container};
        v.token_graphic = token_graphic;

        pixi_tokens[current_period_id][i] = v;
        pixi_container_main.addChild(pixi_tokens[current_period_id][i].token_container);
       
   }
},

/**
 * destory pixi tokens in world state
 */
destroy_pixi_tokens_for_all_periods: function destroy_pixi_tokens_for_all_periods()
{
    if(!app.session) return;

    for(const i in app.session.session_periods_order){

        let period_id = app.session.session_periods_order[i];

        for(const j in app.session.world_state.tokens[period_id]){

            if (period_id in pixi_tokens)
            {
                pixi_container_main.removeChild(pixi_tokens[period_id][j].token_container);
                pixi_tokens[period_id][j].token_container.destroy({children:true, baseTexture:true});
            }
        }
    }
},

/**
 * take and update from the server about a collected token
 */
take_collect_token: function take_collect_token(message_data)
{

    if(message_data.status == "success")
    {
        if(message_data.period_id != app.session.session_periods_order[app.session.world_state.current_period-1]) return;

        let token = app.session.world_state.tokens[message_data.period_id][message_data.token_id];

        try{
            pixi_tokens[message_data.period_id][message_data.token_id].token_graphic.stop();
            pixi_tokens[message_data.period_id][message_data.token_id].token_graphic.alpha = 0.25;

            if(app.is_subject)
            {
                pixi_tokens[message_data.period_id][message_data.token_id].mini_map_graphic.visible = false;
            }
        } catch (error) {

        }

        token.status = message_data.player_id;

        let session_player = app.session.world_state.session_players[message_data.player_id];
        let current_location =  app.session.world_state.session_players[message_data.player_id].current_location;

        session_player.inventory[message_data.period_id] = message_data.inventory;
        pixi_avatars[message_data.player_id].inventory_label.text = message_data.inventory;

        let token_graphic = PIXI.Sprite.from(app.pixi_textures.sprite_sheet_2.textures["cherry_small.png"]);
        token_graphic.anchor.set(1, 0.5)
        token_graphic.scale.set(0.4);
        token_graphic.alpha = 0.7;

        app.add_text_emitters("+1", 
                            current_location.x, 
                            current_location.y,
                            current_location.x,
                            current_location.y-100,
                            0xFFFFFF,
                            28,
                            token_graphic);
    }
    else
    {

    }
},