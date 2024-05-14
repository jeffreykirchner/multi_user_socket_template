/**
 * add text emitters to the screen
 */
add_text_emitters: function add_text_emitters(text, start_x, start_y, end_x, end_y, font_color, font_size, emitter_image)
{
    let emitter_container = new PIXI.Container();
    emitter_container.position.set(start_x, start_y);
    emitter_container.pivot.set(0.5);
    emitter_container.zIndex = 2000;

    let emitter_text = new PIXI.Text({text:text, style:{
            fontFamily: 'Arial',
            fontSize: font_size,
            fill: font_color,
            align: 'left',
        }});

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
    
    pixi_text_emitter[pixi_text_emitter_key++]=emitter;
    pixi_container_main.addChild(emitter_container);
},

/**
 * move text emitters
 */
move_text_emitters: function move_text_emitters(delta)
{
    let completed = [];

    //move the emitters
    for(let i in pixi_text_emitter){

        let emitter = pixi_text_emitter[i];
        
        if(emitter.current_location.x == emitter.target_location.x && 
           emitter.current_location.y == emitter.target_location.y)
        {
            completed.push(i);
        }
        else
        {
            app.move_object(delta, emitter, parseFloat(app.session.parameter_set.avatar_move_speed) / 4);
            emitter.emitter_container.position.set(emitter.current_location.x, emitter.current_location.y);
        }       
    }

    //remove the completed emitters
    for(let i=completed.length-1; i>=0; i--)
    {
        pixi_container_main.removeChild(pixi_text_emitter[completed[i]].emitter_container);
        pixi_text_emitter[completed[i]].emitter_container.destroy({children:true, baseTexture:true});

        delete pixi_text_emitter[completed[i]]; 
    }
},
