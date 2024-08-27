/**
 * add scroll buttons to staff screen
 */
add_scroll_button: function add_scroll_button(button_size, name, text)
{
    let c = new PIXI.Container();

    let g = new PIXI.Graphics();
    
    g.rect(0, 0, button_size.w, button_size.h);

    
    g.fill({color:0xffffff});
    g.stroke(1, 0x000000);

    let label = new PIXI.Text({text:text, 
                               style:{fontFamily : 'Arial',
                                      fontWeight:'bold',
                                      fontSize: 28,       
                                      lineHeight : 14,                             
                                      align : 'center'}});
                                    
    label.pivot.set(label.width/2, label.height/2);
    label.x = button_size.w/2;
    label.y = button_size.h/2-3;

    c.addChild(g);
    c.addChild(label);

    c.pivot.set(button_size.w/2, button_size.h/2);
    c.x = button_size.x;
    c.y = button_size.y;
    c.eventMode = 'static';
    c.label = name;
    c.alpha = 0.5;

    c.on("pointerover", app.staff_screen_scroll_button_over);
    c.on("pointerout", app.staff_screen_scroll_button_out);

    pixi_app.stage.addChild(c);

    return c
},

/**
 * update zoom level on staff screen
 */
update_zoom: function update_zoom()
{
    if(app.pixi_mode == "subject") return;
    if(app.pixi_scale == app.pixi_scale_range_control) return;
    
   
    let zoom_direction = 1;
    if(app.pixi_scale_range_control > app.pixi_scale)
    {
        zoom_direction = -1;
    }

    app.pixi_scale = app.pixi_scale_range_control;
    pixi_container_main.scale.set(app.pixi_scale);
},

/**
 * fit staff display to screen
 */
fit_to_screen: function fit_to_screen()
{
    if(app.pixi_mode == "subject") return;
    
    app.current_location.x = app.stage_width/2;
    app.current_location.y = app.stage_height/2;

    let zoom_factor = Math.min(app.canvas_width / app.stage_width, app.canvas_height / app.stage_height);

    app.pixi_scale_range_control = zoom_factor;
    app.pixi_scale = app.pixi_scale_range_control;
    pixi_container_main.scale.set(app.pixi_scale);
},

/**
 * update the amount of shift needed for the staff view
 */
update_offsets_staff: function update_offsets_staff(delta)
{
    let offset = app.get_offset_staff();

    pixi_container_main.x = -offset.x;
    pixi_container_main.y = -offset.y;   
},

/**
 * manaully scroll staff screen
 */
scroll_staff: function scroll_staff(delta)
{
    app.current_location.x += app.scroll_direction.x;
    app.current_location.y += app.scroll_direction.y;
},

/**
 * staff screen offset from origin
 */
get_offset_staff: function get_offset_staff()
{
    if(app.follow_subject != -1 && app.session.started)
    {
        let obj = app.session.world_state.session_players[app.follow_subject];
        app.current_location = Object.assign({}, obj.current_location);
    }

    return {x:app.current_location.x * app.pixi_scale - pixi_app.screen.width/2,
            y:app.current_location.y * app.pixi_scale - pixi_app.screen.height/2};
},

/**
 *scroll control for staff
 */
 staff_screen_scroll_button_over: function staff_screen_scroll_button_over(event)
{
    event.currentTarget.alpha = 1;  
    app.scroll_direction = event.currentTarget.label.scroll_direction;
},

/**
 *scroll control for staff
 */
 staff_screen_scroll_button_out: function staff_screen_scroll_button_out(event)
{
    event.currentTarget.alpha = 0.5;
    app.scroll_direction = {x:0, y:0};
},
