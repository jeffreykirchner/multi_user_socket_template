{% load static %}

/**
 * update the pixi players with new info
 */
setup_pixi(){    
    app.reset_pixi_app();

    PIXI.Assets.add('sprite_sheet', '{% static "sprite_sheet.json" %}');
    PIXI.Assets.add('bg_tex', '{% static "background_tile_low.jpg"%}');

    const textures_promise = PIXI.Assets.load(['sprite_sheet', 'bg_tex']);

    textures_promise.then((textures) => {
        app.setup_pixi_sheets(textures);
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

    // app.pixi_app = new PIXI.Application({
    //     background: '#999',
    //     resizeTo: window,
    // });
    //document.body.appendChild(app.pixi_app.view);

    // The stage will handle the move events
    app.pixi_app.stage.eventMode = 'static';
    app.pixi_app.stage.hitArea = app.pixi_app.screen;

    app.canvas_width = canvas.width;
    app.canvas_height = canvas.height;
},

/** load pixi sprite sheets
*/
setup_pixi_sheets(textures){

    app.sprite_sheet = textures.sprite_sheet;
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
        tiling_sprite.on("pointerup", app.subjectPointerUp);
               
        app.pixi_target = new PIXI.Graphics();
        app.pixi_target.lineStyle(3, 0x000000);
        app.pixi_target.alpha = 0.33;
        app.pixi_target.drawCircle(0, 0, 10);
        app.pixi_target.eventMode='static';

        //app.pixi_target.scale.set(app.pixi_scale, app.pixi_scale);
        app.background.addChild(app.pixi_target)
    }

    

    // staff controls
    // if(app.pixi_mode=="staff"){

    //     app.scroll_button_up = app.addScrollButton({w:50, h:30, x:app.pixi_app.screen.width/2, y:30}, 
    //                                                {scroll_direction:{x:0,y:-app.scroll_speed}}, 
    //                                                "↑↑↑");
    //     app.scroll_button_down = app.addScrollButton({w:50, h:30, x:app.pixi_app.screen.width/2, y:app.pixi_app.screen.height - 30}, 
    //                                                  {scroll_direction:{x:0,y:app.scroll_speed}}, 
    //                                                  "↓↓↓");

    //     app.scroll_button_left = app.addScrollButton({w:30, h:50, x:30, y:app.pixi_app.screen.height/2}, 
    //                                                  {scroll_direction:{x:-app.scroll_speed,y:0}}, 
    //                                                  "←\n←\n←");

    //     app.scroll_button_right = app.addScrollButton({w:30, h:50, x:app.pixi_app.screen.width - 30, y:app.pixi_app.screen.height/2}, 
    //                                                   {scroll_direction:{x:app.scroll_speed,y:0}}, 
    //                                                   "→\n→\n→");
        
    // }

    //start game loop
    app.pixi_app.ticker.add(app.gameLoop);
},

    // Handler for pointermove
    moveDrag(event) {
        sprite.x = event.global.x - offset.x;
      sprite.y = event.global.y - offset.y;
    },
    
    // Sprite handler to start dragging
    startDrag(event) {
        app.stage.cursor = 'pointer';
        const dragTarget = event.target;
        dragTarget.toLocal(event.global, null, offset);
      offset.x *= dragTarget.scale.x;
      offset.y *= dragTarget.scale.y;
        // app.stage.on('pointermove', app.moveDrag);
    },
    
    // Sprite handler to stop dragging
    stopDrag() {
      app.stage.cursor = null;
        // app.stage.off('pointermove', app.moveDrag);
    },

addScrollButton(button_size, name, text){

    let g = new PIXI.Graphics();
    g.lineStyle(1, 0x000000);
    g.beginFill(0xffffff);
    g.drawRect(0, 0, button_size.w, button_size.h);
    g.pivot.set(button_size.w/2, button_size.h/2);
    g.endFill();
    g.lineStyle(1, 0x000000);
    g.x=button_size.x;
    g.y=button_size.y;
    g.interactive=true;
    g.alpha = 0.5;
    g.name = name;

    g.on("pointerover", app.staffScreenScrollButtonOver);
    g.on("pointerout", app.staffScreenScrollButtonOut);

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

gameLoop(delta){
    if(app.pixi_mode=="subject")
    {
        app.movePlayer(delta);
    }
    
    if(app.pixi_mode=="staff")
    {
         app.scrollStaff(delta);
    }       

    app.updateOffsets(delta);
},

updateZoom(){
    app.background.scale.set(app.pixi_scale, app.pixi_scale);
    //app.background.x += (app.background.x*app.pixi_scale);
   // app.background.y += (app.background.y*app.pixi_scale);

    if(app.pixi_mode=="subject")
    {
        app.pixi_target.scale.set(app.pixi_scale, app.pixi_scale);

        // app.pixi_target.x *= app.pixi_scale;
        // app.pixi_target.y *= app.pixi_scale;

        // app.current_location.x *= app.pixi_scale;
        // app.current_location.y *= app.pixi_scale;

        // app.target_location.x *= app.pixi_scale;
        // app.target_location.y *= app.pixi_scale;
    }
},

movePlayer(delta){

    if(app.target_location.x !=  app.current_location.x ||
       app.target_location.y !=  app.current_location.y )
    {
        
        let noX = false;
        let noY = false;
        let temp_move_speed = (app.move_speed * delta);

        let temp_angle = Math.atan2(app.target_location.y - app.current_location.y,
                                    app.target_location.x - app.current_location.x)

        if(!noY){
            if(Math.abs(app.target_location.y - app.current_location.y) < temp_move_speed)
                app.current_location.y = app.target_location.y;
            else
                app.current_location.y += temp_move_speed * Math.sin(temp_angle);
        }

        if(!noX){
            if(Math.abs(app.target_location.x - app.current_location.x) < temp_move_speed)
                app.current_location.x = app.target_location.x;
            else
                app.current_location.x += temp_move_speed * Math.cos(temp_angle);        
        }
    }

},

updateOffsets(delta){
    
    offset = app.getOffset();

    app.background.x = -offset.x;
    app.background.y = -offset.y;
    
    if(app.pixi_mode=="subject")
    {
        app.pixi_target.x = app.target_location.x;
        app.pixi_target.y = app.target_location.y;
    }
},

scrollStaff(delta){

    app.current_location.x += app.scroll_direction.x;
    app.current_location.y += app.scroll_direction.y;
},

getOffset(){
    return {x:app.current_location.x * app.pixi_scale - app.pixi_app.screen.width/2,
            y:app.current_location.y * app.pixi_scale - app.pixi_app.screen.height/2};
},

/**
 *pointer up on subject screen
 */
subjectPointerUp(event){

    let local_pos = event.data.getLocalPosition(event.currentTarget);
    app.target_location.x = local_pos.x;
    app.target_location.y = local_pos.y;
    
},

/**
 *scroll control for staff
 */
staffScreenScrollButtonOver(event){
    event.currentTarget.alpha = 1;  
    app.scroll_direction = event.currentTarget.name.scroll_direction;
},

/**
 *scroll control for staff
 */
staffScreenScrollButtonOut(event){
    event.currentTarget.alpha = 0.5;
    app.scroll_direction = {x:0, y:0};
},

