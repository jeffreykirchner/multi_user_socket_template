/**
 * setup the pixi components for each subject
 */
setup_pixi_subjects: function setup_pixi_subjects(){

    if(!app.session) return;
    if(!app.session.started) return;
    
    let current_z_index = 1000;
    let current_period_id = app.session.session_periods_order[app.session.world_state.current_period-1];
    for(const i in app.session.world_state.session_players)
    {      
        let subject = app.session.world_state.session_players[i];
        pixi_avatars[i] = {};

        //avatar
        let avatar_container = new PIXI.Container();
        avatar_container.position.set(subject.current_location.x, subject.current_location.y);
        avatar_container.height = 250;
        avatar_container.width = 250;
        avatar_container.eventMode = 'passive';
        avatar_container.name = {player_id : i};
        avatar_container.zIndex=200;
        // avatar_container.on("pointerup", app.subject_avatar_click);

        let gear_sprite = new PIXI.AnimatedSprite(app.pixi_textures.sprite_sheet.animations['walk']);
        gear_sprite.animationSpeed = app.session.parameter_set.avatar_animation_speed;
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
        
        let token_graphic = PIXI.Sprite.from(app.pixi_textures.sprite_sheet_2.textures["cherry_small.png"]);
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

        pixi_avatars[i].status_label = status_label;
        pixi_avatars[i].gear_sprite = gear_sprite;
        pixi_avatars[i].inventory_label = inventory_label;

        avatar_container.scale.set(app.session.parameter_set.avatar_scale);

        //bounding box with avatar scaller        
        let bounding_box = new PIXI.Graphics();
    
        bounding_box.lineStyle(2, "orchid");
        bounding_box.drawRect(0, 0, avatar_container.width * app.session.parameter_set.avatar_bound_box_percent * app.session.parameter_set.avatar_scale, 
                                    avatar_container.height * app.session.parameter_set.avatar_bound_box_percent * app.session.parameter_set.avatar_scale);
        bounding_box.endFill();
        bounding_box.pivot.set(bounding_box.width/2, bounding_box.height/2);
        bounding_box.position.set(0, 0);
        bounding_box.visible = false;

        avatar_container.addChild(bounding_box);
        pixi_avatars[i].bounding_box = bounding_box;

        //bound box view
        let bounding_box_view = new PIXI.Graphics();
    
        bounding_box_view.lineStyle(2, "orchid");
        bounding_box_view.drawRect(0, 0, avatar_container.width * app.session.parameter_set.avatar_bound_box_percent, 
                                    avatar_container.height * app.session.parameter_set.avatar_bound_box_percent);
        bounding_box_view.endFill();
        bounding_box_view.pivot.set(bounding_box_view.width/2, bounding_box_view.height/2);
        bounding_box_view.position.set(0, 0);

        avatar_container.addChild(bounding_box_view);
        
        if(!app.draw_bounding_boxes)
        {
            bounding_box_view.visible = false;
        }

        pixi_avatars[i].avatar = {};
        pixi_avatars[i].avatar_container = avatar_container;

        pixi_container_main.addChild(pixi_avatars[i].avatar_container);

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

        chat_bubble_text.position.set(-14 * app.session.parameter_set.avatar_scale, -chat_container.height*.09)
        chat_bubble_text.anchor.set(0.5);
        
        pixi_avatars[i].chat = {};
        pixi_avatars[i].chat.container = chat_container;
        pixi_avatars[i].chat.bubble_text = chat_bubble_text;
        pixi_avatars[i].chat.bubble_sprite = chat_bubble_sprite;
        pixi_avatars[i].chat.container.zIndex = current_z_index++;

        subject.show_chat = false;
        subject.chat_time = null;

        pixi_container_main.addChild(pixi_avatars[i].chat.container);

        //tractor beam
        pixi_avatars[i].tractor_beam = [];
        subject.tractor_beam_target = null;

        for(let j=0; j<15; j++)
        {
            let tractor_beam_sprite = PIXI.Sprite.from(app.pixi_textures.sprite_sheet_2.textures["particle2.png"]);
            tractor_beam_sprite.anchor.set(0.5);
            tractor_beam_sprite.eventMode = 'passive';
            tractor_beam_sprite.visible = false;
            tractor_beam_sprite.zIndex = 1500;
            pixi_avatars[i].tractor_beam.push(tractor_beam_sprite);
            pixi_container_main.addChild(tractor_beam_sprite);
        }

        //interaction range
        let interaction_container = new PIXI.Container();
        interaction_container.position.set(subject.current_location.x, subject.current_location.y);

        let interaction_range = new PIXI.Graphics();
        let interaction_range_radius = app.session.parameter_set.interaction_range;

        interaction_range.lineStyle({width:1, color:app.session.session_players[i].parameter_set_player.hex_color, alignment:0});
        interaction_range.beginFill(0xFFFFFF,0);
        interaction_range.drawCircle(0, 0, interaction_range_radius);
        interaction_range.endFill();    
        interaction_range.zIndex = 100;

        interaction_container.addChild(interaction_range);
        pixi_avatars[i].interaction_container = interaction_container;
        pixi_container_main.addChild(pixi_avatars[i].interaction_container);

        if(app.pixi_mode != "subject")
        {
            //view range for server
            let view_container = new PIXI.Container();
            view_container.position.set(subject.current_location.x, subject.current_location.y);

            let view_range = new PIXI.Graphics();
            // view_range.lineStyle({width:2, color:app.session.session_players[i].parameter_set_player.hex_color, alignment:0});
            view_range.beginFill(app.session.session_players[i].parameter_set_player.hex_color,0.1);
            view_range.drawRect(0, 0, 1850, 800);
            view_range.endFill();    
            view_range.zIndex = 75;
            view_range.pivot.set(1850/2, 800/2);
            view_range.position.set(0, 0);

            view_container.addChild(view_range);
            pixi_avatars[i].view_container = view_container;
            pixi_container_main.addChild(pixi_avatars[i].view_container);
        }

    }

    //make local subject the top layer
    if(app.pixi_mode=="subject")
    {  
        pixi_avatars[app.session_player.id].avatar_container.zIndex = 999;
        pixi_avatars[app.session_player.id].chat.container.zIndex = current_z_index;
    }
},

/**
 * destory pixi subject objects in world state
 */
destory_setup_pixi_subjects: function destory_setup_pixi_subjects()
{
    if(!app.session) return;

    for(const i in app.session.world_state.session_players){

        let pixi_objects = pixi_avatars[i];

        if(pixi_objects)
        {
            pixi_objects.avatar_container.destroy();
            pixi_objects.chat.container.destroy();
            pixi_objects.interaction_container.destroy();

            if(app.pixi_mode != "subject")
            {
                pixi_objects.view_container.destroy();
            }
        }
    }
},

/**
 * subject avatar click
 */
subject_avatar_click: function subject_avatar_click(target_player_id)
{
    if(target_player_id == app.session_player.id) return;

    // console.log("subject avatar click", target_player_id);

    app.send_message("tractor_beam", 
                     {"target_player_id" : target_player_id},
                     "group");
},

/**
 * update the inventory of the player
 */
update_player_inventory: function update_player_inventory()
{

    let period_id = app.session.session_periods_order[app.session.world_state.current_period-1];

    for(const i in app.session.session_players_order)
    {
        const player_id = app.session.session_players_order[i];
        pixi_avatars[player_id].inventory_label.text = app.session.world_state.session_players[player_id].inventory[period_id];
    }
},

/**
 * send interaction to server
 */
send_interaction: function send_interaction()
{
    app.clear_main_form_errors();

    let errors = {};

    if(!app.interaction_form.direction || app.interaction_form.direction == "")
    {
        errors["direction"] = ["Choose a direction"];
    }

    if(!app.interaction_form.amount || app.interaction_form.amount < 1)
    {
        errors["amount"] = ["Invalid amount"];
    }

    if(Object.keys(errors).length > 0)
    {
        app.display_errors(errors);
        return;
    }

    app.working = true;

    app.send_message("interaction", 
                    {"interaction" : app.interaction_form},
                     "group"); 
},

/**
 * result of subject activating tractor beam
 */
take_update_tractor_beam: function take_update_tractor_beam(message_data)
{
    let player_id = message_data.player_id;
    let target_player_id = message_data.target_player_id;

    app.session.world_state.session_players[player_id].tractor_beam_target = target_player_id;

    app.session.world_state.session_players[player_id].frozen = true
    app.session.world_state.session_players[target_player_id].frozen = true

    app.session.world_state.session_players[player_id].interaction = app.session.parameter_set.interaction_length;
    app.session.world_state.session_players[target_player_id].interaction = app.session.parameter_set.interaction_length;

    if(app.is_subject)
    {
        if(player_id == app.session_player.id)
        {
            app.clear_main_form_errors();
            app.interaction_form.direction = null;
            app.interaction_form.amount = null;
            app.interaction_modal.toggle();
        }
    }
},

/**
 * take update from server about interactions
 */
take_update_interaction: function take_update_interaction(message_data)
{
    if(message_data.status == "fail")
    {
        if(message_data.source_player_id == app.session_player.id)
        {
            let errors = {};
            errors["direction"] = [message_data.error_message];
            app.display_errors(errors);
            app.working = false;            
        }
    }
    else
    {
        let currnent_period_id = app.session.session_periods_order[app.session.world_state.current_period-1];

        let source_player_id = message_data.source_player_id;
        let target_player_id = message_data.target_player_id;

        let source_player = app.session.world_state.session_players[source_player_id];
        let target_player = app.session.world_state.session_players[target_player_id];

        let period = message_data.period;

        //update status
        source_player.tractor_beam_target = null;

        source_player.frozen = false
        target_player.frozen = false
    
        source_player.interaction = 0;
        target_player.interaction = 0;

        source_player.cool_down = app.session.parameter_set.cool_down_length;
        target_player.cool_down = app.session.parameter_set.cool_down_length;

        //update inventory
        source_player.inventory[period] = message_data.source_player_inventory;
        target_player.inventory[period] = message_data.target_player_inventory;
        
        pixi_avatars[source_player_id].inventory_label.text = source_player.inventory[currnent_period_id];
        pixi_avatars[target_player_id].inventory_label.text = target_player.inventory[currnent_period_id];

        //add transfer beam
        if(message_data.direction == "give")
        {
            app.add_transfer_beam(source_player.current_location, 
                                target_player.current_location,
                                app.pixi_textures.sprite_sheet_2.textures["cherry_small.png"],
                                message_data.source_player_change,
                                message_data.target_player_change);
        }
        else
        {
            app.add_transfer_beam(target_player.current_location, 
                                source_player.current_location,
                                app.pixi_textures.sprite_sheet_2.textures["cherry_small.png"],
                                message_data.target_player_change,
                                message_data.source_player_change);
        }

        if(app.pixi_mode=="subject")
        {
            if(message_data.source_player_id == app.session_player.id)
            {
                app.working = false;
                app.interaction_modal.hide();
            }
        }
    }
},

/** hide choice grid modal modal
*/
hide_interaction_modal: function hide_interaction_modal(){
    
},

/**
 * cancel interaction in progress
 */
cancel_interaction:function cancel_interaction()
{
    session_player = app.session.world_state.session_players[app.session_player.id];

    if(session_player.interaction == 0)
    {        
        app.interaction_modal.hide();
        return;
    }

    app.working = true;
    app.send_message("cancel_interaction", 
                    {},
                     "group"); 
},

take_update_cancel_interaction: function take_update_cancel_interaction(message_data)
{
    let source_player_id = message_data.source_player_id;
    let target_player_id = message_data.target_player_id;

    let source_player = app.session.world_state.session_players[source_player_id];
    let target_player = app.session.world_state.session_players[target_player_id];

    source_player.tractor_beam_target = null;

    source_player.frozen = false
    target_player.frozen = false

    source_player.interaction = 0;
    target_player.interaction = 0;

    if(app.is_subject)
    {
        if(source_player_id == app.session_player.id)
        {
            app.working = false;
            app.interaction_modal.hide();
        }
    }
}, 

/**
 * send movement update to server
 */
target_location_update: function target_location_update()
{

    let session_player = app.session.world_state.session_players[app.session_player.id];

    app.send_message("target_location_update", 
                    {"target_location" : session_player.target_location, 
                     "current_location" : session_player.current_location},
                     "group");                   
},

/**
 * take update from server about new location target for a player
 */
take_target_location_update: function take_target_location_update(message_data)
{
    if(message_data.value == "success")
    {
        app.session.world_state.session_players[message_data.session_player_id].target_location = message_data.target_location;                 
    } 
    else
    {
        
    }
},

/**
 * update tractor beam between two players
 */
setup_tractor_beam: function setup_tractor_beam(source_id, target_id)
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
    let tractorCircles = pixi_avatars[source_id].tractor_beam.length;
    let tempScale = 1 / tractorCircles;

    let xIncrement = Math.sqrt(Math.pow(myX - targetX, 2) + Math.pow(myY - targetY, 2)) / tractorCircles;

    for (let i=0; i<tractorCircles; i++)
    {
        let temp_x = (myX - Math.cos(tempAngle) * xIncrement * i);
        let temp_y = (myY - Math.sin(tempAngle) * xIncrement * i);

        tb_sprite = pixi_avatars[source_id].tractor_beam[i];
        tb_sprite.position.set(temp_x, temp_y)
        tb_sprite.scale.set(tempScale * i);
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

    }
},

/**
 * move players if target does not equal current location
 */
move_player: function move_player(delta)
{
    if(!app.session.world_state.started) return;

    //move players
    for(let i in app.session.world_state.session_players){

        let obj = app.session.world_state.session_players[i];
        // let avatar = app.session.world_state.avatars[i];
        let avatar_container = pixi_avatars[i].avatar_container;
        let gear_sprite = pixi_avatars[i].gear_sprite;
        let status_label = pixi_avatars[i].status_label;

        if(obj.target_location.x !=  obj.current_location.x ||
            obj.target_location.y !=  obj.current_location.y )
        {           
            //move player towards target
            if(!obj.frozen)
            {
                app.move_avatar(delta,i);
            }

            //update the sprite locations
            gear_sprite.play();
            avatar_container.position.set(obj.current_location.x, obj.current_location.y);
            if (obj.current_location.x < obj.target_location.x )
            {
                gear_sprite.animationSpeed =  app.session.parameter_set.avatar_animation_speed;
            }
            else
            {
                gear_sprite.animationSpeed = -app.session.parameter_set.avatar_animation_speed;
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
            gear_sprite.stop();
        }

        //update status
        if(obj.interaction > 0)
        {
            status_label.text = "Interaction ... " + obj.interaction;
            status_label.visible = true;
        }
        else if(obj.cool_down > 0)
        {
            status_label.text = "Cooling ... " + obj.cool_down;
            status_label.visible = true;
        }
        else
        {
            status_label.visible = false;
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
        let chat_container = pixi_avatars[i].chat.container;
        let chat_bubble_sprite = pixi_avatars[i].chat.bubble_sprite;
        // let avatar_container = obj.pixi.chat_container;
        let offset = {x:chat_container.width*.5, y:chat_container.height*.45};

        if(obj.nearest_player && 
           app.session.world_state.session_players[obj.nearest_player].current_location.x < obj.current_location.x)
        {
            chat_container.position.set(obj.current_location.x + offset.x,
                                        obj.current_location.y - offset.y);
            
            chat_bubble_sprite.scale.x = 1;
        }
        else
        {
            chat_container.position.set(obj.current_location.x - offset.x,
                                        obj.current_location.y - offset.y);

            chat_bubble_sprite.scale.x = -1;
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
            for (let j=0; j< pixi_avatars[i].tractor_beam.length; j++)
            {
                tb_sprite = pixi_avatars[i].tractor_beam[j];
                tb_sprite.visible = false;
            }
        }
    }

    for(let i in app.session.world_state.session_players)
    {
        let obj = app.session.world_state.session_players[i];

        //update interaction ranges
        let interaction_container = pixi_avatars[i].interaction_container;
        interaction_container.position.set(obj.current_location.x, obj.current_location.y);

        //update view ranges on staff screen
        if(app.pixi_mode != "subject")
        {
            let view_container = pixi_avatars[i].view_container;
            view_container.position.set(obj.current_location.x, obj.current_location.y);
        }
    }
    
},
