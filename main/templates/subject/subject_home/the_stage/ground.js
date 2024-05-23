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
        ground_container.zIndex = 0;
        
        ground_container.position.set(ground.x, ground.y)

        //outline
        let outline = new PIXI.Graphics();
        let matrix = new PIXI.Matrix(ground.scale,0,0,ground.scale,0,0);
        matrix.rotate(ground.rotation);
        
        outline.tint = ground.tint;
        outline.rect(0, 0, ground.width, ground.height);
        outline.fill({texture: app.pixi_textures[ground.texture], matrix:matrix});
       
        ground_container.addChild(outline);

        pixi_grounds[i].ground_container = ground_container;
        pixi_grounds[i].rect = {x:ground.x, y:ground.y, width:ground.width, height:ground.height};

        pixi_container_main.addChild(pixi_grounds[i].ground_container);
    }
},