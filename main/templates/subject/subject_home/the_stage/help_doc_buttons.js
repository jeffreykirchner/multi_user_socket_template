/**
 * add help doc buttons to subject screen
 * @param {object} button_location - the location to place the button
 * @param {object} popup_location - the location to place the popup text
 * @param {string} help_doc - the name of the help doc to link to the button
 */
add_help_doc_button: function add_help_doc_button(button_location, popup_location, help_doc)
{

    //check if the help doc exists in the instructions, if not, return
    if(help_doc in app.help_docs) return;

    //button container
    let button_container = new PIXI.Container();

    let g = new PIXI.Graphics();

    g.ellipse(15, 15, 15, 15);

    g.fill({color:"yellow"});
    g.stroke(1, 0x000000);

    let help_graphic = new PIXI.Sprite(app.pixi_textures['help_tex']);    

    button_container.addChild(g);
    button_container.addChild(help_graphic);

    if(app.is_subject) button_container.eventMode = 'static';
    button_container.label = help_doc;
    button_container.alpha = 0.75;
    button_container.position.set(button_location.x-help_graphic.width/2, 
                                  button_location.y-help_graphic.height/2);
    button_container.zIndex = 100;

    button_container.on("pointerover", app.help_doc_button_over);
    button_container.on("pointerout", app.help_doc_button_out);
    button_container.on("pointerdown", app.help_doc_button_click);

    //text container
    let html_text = "";
    for(let i in app.instructions.help_docs_subject)
    {
        let t = app.instructions.help_docs_subject[i];
        if(t.title == help_doc)
        {
            html_text = t.text;
            break;
        }
    }

    let text_container = new PIXI.Container();
    let text_container_width = 400;

    let pixi_text = new PIXI.HTMLText({text: html_text,
                                    style: {fontFamily: 'Arial',
                                            fontSize: 14,
                                            wordWrap: true,      // Enable word wrapping
                                            wordWrapWidth: text_container_width-10,  // Set the maximum width for the text
                            }});
    
    

    // pixi_text.pivot.set(pixi_text.width/2, pixi_text.height/2);

    // text_container.addChild(text_bg);
    text_container.addChild(pixi_text);

    let text_bg = new PIXI.Graphics();
    text_bg.roundRect(0, 0, text_container.width+10, text_container.height+5, 10);
    text_bg.fill({color: 0xFFFFFF});
    text_bg.stroke({width: 1, color: 0x000000});

    text_container.addChildAt(text_bg, 0);

    // pixi_text.x = text_container.width / 2;
    // pixi_text.y = text_container.height / 2;

    pixi_text.x = 5;
    pixi_text.y = 2;

    text_container.position.set(popup_location.x - text_container.width / 2, 
                                popup_location.y - text_container.height / 2);
    text_container.zIndex = 1;    

    app.help_docs[help_doc] = {};
    app.help_docs[help_doc].button_container = button_container;
    app.help_docs[help_doc].time_remaining = 0;
    app.help_docs[help_doc].text_container = text_container;

    pixi_container_main.addChild(button_container);
    pixi_container_main.addChild(text_container);

    text_container.visible = false;
},

strip_html: function strip_html(html) {
   const doc = new DOMParser().parseFromString(html, 'text/html');
   return doc.body.textContent || '';
},

/**
 *roll into help doc buttons
 *@param {object} event - the event object from the pointerover event
 */
 help_doc_button_over: function help_doc_button_over(event)
{
    event.currentTarget.alpha = 1;  
},

/**
 *roll out of help doc buttons
 *@param {object} event - the event object from the pointerout event
 */
 help_doc_button_out: function help_doc_button_out(event)
{
    event.currentTarget.alpha = 0.75;
},

/**
 * click help doc buttons
 * @param {object} event - the event object from the pointerdown event
 */
help_doc_button_click: function help_doc_button_click(event)
{
    let help_doc = event.currentTarget.label;
    app.help_doc_button_click_action(help_doc);
},

/*
*help doc button click action
*/
help_doc_button_click_action: function help_doc_button_click_action(help_doc)
{
    let local_player = app.session.world_state.session_players[app.session_player.id];
    
    if(app.help_docs[help_doc].text_container.visible)
    {
        app.help_docs[help_doc].text_container.visible = false;
    }
    else
    {
        // app.help_docs[help_doc].text_container.visible = true;
        // app.help_docs[help_doc].time_remaining = 15;

        if(app.session.world_state.current_experiment_phase != "Instructions")
        {
            if(app.working) return;
            app.working = true;

            app.send_message("show_help_doc", 
                            {"help_doc": help_doc},    
                             "group");
        }
        else
        {
            //show error message that help docs are not available during instructions phase
             app.add_text_emitters("Error: Disabled during the instructions phase.", 
                                local_player.current_location.x, 
                                local_player.current_location.y,
                                local_player.current_location.x,
                                local_player.current_location.y-100,
                                0xFFFFFF,
                                28,
                                null);
        }
    }
},

/**
 * after each clock tick, reduce the time remaining for each help doc and hide the text container if time runs out
 *
 */
clock_tick_help_doc_buttons: function update_help_doc_buttons()
{
    for(let i in app.help_docs)
    {
        if(app.help_docs[i].time_remaining > 0)
        {
            app.help_docs[i].time_remaining -= 1;
            if(app.help_docs[i].time_remaining <= 0)
            {
                app.help_docs[i].text_container.visible = false;
            }
        }
    }
},

/**
 * take update show help doc message from server and update the time remaining for the help doc
 * @param {object} message_data - the data from the server message
 */
take_update_show_help_doc: function take_update_show_help_doc(message_data)
{
    let session_player_id = message_data.session_player_id;

    if(app.is_subject && app.session_player.id == session_player_id)
    {
        app.working = false;
    }

    let help_doc = message_data.help_doc;
    if(app.help_docs[help_doc])
    {
        app.help_docs[help_doc].time_remaining = 40;
        app.help_docs[help_doc].text_container.visible = true;
    }
    
},