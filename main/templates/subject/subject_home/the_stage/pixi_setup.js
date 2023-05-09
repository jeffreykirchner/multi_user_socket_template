{% load static %}

/**
 * update the pixi players with new info
 */
setup_pixi(){    
    app.reset_pixi_app();

    PIXI.Assets.add('sprite_sheet', '{% static "gear_3_animated.json" %}');
    PIXI.Assets.add('sprite_sheet_2', '{% static "sprite_sheet.json" %}');
    PIXI.Assets.add('bg_tex', '{% static "background_tile_low.jpg"%}');
    PIXI.Assets.add('cherry_token', '{% static "cherry_1_animated.json"%}');

    const textures_promise = PIXI.Assets.load(['sprite_sheet', 'bg_tex', 'sprite_sheet_2', 'cherry_token']);

    textures_promise.then((textures) => {
        app.setup_pixi_sheets(textures);
        app.setup_pixi_tokens_for_current_period();
        app.setup_pixi_subjects();
        app.setup_pixi_minimap();
        app.setup_subject_status_overlay();
        app.update_zoom();
    });

    app.pixi_text_emitter = [];
    app.pixi_tick_tock = {value:"tick", time:Date.now()};
},

reset_pixi_app(){    

    app.stage_width = app.session.parameter_set.world_width;
    app.stage_height = app.session.parameter_set.world_height;

    let canvas = document.getElementById('sd_graph_id');

    app.pixi_app = new PIXI.Application({resizeTo : canvas,
                                        backgroundColor : 0xFFFFFF,
                                        autoResize: true,
                                        antialias: false,
                                        resolution: 1,
                                        view: canvas });

    // The stage will handle the move events
    app.pixi_app.stage.eventMode = 'static';
    app.pixi_app.stage.hitArea = app.pixi_app.screen;

    app.canvas_width = canvas.width;
    app.canvas_height = canvas.height;

    app.last_collision_check = Date.now();
    //app.pixi_app.ticker.maxFPS = 30;
    //app.pixi_app.ticker.targetFPMS = 0.12;
    //app.pixi_app.ticker.minFPS = 40;
},

/** load pixi sprite sheets
*/
setup_pixi_sheets(textures){

    app.pixi_textures = textures;
    app.background_tile_tex = textures.bg_tex;

    app.pixi_container_main = new PIXI.Container();
    app.pixi_container_main.sortableChildren = true;
    app.pixi_container_main.eventMode = 'passive';

    app.pixi_app.stage.addChild(app.pixi_container_main);
   
    let tiling_sprite = new PIXI.TilingSprite(
        textures.bg_tex,
        app.stage_width,
        app.stage_height,
    );
    tiling_sprite.position.set(0,0);
    app.pixi_container_main.addChild(tiling_sprite);

    //subject controls
    if(app.pixi_mode=="subject")
    {
        tiling_sprite.eventMode ='static';
        tiling_sprite.on("pointerup", app.subject_pointer_up);        
               
        app.pixi_target = new PIXI.Graphics();
        app.pixi_target.lineStyle(3, 0x000000);
        app.pixi_target.alpha = 0.33;
        app.pixi_target.drawCircle(0, 0, 10);
        app.pixi_target.eventMode='static';

        //app.pixi_target.scale.set(app.pixi_scale, app.pixi_scale);
        app.pixi_container_main.addChild(app.pixi_target)
    }
    else
    {
       
    }

    // staff controls
    if(app.pixi_mode=="staff"){

        app.scroll_button_up = app.add_scroll_button({w:50, h:30, x:app.pixi_app.screen.width/2, y:30}, 
                                                     {scroll_direction:{x:0,y:-app.scroll_speed}}, 
                                                   "↑↑↑");
        app.scroll_button_down = app.add_scroll_button({w:50, h:30, x:app.pixi_app.screen.width/2, y:app.pixi_app.screen.height - 30}, 
                                                     {scroll_direction:{x:0,y:app.scroll_speed}}, 
                                                     "↓↓↓");

        app.scroll_button_left = app.add_scroll_button({w:30, h:50, x:30, y:app.pixi_app.screen.height/2}, 
                                                     {scroll_direction:{x:-app.scroll_speed,y:0}}, 
                                                     "←\n←\n←");

        app.scroll_button_right = app.add_scroll_button({w:30, h:50, x:app.pixi_app.screen.width - 30, y:app.pixi_app.screen.height/2}, 
                                                      {scroll_direction:{x:app.scroll_speed,y:0}}, 
                                                      "→\n→\n→");
        
    }

    {%if DEBUG%}
    //fps counter
    let text_style = {
        fontFamily: 'Arial',
        fontSize: 14,
        fill: 'black',
        align: 'left',
    };
    let fps_label = new PIXI.Text("0 fps", text_style);
    fps_label.eventMode = 'none';

    app.pixi_fps_label = fps_label;
    app.pixi_fps_label.position.set(10, app.canvas_height-25);
    app.pixi_app.stage.addChild(app.pixi_fps_label);   
    {%endif%}

    //start game loop
    app.pixi_app.ticker.add(app.game_loop);
},

/**
 * setup the pixi components for each subject
 */
setup_pixi_subjects(){

    if(!app.session) return;
    if(!app.session.started) return;
    
    let current_z_index = 1000;
    let current_period_id = app.session.session_periods_order[app.session.current_period-1];
    for(const i in app.session.world_state.session_players)
    {      
        let subject = app.session.world_state.session_players[i];
        subject.pixi = {};

        //avatar
        let avatar_container = new PIXI.Container();
        avatar_container.position.set(subject.current_location.x, subject.current_location.y);
        avatar_container.height = 250;
        avatar_container.width = 250;
        avatar_container.eventMode = 'passive';
        avatar_container.name = {player_id : i};
        // avatar_container.on("pointerup", app.subject_avatar_click);

        let gear_sprite = new PIXI.AnimatedSprite(app.pixi_textures.sprite_sheet.animations['walk']);
        gear_sprite.animationSpeed = app.animation_speed;
        gear_sprite.anchor.set(0.5)
        gear_sprite.tint = app.session.session_players[i].parameter_set_player.hex_color;
        gear_sprite.eventMode = 'passive';    

        let face_sprite = PIXI.Sprite.from(app.pixi_textures.sprite_sheet_2.textures["face_1.png"]);
        face_sprite.anchor.set(0.5);
        face_sprite.eventMode = 'passive';

        let text_style = {
            fontFamily: 'Arial',
            fontSize: 20,
            fill: 'white',
            align: 'left',
            stroke: 'black',
            strokeThickness: 2,
        };

        let id_label = new PIXI.Text(app.session.session_players[i].parameter_set_player.id_label, text_style);
        id_label.eventMode = 'passive';
        id_label.anchor.set(0.5);
        
        let token_graphic = new PIXI.AnimatedSprite(app.pixi_textures.cherry_token.animations['walk']);
        token_graphic.animationSpeed = app.animation_speed;
        token_graphic.anchor.set(1, 0.5)
        token_graphic.eventMode = 'passive';
        token_graphic.scale.set(0.3);
        token_graphic.alpha = 0.7;

        let inventory_label = new PIXI.Text(subject.inventory[current_period_id], text_style);
        inventory_label.eventMode = 'passive';
        inventory_label.anchor.set(0, 0.5);

        let status_label = new PIXI.Text("Working ... 10", text_style);
        status_label.eventMode = 'passive';
        status_label.anchor.set(0.5);
        status_label.visible = false;

        avatar_container.addChild(gear_sprite);
        avatar_container.addChild(face_sprite);
        avatar_container.addChild(id_label);
        avatar_container.addChild(token_graphic);
        avatar_container.addChild(inventory_label);
        avatar_container.addChild(status_label);

        face_sprite.position.set(0, -avatar_container.height * 0.03);
        id_label.position.set(0, -avatar_container.height * 0.2);
        token_graphic.position.set(-2, +avatar_container.height * 0.18);
        inventory_label.position.set(2, +avatar_container.height * 0.18);
        status_label.position.set(0, -avatar_container.height/2 + 30);

        subject.pixi.avatar_container = avatar_container;
        app.pixi_container_main.addChild(subject.pixi.avatar_container);

        //chat
        let chat_container = new PIXI.Container();
        chat_container.position.set(subject.current_location.x, subject.current_location.y);
        //chat_container.visible = true;
        
        let chat_bubble_sprite = PIXI.Sprite.from(app.pixi_textures.sprite_sheet_2.textures["chat_bubble.png"]);
        chat_bubble_sprite.anchor.set(0.5);
        chat_bubble_sprite.eventMode = 'none';

        let chat_bubble_text = new PIXI.Text('', {
                fontFamily: 'Arial',
                fontSize: 18,
                fill: 0x000000,
                align: 'left',
            });
        chat_bubble_text.eventMode = 'none';    

        chat_container.addChild(chat_bubble_sprite);
        chat_container.addChild(chat_bubble_text);

        chat_bubble_text.position.set(0, -chat_container.height*.09)
        chat_bubble_text.anchor.set(0.5);

        subject.pixi.chat_container = chat_container;
        subject.pixi.chat_container.zIndex = current_z_index++;

        subject.show_chat = false;
        subject.chat_time = null;

        app.pixi_container_main.addChild(subject.pixi.chat_container);

        //tractor beam
        subject.pixi.tractor_beam = [];
        subject.tractor_beam_target = null;

        for(let i=0; i<15; i++)
        {
            let tractor_beam_sprite = PIXI.Sprite.from(app.pixi_textures.sprite_sheet_2.textures["particle2.png"]);
            tractor_beam_sprite.anchor.set(0.5);
            tractor_beam_sprite.eventMode = 'passive';
            tractor_beam_sprite.visible = false;
            tractor_beam_sprite.zIndex = 1500;
            subject.pixi.tractor_beam.push(tractor_beam_sprite);
            app.pixi_container_main.addChild(tractor_beam_sprite);
        }
    }

    //make local subject the top layer
    if(app.pixi_mode=="subject")
    {  
        app.session.world_state.session_players[app.session_player.id].pixi.avatar_container.zIndex = 999;
        app.session.world_state.session_players[app.session_player.id].pixi.chat_container.zIndex = current_z_index;
    }
},

/**
 * destory pixi subject objects in world state
 */
destory_setup_pixi_subjects()
{
    if(!app.session) return;

    for(const i in app.session.world_state.session_players){

        let pixi_objects = app.session.world_state.session_players[i].pixi;

        if(pixi_objects)
        {
            pixi_objects.avatar_container.destroy();
            pixi_objects.chat_container.destroy();
        }
    }
},

/**
 * setup the pixi components for each token
 */
setup_pixi_tokens_for_current_period()
{
    if(!app.session) return;
    if(!app.session.started) return;

    app.destroy_pixi_tokens_for_all_periods();

    const current_period_id = app.session.session_periods_order[app.session.current_period-1];

    for(const i in app.session.world_state.tokens[current_period_id]){

        let token =  app.session.world_state.tokens[current_period_id][i];
        let token_container = new PIXI.Container();

        let token_graphic = new PIXI.AnimatedSprite(app.pixi_textures.cherry_token.animations['walk']);
        token_graphic.animationSpeed = app.animation_speed;
        token_graphic.anchor.set(0.5)
        token_graphic.eventMode = 'passive';

        if(token.status=="available")
        {
            token_graphic.play();
        }
        else
        {
            token_graphic.alpha = 0.25;
        }

        token_container.addChild(token_graphic);
        token_container.pivot.set(token_container.width/2, token_container.height/2);
        token_container.position.set(token.current_location.x, token.current_location.y);

        token.token_container = token_container;
        app.pixi_container_main.addChild(token.token_container);
       
   }
},

/**
 * destory pixi tokens in world state
 */
destroy_pixi_tokens_for_all_periods()
{
    if(!app.session) return;

    for(const i in app.session.session_periods_order){

        let period_id = app.session.session_periods_order[i];

        for(const j in app.session.world_state.tokens[period_id]){

            let token =  app.session.world_state.tokens[period_id][j];
            if(token.token_container) token.token_container.destroy();
        }
    }
},


/**
 * setup mini map on subject screen 
 * */
setup_pixi_minimap()
{
    if(!app.session) return;
    if(!app.session.started) return;
    if(app.pixi_mode!="subject") return;

    if(app.mini_map_container) app.mini_map_container.destroy();

    app.mini_map_scale = Math.min((app.pixi_app.screen.width * 0.2)/app.stage_width,  (app.pixi_app.screen.height * 0.3)/app.stage_height);

    let scale = app.mini_map_scale;
    let obj = app.session.world_state.session_players[app.session_player.id]

    let mini_map_container = new PIXI.Container();
    mini_map_container.eventMode = 'none';
    mini_map_container.zIndex = 9998;

    //mini map background
    let mini_map_bg = new PIXI.Graphics();
    
    mini_map_bg.width = app.stage_width * scale;
    mini_map_bg.height =  app.stage_height * scale;
    mini_map_bg.lineStyle(1, 0x000000);
    mini_map_bg.beginFill(0xBDB76B);
    mini_map_bg.drawRect(0, 0, app.stage_width * scale, app.stage_height * scale);
    mini_map_bg.endFill();
    
    mini_map_container.addChild(mini_map_bg);

    //mini map view port
    let mini_map_vp = new PIXI.Graphics();
    mini_map_vp.width = app.pixi_app.screen.width * scale;
    mini_map_vp.height = app.pixi_app.screen.height * scale;
    mini_map_vp.lineStyle({width:2,color:0x000000,alignment:0});
    mini_map_vp.beginFill(0xFFFFFF,0);
    mini_map_vp.drawRect(0, 0, app.pixi_app.screen.width * scale, app.pixi_app.screen.height * scale);
    mini_map_vp.endFill();    
    mini_map_vp.pivot.set(mini_map_vp.width/2, mini_map_vp.height/2);
    mini_map_vp.position.set(obj.current_location.x * scale, obj.current_location.y * scale);

    mini_map_container.addChild(mini_map_vp);

    //mini map tokens
    const current_period_id = app.session.session_periods_order[app.session.current_period-1];

    for(const i in app.session.world_state.tokens[current_period_id]){       

        let token =  app.session.world_state.tokens[current_period_id][i];

        if(token.status != "available") continue;

        let token_graphic = new PIXI.Graphics();

        token_graphic.beginFill(0xFFFFFF);
        token_graphic.drawRect(0, 0, 2, 2);
        token_graphic.endFill();
        token_graphic.pivot.set(token_graphic.width/2, token_graphic.height/2);
        token_graphic.position.set(token.current_location.x * scale, token.current_location.y * scale);

        token.token_graphic = token_graphic;

        mini_map_container.addChild(token_graphic);
    }

    mini_map_container.position.set(20, 20);
    mini_map_container.alpha = 0.9;
    app.mini_map_container = mini_map_container;
    app.pixi_app.stage.addChild(app.mini_map_container);

},

/**
 * setup subject screen status overlay
 */
setup_subject_status_overlay()
{
    if(!app.session) return;
    if(app.pixi_mode!="subject") return;
    if(app.subject_overlay_container) app.subject_overlay_container.destroy();

    let subject_status_overlay_container = new PIXI.Container();
    subject_status_overlay_container.eventMode = 'none';
    subject_status_overlay_container.zIndex = 9999

    temp_y = 0;

    let text_style = {
        fontFamily: 'Arial',
        fontSize: 28,
        fill: 'white',
        align: 'left',
        stroke: 'black',
        strokeThickness: 2,
    };

    //labels
    //current period
    let current_period_text = new PIXI.Text('Current Period:', text_style);
    current_period_text.eventMode = 'none';   

    subject_status_overlay_container.addChild(current_period_text);
    current_period_text.position.set(0, temp_y);

    temp_y += current_period_text.height+5;

    //time remaining
    let time_remaining_text = new PIXI.Text('Time Remaining:', text_style);
    time_remaining_text.eventMode = 'none';   

    subject_status_overlay_container.addChild(time_remaining_text);
    time_remaining_text.position.set(0, temp_y);

    temp_y += time_remaining_text.height+5;

    //profit
    let profit_text = new PIXI.Text('Total Profit (¢):', text_style);
    profit_text.eventMode = 'none';   

    subject_status_overlay_container.addChild(profit_text);
    profit_text.position.set(0, temp_y);

    //amounts
    temp_y = 0;
    //current period 
    let current_period_label = new PIXI.Text('NN', text_style);
    current_period_label.eventMode = 'none';   

    subject_status_overlay_container.addChild(current_period_label);
    current_period_label.position.set(time_remaining_text.width+10, temp_y);

    temp_y += current_period_text.height+5;

    //time remaining 
    let time_remaining_label = new PIXI.Text('00:00', text_style);
    time_remaining_label.eventMode = 'none';   

    subject_status_overlay_container.addChild(time_remaining_label);
    time_remaining_label.position.set(time_remaining_text.width+10, temp_y);

    temp_y += time_remaining_text.height+5;

    //profit
    let profit_label = new PIXI.Text('0000', text_style);
    profit_label.eventMode = 'none';   

    subject_status_overlay_container.addChild(profit_label);
    profit_label.position.set(time_remaining_text.width+10, temp_y);

    app.subject_status_overlay_container = subject_status_overlay_container;
    app.subject_status_overlay_container.position.set(app.pixi_app.screen.width - subject_status_overlay_container.width-20, 20);
    
    app.pixi_app.stage.addChild(app.subject_status_overlay_container);

    app.update_subject_status_overlay();
},

/**
 * update subject overlay
 */
update_subject_status_overlay(delta)
{
    if(!app.subject_status_overlay_container) return;
    app.subject_status_overlay_container.position.set(app.pixi_app.screen.width - app.subject_status_overlay_container.width-20, 20);

    app.subject_status_overlay_container.getChildAt(3).text = app.session.current_period;
    app.subject_status_overlay_container.getChildAt(4).text = app.session.time_remaining;
    app.subject_status_overlay_container.getChildAt(5).text = app.session_player.earnings;
},


/**
 * add scroll buttons to staff screen
 */
add_scroll_button(button_size, name, text)
{
    let g = new PIXI.Graphics();
    g.lineStyle(1, 0x000000);
    g.beginFill(0xffffff);
    g.drawRect(0, 0, button_size.w, button_size.h);
    g.pivot.set(button_size.w/2, button_size.h/2);
    g.endFill();
    g.lineStyle(1, 0x000000);
    g.x=button_size.x;
    g.y=button_size.y;
    g.eventMode='static';
    g.alpha = 0.5;
    g.name = name;

    g.on("pointerover", app.staff_screen_scroll_button_over);
    g.on("pointerout", app.staff_screen_scroll_button_out);

    let label = new PIXI.Text(text,{fontFamily : 'Arial',
                                    fontWeight:'bold',
                                    fontSize: 28,       
                                    lineHeight : 14,                             
                                    align : 'center'});
    label.pivot.set(label.width/2, label.height/2);
    label.x = button_size.w/2;
    label.y = button_size.h/2-3;
    g.addChild(label);

    app.pixi_app.stage.addChild(g);

    return g
},

/**
 * game loop for pixi
 */
game_loop(delta)
{
    app.move_player(delta);
    app.move_text_emitters(delta);

    if(app.pixi_mode=="subject" && app.session.started)
    {   
        app.update_offsets_player(delta);
        app.update_mini_map(delta);
        app.check_for_collisions();
    }
    
    if(app.pixi_mode=="staff")
    {
        app.update_offsets_staff(delta);
        app.scroll_staff(delta);
    }  
    
    {%if DEBUG%}
    app.pixi_fps_label.text = Math.round(app.pixi_app.ticker.FPS) + " FPS";
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
 * update zoom level on staff screen
 */
update_zoom(){

    if(app.pixi_mode == "subject") return;
    if(app.pixi_scale == app.pixi_scale_range_control) return;
    
   
    let zoom_direction = 1;
    if(app.pixi_scale_range_control > app.pixi_scale)
    {
        zoom_direction = -1;
    }

    app.pixi_scale = app.pixi_scale_range_control;
    app.pixi_container_main.scale.set(app.pixi_scale);
},

/**
 * get distance in pixels between two points
 */
get_distance(point1, point2) 
{
    // Get the difference between the x-coordinates of the two points.
    const dx = point2.x - point1.x;
  
    // Get the difference between the y-coordinates of the two points.
    const dy = point2.y - point1.y;
  
    // Calculate the square of the distance between the two points.
    const distanceSquared = dx * dx + dy * dy;
  
    // Take the square root of the distance between the two points.
    const distance = Math.sqrt(distanceSquared);
  
    // Return the distance between the two points.
    return distance;
},

/**
 * move players if target does not equal current location
 */
move_player(delta)
{
    if(!app.session.world_state) return;

    //move players
    for(let i in app.session.world_state.session_players){

        let obj = app.session.world_state.session_players[i];
        let avatar_container = obj.pixi.avatar_container;

        if(obj.target_location.x !=  obj.current_location.x ||
            obj.target_location.y !=  obj.current_location.y )
        {
            
            let noX = false;
            let noY = false;
            let temp_move_speed = (app.move_speed * delta);

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

            //update the sprite locations
            avatar_container.getChildAt(0).play();
            avatar_container.position.set(obj.current_location.x, obj.current_location.y);
            if (obj.current_location.x < obj.target_location.x )
            {
                avatar_container.getChildAt(0).animationSpeed = app.animation_speed;
            }
            else
            {
                avatar_container.getChildAt(0).animationSpeed = -app.animation_speed;
            }

            //hide chat if longer than 10 seconds and moving
            if(obj.chat_time)
            {
                if(Date.now() - obj.chat_time >= 10000)
                {
                    obj.show_chat = false;
                }
            }           
        }
        else
        {
            avatar_container.getChildAt(0).stop();
        }

        //update status
        if(obj.interaction > 0)
        {
            avatar_container.getChildAt(5).text = "Interaction ... " + obj.interaction;
            avatar_container.getChildAt(5).visible = true;
        }
        else if(obj.cool_down > 0)
        {
            avatar_container.getChildAt(5).text = "Cooling ... " + obj.cool_down;
            avatar_container.getChildAt(5).visible = true;
        }
        else
        {
            avatar_container.getChildAt(5).visible = false;
        }
    }

    //find nearest players
    for(let i in app.session.world_state.session_players)
    {
        let obj1 = app.session.world_state.session_players[i];
        obj1.nearest_player = null;
        obj1.nearest_player_distance = null;

        for(let j in app.session.world_state.session_players)
        {
            let obj2 = app.session.world_state.session_players[j];

            if(i != j)
            {
                temp_distance = app.get_distance(obj1.current_location, obj2.current_location);

                if(!obj1.nearest_player)
                {
                    obj1.nearest_player = j;
                    obj1.nearest_player_distance = temp_distance;
                }
                else
                {
                   if(temp_distance < obj1.nearest_player_distance)
                   {
                        obj1.nearest_player = j;
                        obj1.nearest_player_distance = temp_distance;
                   }
                }
            }
        }
    }

    //update chat boxes
    for(let i in app.session.world_state.session_players)
    {
        let obj = app.session.world_state.session_players[i];
        let chat_container = obj.pixi.chat_container;
        let avatar_container = obj.pixi.chat_container;
        let offset = {x:chat_container.width*.7, y:chat_container.height*.4};

        if(app.session.world_state.session_players[obj.nearest_player].current_location.x < obj.current_location.x)
        {
            chat_container.position.set(obj.current_location.x + offset.x,
                                        obj.current_location.y - offset.y);
            
            chat_container.getChildAt(0).scale.x = 1;
        }
        else
        {
            chat_container.position.set(obj.current_location.x - offset.x,
                                        obj.current_location.y - offset.y);

            chat_container.getChildAt(0).scale.x = -1;
        }

        chat_container.visible = obj.show_chat;
    }   

    //update tractor beams and status
    for(let i in app.session.world_state.session_players)
    {
        let player = app.session.world_state.session_players[i];
        if(player.tractor_beam_target)
        {
            app.setup_tractor_beam(i, player.tractor_beam_target);
        }
        else
        {
            for (let i=0; i< player.pixi.tractor_beam.length; i++)
            {
                tb_sprite = player.pixi.tractor_beam[i];
                tb_sprite.visible = false;
            }
        }
    }
},

/**
 * update the mini map
 */
update_mini_map(delta)
{
    let obj = app.session.world_state.session_players[app.session_player.id]
    let mini_map_vp = app.mini_map_container.getChildAt(1);
    mini_map_vp.position.set(obj.current_location.x * app.mini_map_scale, 
                             obj.current_location.y * app.mini_map_scale);
},

/**
 * update the amount of shift needed to center the player
 */
update_offsets_player(delta){
    
    offset = app.get_offset();

    app.pixi_container_main.x = -offset.x;
    app.pixi_container_main.y = -offset.y;   
    
    obj = app.session.world_state.session_players[app.session_player.id];

    app.pixi_target.x = obj.target_location.x;
    app.pixi_target.y = obj.target_location.y;
},

/**
 * check for collisions between local player and other objects
 */
check_for_collisions(delta){

    if(Date.now() - app.last_collision_check < 100) return;
    app.last_collision_check = Date.now();

    const obj = app.session.world_state.session_players[app.session_player.id];
    let collision_found = false;

    //check for collisions with tokens
    const current_period_id = app.session.session_periods_order[app.session.current_period-1];
    for(const i in app.session.world_state.tokens[current_period_id]){       

        let token = app.session.world_state.tokens[current_period_id][i];
        let distance = app.get_distance(obj.current_location, token.current_location);

        if(distance <= obj.pixi.avatar_container.width/2 &&
           token.status == "available" && 
           !collision_found)
        {
            // token.token_container.getChildAt(0).stop();
            // token.token_container.getChildAt(0).alpha = 0.25;
            token.status = "waiting";
            collision_found = true;

            app.send_message("collect_token", 
                             {"token_id" : i, "period_id" : current_period_id},
                             "group");
        }
        else if(distance>2000)
        {
            token.token_container.visible=false;
        }
        else
        {
            token.token_container.visible=true;
        }
        
    }

},

/**
 * update the amount of shift needed for the staff view
 */
update_offsets_staff(delta){
    
    let offset = app.get_offset_staff();

    app.pixi_container_main.x = -offset.x;
    app.pixi_container_main.y = -offset.y;   
},

/**
 * manaully scroll staff screen
 */
scroll_staff(delta){

    app.current_location.x += app.scroll_direction.x;
    app.current_location.y += app.scroll_direction.y;
},

/**
 * subject screen offset from the origin
 */
get_offset(){
    let obj = app.session.world_state.session_players[app.session_player.id];

    return {x:obj.current_location.x * app.pixi_scale - app.pixi_app.screen.width/2,
            y:obj.current_location.y * app.pixi_scale - app.pixi_app.screen.height/2};
},

/**
 * staff screen offset from origin
 */
get_offset_staff(){

    if(app.follow_subject != -1 && app.session.started)
    {
        obj = app.session.world_state.session_players[app.follow_subject];
        app.current_location = Object.assign({}, obj.current_location);
    }

    return {x:app.current_location.x * app.pixi_scale - app.pixi_app.screen.width/2,
            y:app.current_location.y * app.pixi_scale - app.pixi_app.screen.height/2};
},

/**
 *pointer up on subject screen
 */
subject_pointer_up(event){

    let local_pos = event.data.getLocalPosition(event.currentTarget);
    let obj = app.session.world_state.session_players[app.session_player.id];

    if(event.button == 0)
    {

        if(obj.frozen)
        {
            app.add_text_emitters("No movement while interacting.", 
                            obj.current_location.x, 
                            obj.current_location.y,
                            obj.current_location.x,
                            obj.current_location.y-100,
                            0xFFFFFF,
                            28,
                            null);
            return;
        }
        
        obj.target_location.x = local_pos.x;
        obj.target_location.y = local_pos.y;

        app.target_location_update();
    }
    else if(event.button == 2)
    {
        if(obj.frozen)
        {
            app.add_text_emitters("No actions while interacting.", 
                            obj.current_location.x, 
                            obj.current_location.y,
                            obj.current_location.x,
                            obj.current_location.y-100,
                            0xFFFFFF,
                            28,
                            null);
            return;
        }

        if(obj.cool_down > 0)
        {
            app.add_text_emitters("No actions cooling down.", 
                            obj.current_location.x, 
                            obj.current_location.y,
                            obj.current_location.x,
                            obj.current_location.y-100,
                            0xFFFFFF,
                            28,
                            null);
            return;
        }
        
        for(i in app.session.world_state.session_players)
        {
            let obj = app.session.world_state.session_players[i];

            if(app.get_distance(obj.current_location, local_pos) < 75)
            {
                app.subject_avatar_click(i);              
                break;
            }
        }
    }
},

/**
 *scroll control for staff
 */
staff_screen_scroll_button_over(event){
    event.currentTarget.alpha = 1;  
    app.scroll_direction = event.currentTarget.name.scroll_direction;
},

/**
 *scroll control for staff
 */
staff_screen_scroll_button_out(event){
    event.currentTarget.alpha = 0.5;
    app.scroll_direction = {x:0, y:0};
},

/**
 * subject avatar click
 */
subject_avatar_click(target_player_id){

    if(target_player_id == app.session_player.id) return;

    // app.session.world_state.tractor_beam_target = player_id;

    //console.log("subject avatar click", player_id);
    app.send_message("tractor_beam", 
                     {"target_player_id" : target_player_id},
                     "group");
},

setup_tractor_beam(source_id, target_id)
{
    let source_player = app.session.world_state.session_players[source_id];
    let target_player = app.session.world_state.session_players[target_id];

    let dY = source_player.current_location.y - target_player.current_location.y;
    let dX = source_player.current_location.x - target_player.current_location.x;

    let myX = source_player.current_location.x;
    let myY = source_player.current_location.y;
    let targetX = target_player.current_location.x;
    let targetY = target_player.current_location.y;
    
    let tempAngle = Math.atan2(dY, dX);
    let tempSlope = (myY - targetY) / (myX - targetX);

    if (myX - targetX == 0) tempSlope = 0.999999999999;

    let tempYIntercept = myY - tempSlope * myX;

    // Rectangle rectTractor;
    let tractorCircles = source_player.pixi.tractor_beam.length;
    let tempScale = 1 / tractorCircles;

    let xIncrement = Math.sqrt(Math.pow(myX - targetX, 2) + Math.pow(myY - targetY, 2)) / tractorCircles;

    for (let i=0; i<tractorCircles; i++)
    {
        let temp_x = (myX - Math.cos(tempAngle) * xIncrement * i);
        let temp_y = (myY - Math.sin(tempAngle) * xIncrement * i);

        tb_sprite = source_player.pixi.tractor_beam[i];
        tb_sprite.position.set(temp_x, temp_y)
        tb_sprite.scale.set(tempScale * i * 2);
        tb_sprite.visible = true;
        
        if (app.pixi_tick_tock.value == 'tick')
        {
            if (i%2 == 0)
            {
                tb_sprite.tint = app.session.session_players[source_id].parameter_set_player.hex_color;
            }
            else
            {
                tb_sprite.tint = 0xFFFFFF;
            }
        }
        else
        {
            if (i%2 == 0)
            {
               tb_sprite.tint = 0xFFFFFF;
            }
            else
            {
                tb_sprite.tint = app.session.session_players[source_id].parameter_set_player.hex_color;
            }
        }
        
        // Color tempC = Color.White;
        // if (Common.gameT2 % 20 >= 10)
        // {
        //     if (i % 2 != 0)
        //     {
        //         tempC = myColor;
        //     }
        // }
        // else
        // {
        //     if (i % 2 == 0)
        //     {
        //         tempC = myColor;
        //     }
        // }

    }
},

/**
 * add text emitters to the screen
 */
add_text_emitters(text, start_x, start_y, end_x, end_y, font_color, font_size, emitter_image){

    let emitter_container = new PIXI.Container();
    emitter_container.position.set(start_x, start_y);
    emitter_container.pivot.set(0.5);
    emitter_container.eventMode = 'none';
    emitter_container.zIndex = 2000;

    let emitter_text = new PIXI.Text(text, {
            fontFamily: 'Arial',
            fontSize: font_size,
            fill: font_color,
            align: 'left',
        });

    emitter_text.anchor.set(0.5);

    emitter_container.addChild(emitter_text);

    if(emitter_image){
        emitter_image.anchor.set(0, 0.5);
        emitter_container.addChild(emitter_image);
        emitter_image.position.set(emitter_text.width/2+5, 0);
    }

    let emitter = {current_location : {x:start_x, y:start_y},
                   target_location : {x:end_x, y:end_y},
                   emitter_container:emitter_container,
                };
    
    app.pixi_text_emitter.push(emitter);
    app.pixi_container_main.addChild(emitter_container);
},

/**
 * move text emitters
 */
move_text_emitters(delta){

    let completed = [];

    //move the emitters
    for(let i = 0; i <  app.pixi_text_emitter.length;  i++){

        let emitter = app.pixi_text_emitter[i];
        
        if(emitter.current_location.x == emitter.target_location.x && 
           emitter.current_location.y == emitter.target_location.y)
        {
            completed.push(i);
        }
        else
        {
            app.move_object(delta, emitter, app.move_speed / 4);
            emitter.emitter_container.position.set(emitter.current_location.x, emitter.current_location.y);
        }       
    }

    //remove the completed emitters
    for(let i=completed.length-1; i>=0; i--){
        app.pixi_text_emitter[completed[i]].emitter_container.destroy();

        app.pixi_text_emitter.splice(completed[i], completed[i]); 
    }
},

/**
 * move the object towards its target location
 */
move_object(delta, obj, move_speed){
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

