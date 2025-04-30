{% load static %}

/**
 * update the pixi players with new info
 */
setup_pixi: function setup_pixi(){    
    app.reset_pixi_app();

    PIXI.Assets.add({alias:'sprite_sheet', src:'{% static "gear_3_animated.json" %}'});
    PIXI.Assets.add({alias:'sprite_sheet_2', src:'{% static "sprite_sheet.json" %}'});
    PIXI.Assets.add({alias:'bg_tex', src:'{% static "background_tile_low.jpg"%}'});
    PIXI.Assets.add({alias:'cherry_token', src:'{% static "cherry_1_animated.json"%}'});
    PIXI.Assets.add({alias:'wall_tex', src:'{% static "wall.png"%}'});
    PIXI.Assets.add({alias:'barrier_tex', src:'{% static "barrier.png"%}'});
    PIXI.Assets.add({alias:'bridge_tex', src:'{% static "bridge.jpg"%}'});
    PIXI.Assets.add({alias:'grass_tex', src:'{% static "background_tile_low.jpg"%}'});
    PIXI.Assets.add({alias:'water_tex', src:'{% static "water_tile.jpg"%}'});
    PIXI.Assets.add({alias:'dash_tex', src:'{% static "dash_1.png"%}'});

    const textures_promise = PIXI.Assets.load(['sprite_sheet', 'bg_tex', 'sprite_sheet_2', 'grass_tex', 'water_tex',
                                               'cherry_token', 'wall_tex', 'barrier_tex', 'bridge_tex', 'dash_tex']);

    textures_promise.then((textures) => {
        app.setup_pixi_sheets(textures);
        app.setup_pixi_ground();
        app.setup_pixi_tokens_for_current_period();
        app.setup_pixi_subjects();
        app.setup_pixi_wall();
        app.setup_pixi_barrier();
        
        if(app.pixi_mode!="subject")
        {
            app.update_zoom();
            app.fit_to_screen();
        }
        else
        {
            app.setup_pixi_minimap();
            app.setup_subject_status_overlay();
        }
    });

    pixi_text_emitter = {};
    pixi_text_emitter_key = 0;
    app.pixi_tick_tock = {value:"tick", time:Date.now()};
    pixi_transfer_beams = {};
    pixi_transfer_beams_key = 0;
},

reset_pixi_app: async function reset_pixi_app(){    

    app.stage_width = app.session.parameter_set.world_width;
    app.stage_height = app.session.parameter_set.world_height;

    let canvas = document.getElementById('sd_graph_id');

    pixi_app = new PIXI.Application()

    await pixi_app.init({resizeTo : canvas,
                         backgroundColor : 0xFFFFFF,
                         autoResize: true,
                         antialias: false,
                         resolution: 1,
                         canvas: canvas });

    // The stage will handle the move events
    // pixi_app.stage.hitArea = pixi_app.screen;

    app.canvas_width = canvas.width;
    app.canvas_height = canvas.height;

    app.last_collision_check = Date.now();
},

/** load pixi sprite sheets
*/
setup_pixi_sheets: function setup_pixi_sheets(textures){

    app.pixi_textures = textures;
    app.background_tile_tex = textures.bg_tex;

    pixi_container_main = new PIXI.Container();
    pixi_container_main.sortableChildren = true;

    pixi_app.stage.addChild(pixi_container_main);
   
    let tiling_sprite = new PIXI.TilingSprite({texture : app.pixi_textures["water_tex"],
                                               width : app.stage_width,
                                               height : app.stage_height});

    tiling_sprite.position.set(0,0);
    pixi_container_main.addChild(tiling_sprite);

    //subject controls
    if(app.pixi_mode=="subject")
    {
        tiling_sprite.eventMode ='static';
        
        tiling_sprite.on("click", app.subject_pointer_click);     
        tiling_sprite.on("rightclick", app.subject_pointer_right_click);   
        tiling_sprite.on("tap", app.subject_pointer_tap);       
               
        pixi_target = new PIXI.Graphics();
        
        pixi_target.alpha = 0.33;
        pixi_target.circle(0, 0, 10);
        pixi_target.stroke({width:3, color:0x000000});
        pixi_target.eventMode='static';
        pixi_target.zIndex = 100;

        //pixi_target.scale.set(app.pixi_scale, app.pixi_scale);
        pixi_container_main.addChild(pixi_target)
    }
    else
    {
       
    }

    // staff controls
    if(app.pixi_mode=="staff"){

        app.scroll_button_up = app.add_scroll_button({w:50, h:30, x:pixi_app.screen.width/2, y:30}, 
                                                     {scroll_direction:{x:0,y:-app.scroll_speed}}, 
                                                   "↑↑↑");
        app.scroll_button_down = app.add_scroll_button({w:50, h:30, x:pixi_app.screen.width/2, y:pixi_app.screen.height - 30}, 
                                                     {scroll_direction:{x:0,y:app.scroll_speed}}, 
                                                     "↓↓↓");

        app.scroll_button_left = app.add_scroll_button({w:30, h:50, x:30, y:pixi_app.screen.height/2}, 
                                                     {scroll_direction:{x:-app.scroll_speed,y:0}}, 
                                                     "←\n←\n←");

        app.scroll_button_right = app.add_scroll_button({w:30, h:50, x:pixi_app.screen.width - 30, y:pixi_app.screen.height/2}, 
                                                      {scroll_direction:{x:app.scroll_speed,y:0}}, 
                                                      "→\n→\n→");
        
    }

    {%if DEBUG or session.parameter_set.test_mode%}
    //fps counter
    let text_style = {
        fontFamily: 'Arial',
        fontSize: 14,
        fill: {color:'black'},
        align: 'left',
    };
    let fps_label = new PIXI.Text({text:"0 fps", 
                                   style:text_style});

    pixi_fps_label = fps_label;
    pixi_fps_label.position.set(10, app.canvas_height-25);
    pixi_app.stage.addChild(pixi_fps_label);   
    {%endif%}

    //start game loop
    pixi_app.ticker.add(app.game_loop);
},

/**
 * game loop for pixi
 */
game_loop: function game_loop(delta)
{
    app.move_player(delta.deltaTime);
    app.move_text_emitters(delta.deltaTime);
    app.animate_transfer_beams(delta.deltaTime);

    if(app.pixi_mode=="subject" && app.session.started)
    {   
        app.update_offsets_player(delta.deltaTime);
        app.update_mini_map(delta.deltaTime);
        app.check_for_collisions();
    }
    
    if(app.pixi_mode=="staff")
    {
        app.update_offsets_staff(delta.deltaTime);
        app.scroll_staff(delta.deltaTime);
    }  
    
    {%if DEBUG%}
    pixi_fps_label.text = Math.round(pixi_app.ticker.FPS) + " FPS";
    {%endif%}

    //tick tock
    if(Date.now() - app.pixi_tick_tock.time >= 200)
    {
        app.pixi_tick_tock.time = Date.now();
        if(app.pixi_tick_tock.value == "tick") 
            app.pixi_tick_tock.value = "tock";
        else
            app.pixi_tick_tock.value = "tick";
    }
},



/**
 * check for collisions between local player and other objects
 */
check_for_collisions: function check_for_collisions(delta)
{
    //no harvesting during breaks
    if(app.session.world_state.time_remaining > app.session.parameter_set.period_length &&
        app.session.world_state.current_period % app.session.parameter_set.break_frequency == 0)
    {
        return;
    }

    if(Date.now() - app.last_collision_check < 100) return;
    app.last_collision_check = Date.now();

    const obj = app.session.world_state.session_players[app.session_player.id];
    let collision_found = false;

    //check for collisions with tokens
    const current_period_id = app.session.session_periods_order[app.session.world_state.current_period-1];
    for(const i in app.session.world_state.tokens[current_period_id]){       

        let token = app.session.world_state.tokens[current_period_id][i];
        let distance = app.get_distance(obj.current_location, token.current_location);

        if(distance <= pixi_avatars[app.session_player.id].avatar_container.width/2 &&
           token.status == "available" && 
           !collision_found)
        {
            
            token.status = "waiting";
            collision_found = true;

            app.send_message("collect_token", 
                             {"token_id" : i, "period_id" : current_period_id},
                             "group");
        }
        else if(distance>2000)
        {
            token.visible=false;
        }
        else
        {
            token.visible=true;
        }
        
    }

},

/**
 * move the object towards its target location
 */
move_object: function move_object(delta, obj, move_speed)
{
    let noX = false;
    let noY = false;
    let temp_move_speed = (move_speed * delta);

    let temp_angle = Math.atan2(obj.target_location.y - obj.current_location.y,
                                obj.target_location.x - obj.current_location.x)

    if(!noY){
        if(Math.abs(obj.target_location.y - obj.current_location.y) < temp_move_speed)
            obj.current_location.y = obj.target_location.y;
        else
            obj.current_location.y += temp_move_speed * Math.sin(temp_angle);
    }

    if(!noX){
        if(Math.abs(obj.target_location.x - obj.current_location.x) < temp_move_speed)
            obj.current_location.x = obj.target_location.x;
        else
            obj.current_location.x += temp_move_speed * Math.cos(temp_angle);        
    }
},