/**
 * create transfer beam between two points
 */
add_transfer_beam: function add_transfer_beam(source_location, target_location, elements, show_source_emitter=true, show_target_emitter=true) //beam_texture, source_amount, target_amount
{
    if(elements.length == 0) return;

    let transfer_beam = {source_location:source_location, 
                         target_location:target_location, 
                         elements,
                         beam_images:[],
                         show_source_emitter:show_source_emitter,
                         show_target_emitter:show_target_emitter,}    

    let dY = target_location.y - source_location.y;
    let dX = target_location.x - source_location.x;

    let myX = target_location.x;
    let myY = target_location.y;
    let targetX = source_location.x;
    let targetY = source_location.y;
    
    let tempAngle = Math.atan2(dY, dX);
    let tempSlope = (myY - targetY) / (myX - targetX);

    if (myX - targetX == 0) tempSlope = 0.999999999999;

    let tempYIntercept = myY - tempSlope * myX;

    // Rectangle rectTractor;
    let tractorCircles = 15;
    let scaleIncrement = 1 / tractorCircles;

    let xIncrement = Math.sqrt(Math.pow(myX - targetX, 2) + Math.pow(myY - targetY, 2)) / tractorCircles;
    let tempScale = 0;
    
    let element_index = 0;

    try
    {
        for (let i=0; i<tractorCircles; i++)
        {
            let temp_x = (myX - Math.cos(tempAngle) * xIncrement * i);
            let temp_y = (myY - Math.sin(tempAngle) * xIncrement * i);
            
            let beam_texture = elements[element_index].texture;

            let token_graphic = PIXI.Sprite.from(beam_texture); 
            if(elements[element_index].hasOwnProperty('tint')) token_graphic.tint = elements[element_index].tint;
            token_graphic.anchor.set(0.5);
            token_graphic.scale.set(tempScale);
            token_graphic.position.set(temp_x, temp_y);
            token_graphic.zIndex = 10000;
            token_graphic.alpha = 0.5;
            
            transfer_beam.beam_images.push({token_graphic:token_graphic, scale:tempScale, direction:"up"});       

            pixi_container_main.addChild(token_graphic);

            tempScale += scaleIncrement;

            element_index++;
            if(element_index >= elements.length) element_index = 0;
        }

        pixi_transfer_beams[pixi_transfer_beams_key++] = transfer_beam;
    }
    catch(error)
    {
        console.error(error);
        console.error("source location " + JSON.stringify(source_location));
        console.error("target location " + JSON.stringify(target_location));
        console.error("elements " + JSON.stringify(elements));
    }

},

/**
 * animate the transfer beam
 */
animate_transfer_beams: function animate_transfer_beams(delta)
{
    let completed = [];
    let speed = 0.05;

    //move the beams
    for(let i in pixi_transfer_beams)
    {   

        let beam_images =  pixi_transfer_beams[i].beam_images;
        let active = false;
        for(let j=0; j<beam_images.length; j++)
        {
            let beam_image = beam_images[j];
            if(beam_image.direction == "up")
            {
                if(beam_image.scale >= 1.0)
                {
                    beam_image.direction = "down";
                }
                else
                {
                    beam_image.scale += speed;
                }
            }
            else if(beam_image.direction == "down")
            {
                if(beam_image.scale <= 0)
                {
                    beam_image.token_graphic.destroy();
                    beam_image.direction = "done";
                }
                else
                {
                    beam_image.scale -= speed;
                }
            }

            if(beam_image.direction != "done")
            {
                beam_image.token_graphic.scale.set(beam_image.scale);
                active = true;
            }            
        }
 
        if(!active) completed.push(i);
    }

    //remove the completed beams and show text emitters
    let y_offset = 0;
    for(let i=0; i<completed.length; i++){      

        for(let j in pixi_transfer_beams[completed[i]].elements)
        {
            let transfer_beam = pixi_transfer_beams[completed[i]];
            let element = transfer_beam.elements[j];

            let beam_texture = element.texture;
            let source_location = transfer_beam.source_location;
            let target_location = transfer_beam.target_location;
            let source_change = element.source_change;
            let target_change = element.target_change;

            //add text emitters
            if(transfer_beam.show_source_emitter)
            {
                let token_graphic_1 = PIXI.Sprite.from(beam_texture);
                token_graphic_1.animationSpeed =  app.session.parameter_set.avatar_animation_speed;
                token_graphic_1.anchor.set(1, 0.5)
                token_graphic_1.scale.set(0.4);
                token_graphic_1.alpha = 0.7;

                app.add_text_emitters(source_change, 
                                    source_location.x, 
                                    source_location.y + y_offset,
                                    source_location.x,
                                    source_location.y - 100 + y_offset,
                                    0xFFFFFF,
                                    28,
                                    token_graphic_1)
            }
            
            if(transfer_beam.show_target_emitter)
            {
                let token_graphic_2 = PIXI.Sprite.from(beam_texture);
                token_graphic_2.animationSpeed =  app.session.parameter_set.avatar_animation_speed;
                token_graphic_2.anchor.set(1, 0.5)
                token_graphic_2.scale.set(0.4);
                token_graphic_2.alpha = 0.7;

                app.add_text_emitters(target_change, 
                                    target_location.x, 
                                    target_location.y + y_offset,
                                    target_location.x,
                                    target_location.y - 100 + y_offset,
                                    0xFFFFFF,
                                    28,
                                    token_graphic_2)
            }

            y_offset += 50;
        }
        
        //remove beams
        delete pixi_transfer_beams[completed[i]]; 
    }
},