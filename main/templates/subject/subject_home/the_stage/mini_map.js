/**
 * setup mini map on subject screen 
 * */
setup_pixi_minimap: function setup_pixi_minimap()
{
    if(app.pixi_mode!="subject") return; 

    if(pixi_mini_map.container)
    {
        pixi_app.stage.removeChild(pixi_mini_map.container);
        pixi_mini_map.container.destroy({children:true, baseTexture:true});
    }

    if(!app.session) return;
    if(!app.session.started) return;
    
    app.mini_map_scale = Math.min((pixi_app.screen.width * 0.2)/app.stage_width,  (pixi_app.screen.height * 0.3)/app.stage_height);

    let scale = app.mini_map_scale;
    let obj = app.session.world_state.session_players[app.session_player.id]

    pixi_mini_map.container = new PIXI.Container();
    pixi_mini_map.container.zIndex = 9998;

    //mini map background
    let pixi_mini_map_bg = new PIXI.Graphics();
    
    pixi_mini_map_bg.width = app.stage_width * scale;
    pixi_mini_map_bg.height =  app.stage_height * scale;
    
    pixi_mini_map_bg.rect(0, 0, app.stage_width * scale, app.stage_height * scale);
    pixi_mini_map_bg.fill({color:'00BFFF'});
    pixi_mini_map_bg.stroke({color:0x000000, width:1});
    
    pixi_mini_map.container.addChild(pixi_mini_map_bg);

    //grounds
    for(const i in app.session.parameter_set.parameter_set_grounds){
        const ground = app.session.parameter_set.parameter_set_grounds[i];

        let temp_ground = new PIXI.Graphics();
        
        temp_ground.rect(ground.x * scale, ground.y * scale, ground.width * scale, ground.height * scale);
        temp_ground.fill(ground.tint);

        pixi_mini_map.container.addChild(temp_ground);
    }

    //walls
    for(const i in app.session.parameter_set.parameter_set_walls)
    { 

        const wall = app.session.parameter_set.parameter_set_walls[i];

        let temp_wall = new PIXI.Graphics();
        
        temp_wall.rect(wall.start_x * scale, wall.start_y * scale, wall.width * scale, wall.height * scale);
        temp_wall.fill('DEB887');

        pixi_mini_map.container.addChild(temp_wall);
    }

    //mini map tokens
    const current_period_id = app.session.session_periods_order[app.session.world_state.current_period-1];

    for(const i in app.session.world_state.tokens[current_period_id]){       

        let token =  app.session.world_state.tokens[current_period_id][i];

        if(token.status != "available") continue;

        let token_graphic = new PIXI.Graphics();

        
        token_graphic.rect(0, 0, 2, 2);
        token_graphic.fill(0xFFFFFF);
        
        token_graphic.pivot.set(token_graphic.width/2, token_graphic.height/2);
        token_graphic.position.set(token.current_location.x * scale, token.current_location.y * scale);

        pixi_tokens[current_period_id][i].mini_map_graphic = token_graphic;
        pixi_mini_map.container.addChild(pixi_tokens[current_period_id][i].mini_map_graphic);
    }

    //mini map view port
    let pixi_mini_map_vp = new PIXI.Graphics();
    pixi_mini_map_vp.width = pixi_app.screen.width * scale;
    pixi_mini_map_vp.height = pixi_app.screen.height * scale;
    
    pixi_mini_map_vp.rect(0, 0, pixi_app.screen.width * scale, pixi_app.screen.height * scale);

    pixi_mini_map_vp.fill({color:0xFFFFFF, alpha:0});
    pixi_mini_map_vp.stroke({width:2,color:0x000000,alignment:0});

    pixi_mini_map_vp.pivot.set( pixi_app.screen.width * scale / 2, pixi_app.screen.height * scale / 2);
    pixi_mini_map_vp.position.set(obj.current_location.x * scale, obj.current_location.y * scale);

    pixi_mini_map.view_port = pixi_mini_map_vp;

    pixi_mini_map.container.addChild(pixi_mini_map.view_port);

    //add to stage
    pixi_mini_map.container.position.set(20, 20);
    // pixi_mini_map.container.alpha = 0.9;
    pixi_app.stage.addChild(pixi_mini_map.container);
},

/**
 * update the mini map
 */
update_mini_map: function update_mini_map(delta)
{
    if(!app.mini_map_scale) return;
    
    let obj = app.session.world_state.session_players[app.session_player.id]
    pixi_mini_map.view_port.position.set(obj.current_location.x * app.mini_map_scale, 
                                         obj.current_location.y * app.mini_map_scale);

},