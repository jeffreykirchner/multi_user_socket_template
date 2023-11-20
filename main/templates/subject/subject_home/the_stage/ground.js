/**
 * setup ground objects
 */
setup_pixi_ground: function setup_pixi_ground()
{
    for(const i in app.session.parameter_set.parameter_set_grounds_order)
    {
        pixi_grounds[i] = {};

        const ground_id = app.session.parameter_set.parameter_set_grounds_order[i];
        const ground = app.session.parameter_set.parameter_set_grounds[ground_id];
        
        let ground_container = new PIXI.Container();
        ground_container.eventMode = 'passive';
        ground_container.zIndex = 0;
        
        ground_container.position.set(ground.x, ground.y)

        //outline
        let outline = new PIXI.Graphics();
        //outline.lineStyle(1, 0x000000);
        matrix = new PIXI.Matrix(ground.scale,0,0,ground.scale,0,0);
        matrix.rotate(ground.rotation);
        outline.beginTextureFill({texture: app.pixi_textures[ground.texture], matrix:matrix});
        outline.tint = ground.tint;
        outline.drawRect(0, 0, ground.width, ground.height);
        outline.eventMode = 'passive';
       
        //outline.endFill();
        ground_container.addChild(outline);

        pixi_grounds[i].ground_container = ground_container;
        pixi_grounds[i].rect = {x:ground.x, y:ground.y, width:ground.width, height:ground.height};

        pixi_container_main.addChild(pixi_grounds[i].ground_container);
    }
},