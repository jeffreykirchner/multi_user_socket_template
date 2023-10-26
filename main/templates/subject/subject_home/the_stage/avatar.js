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

        avatar_container.scale.set(app.session.parameter_set.avatar_scale);

        //bounding box outline
        if(app.draw_bounding_boxes)
        {
            let bounding_box = new PIXI.Graphics();
        
            bounding_box.width = avatar_container.width;
            bounding_box.height = avatar_container.height;
            bounding_box.lineStyle(1, 0x000000);
            //bounding_box.beginFill(0xBDB76B);
            bounding_box.drawRect(0, 0, avatar_container.width * app.session.parameter_set.avatar_bound_box_percent * app.session.parameter_set.avatar_scale, 
                                        avatar_container.height * app.session.parameter_set.avatar_bound_box_percent * app.session.parameter_set.avatar_scale);
            bounding_box.endFill();
            bounding_box.pivot.set(bounding_box.width/2, bounding_box.height/2);
            bounding_box.position.set(0, 0);

            avatar_container.addChild(bounding_box);
        }

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

        pixi_avatars[i].chat_container = chat_container;
        pixi_avatars[i].chat_container.zIndex = current_z_index++;

        subject.show_chat = false;
        subject.chat_time = null;

        pixi_container_main.addChild(pixi_avatars[i].chat_container);

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
        pixi_avatars[app.session_player.id].chat_container.zIndex = current_z_index;
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
            pixi_objects.chat_container.destroy();
            pixi_objects.interaction_container.destroy();

            if(app.pixi_mode != "subject")
            {
                pixi_objects.view_container.destroy();
            }
        }
    }
},