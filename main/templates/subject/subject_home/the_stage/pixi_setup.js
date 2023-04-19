{% load static %}

/**
 * update the pixi players with new info
 */
setup_pixi(){    
    app.reset_pixi_app();

    PIXI.Assets.add('sprite_sheet', '{% static "gear_3_animated.json" %}');
    PIXI.Assets.add('sprite_sheet_2', '{% static "sprite_sheet.json" %}');
    PIXI.Assets.add('bg_tex', '{% static "background_tile_low.jpg"%}');

    const textures_promise = PIXI.Assets.load(['sprite_sheet', 'bg_tex', 'sprite_sheet_2']);

    textures_promise.then((textures) => {
        app.setup_pixi_sheets(textures);
        app.setup_pixi_subjects();
    });
},

reset_pixi_app(){    

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
},

/** load pixi sprite sheets
*/
setup_pixi_sheets(textures){

    app.pixi_textures = textures;
    app.background_tile_tex = textures.bg_tex;

    app.background = new PIXI.Graphics();
    app.background.beginFill(0xffffff);
    app.background.drawRect(0, 0, app.stage_width, app.stage_height);
    app.background.endFill();
    app.background.eventMode ='static';

    app.pixi_app.stage.addChild(app.background);

    let tiling_sprite = new PIXI.TilingSprite(
        textures.bg_tex,
        app.stage_width,
        app.stage_height,
    );
    tiling_sprite.position.set(0,0);
    app.background.addChild(tiling_sprite);

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
        app.background.addChild(app.pixi_target)
    }
    else
    {
        tiling_sprite.on("onwheel", app.staff_onwheel);
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

    //start game loop
    app.pixi_app.ticker.add(app.game_loop);
},

/**
 * setup the pixi components for each subject
 */
setup_pixi_subjects(){
    
    for(const i in app.session.world_state.session_players){       

        let subject = app.session.world_state.session_players[i];
        subject.pixi = {};

        //avatar
        let avatar_container = new PIXI.Container();
        avatar_container.position.set(subject.current_location.x, subject.current_location.y);
        avatar_container.height = 250;
        avatar_container.width = 250;
        avatar_container.eventMode = 'static';

        let gear_sprite = new PIXI.AnimatedSprite(app.pixi_textures.sprite_sheet.animations['walk']);
        gear_sprite.animationSpeed = app.animation_speed;
        gear_sprite.anchor.set(0.5)
        gear_sprite.tint = app.session.session_players[i].parameter_set_player.hex_color;
        gear_sprite.eventMode = 'none';

        let face_sprite = PIXI.Sprite.from(app.pixi_textures.sprite_sheet_2.textures["face_1.png"]);
        face_sprite.anchor.set(0.5);
        face_sprite.eventMode = 'none';

        avatar_container.addChild(gear_sprite);
        avatar_container.addChild(face_sprite);

        subject.pixi.avatar_container = avatar_container;
        app.background.addChild(subject.pixi.avatar_container);

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
        subject.show_chat = false;
        subject.chat_time = null;

        app.background.addChild(subject.pixi.chat_container);
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

add_scroll_button(button_size, name, text){

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

game_loop(delta){
    
    app.move_player(delta);

    if(app.pixi_mode=="subject")
    {   
        app.update_offsets_player(delta);
    }
    
    if(app.pixi_mode=="staff")
    {
        app.update_offsets_staff(delta);
        app.scroll_staff(delta);
    }       
},

update_zoom(){

    app.background.scale.set(app.pixi_scale);
   
    // app.current_location.x += ( app.pixi_scale * app.pixi_app.screen.width/2);
    // app.current_location.y += ( app.pixi_scale * app.pixi_app.screen.height/2);


    //app.background.x += (app.background.x*app.pixi_scale);
   // app.background.y += (app.background.y*app.pixi_scale);

    // if(app.pixi_mode=="subject")
    // {
    //     app.pixi_target.scale.set(app.pixi_scale, app.pixi_scale);

    //     // app.pixi_target.x *= app.pixi_scale;
    //     // app.pixi_target.y *= app.pixi_scale;

    //     // app.current_location.x *= app.pixi_scale;
    //     // app.current_location.y *= app.pixi_scale;

    //     // app.target_location.x *= app.pixi_scale;
    //     // app.target_location.y *= app.pixi_scale;
    // }
},

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

move_player(delta){

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
},

/**
 * update the amount of shift needed to center the player
 */
update_offsets_player(delta){
    
    offset = app.get_offset();

    app.background.x = -offset.x;
    app.background.y = -offset.y;   
    
    obj = app.session.world_state.session_players[app.session_player.id];

    app.pixi_target.x = obj.target_location.x;
    app.pixi_target.y = obj.target_location.y;
    
},

/**
 * update the amount of shift needed for the staff view
 */
update_offsets_staff(delta){
    
    offset = app.current_location;

    app.background.x = -offset.x;
    app.background.y = -offset.y;   
},


scroll_staff(delta){

    app.current_location.x += app.scroll_direction.x;
    app.current_location.y += app.scroll_direction.y;
},

get_offset(){
    obj = app.session.world_state.session_players[app.session_player.id];

    return {x:obj.current_location.x * app.pixi_scale - app.pixi_app.screen.width/2,
            y:obj.current_location.y * app.pixi_scale - app.pixi_app.screen.height/2};
},

/**
 *pointer up on subject screen
 */
subject_pointer_up(event){

    obj = app.session.world_state.session_players[app.session_player.id];

    let local_pos = event.data.getLocalPosition(event.currentTarget);
    obj.target_location.x = local_pos.x;
    obj.target_location.y = local_pos.y;

    app.target_location_update();
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
 * mouse wheel event for staff screen
 */
staff_onwheel(event){

   
},

