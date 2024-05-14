/**
 * setup subject screen status overlay
 */
setup_subject_status_overlay: function setup_subject_status_overlay()
{
    if(!app.session) return;
    if(app.pixi_mode!="subject") return;
    if(subject_status_overlay.container)
    {
        pixi_app.stage.removeChild(subject_status_overlay.container);
        subject_status_overlay.container.destroy({children:true, baseTexture:true});
    }

    subject_status_overlay.container = new PIXI.Container();
    subject_status_overlay.container.zIndex = 9999

    let temp_y = 0;

    let text_style = {
        fontFamily: 'Arial',
        fontSize: 28,
        fill: 'white',
        align: 'left',
        stroke: {color:'black', width: 2},
    };

    //labels
    //current period
    let current_period_text = new PIXI.Text({text:'Current Period:', style:text_style});

    subject_status_overlay.container.addChild(current_period_text);
    current_period_text.position.set(0, temp_y);

    temp_y += current_period_text.height+5;

    //time remaining
    let time_remaining_text = new PIXI.Text({text:'Time Remaining:', style:text_style}); 

    subject_status_overlay.container.addChild(time_remaining_text);
    time_remaining_text.position.set(0, temp_y);

    temp_y += time_remaining_text.height+5;

    //profit
    let profit_text = new PIXI.Text({text:'Total Profit (¢):', style:text_style});

    subject_status_overlay.container.addChild(profit_text);
    profit_text.position.set(0, temp_y);

    //amounts
    temp_y = 0;

    //current period 
    let current_period_label = new PIXI.Text({text:'NN', style:text_style});

    subject_status_overlay.current_period_label = current_period_label;;
    subject_status_overlay.container.addChild(current_period_label);
    current_period_label.position.set(time_remaining_text.width+10, temp_y);

    temp_y += current_period_text.height+5;

    //time remaining 
    let time_remaining_label = new PIXI.Text({text:'00:00', style:text_style});

    subject_status_overlay.time_remaining_label = time_remaining_label;
    subject_status_overlay.container.addChild(time_remaining_label);
    time_remaining_label.position.set(time_remaining_text.width+10, temp_y);

    temp_y += time_remaining_text.height+5;

    //profit
    let profit_label = new PIXI.Text({text:'0000', style:text_style});

    subject_status_overlay.profit_label = profit_label;
    subject_status_overlay.container.addChild(profit_label);
    profit_label.position.set(time_remaining_text.width+10, temp_y);

    subject_status_overlay.container.position.set(pixi_app.screen.width - subject_status_overlay.container.width-20, 20);
    
    pixi_app.stage.addChild(subject_status_overlay.container);

    app.update_subject_status_overlay();
},

/**
 * update subject overlay
 */
update_subject_status_overlay: function update_subject_status_overlay()
{
    if(!app.session) return;
    if(!app.session.world_state.hasOwnProperty('started')) return;

    if(!subject_status_overlay.container) return;
    // subject_status_overlay.container.position.set(pixi_app.screen.width - subject_status_overlay.container.width-20, 20);

    subject_status_overlay.current_period_label.text = app.session.world_state.current_period;
    subject_status_overlay.time_remaining_label.text = app.session.world_state.time_remaining;
    subject_status_overlay.profit_label.text = app.session.world_state.session_players[app.session_player.id].earnings;
},