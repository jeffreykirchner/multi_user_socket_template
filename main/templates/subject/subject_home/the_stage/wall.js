/**
 * setup wall objects
 */
setup_pixi_wall: function setup_pixi_wall()
{
    for(const i in app.session.parameter_set.parameter_set_walls_order)
    {
        pixi_walls[i] = {};

        const wall_id = app.session.parameter_set.parameter_set_walls_order[i];
        const wall = app.session.parameter_set.parameter_set_walls[wall_id];
        
        let wall_container = new PIXI.Container();
        
        wall_container.position.set(wall.start_x,wall.start_y)

        //outline
        let outline = new PIXI.Graphics();

        let scale = 100 / app.pixi_textures.wall_tex.width;
        
        outline.rect(0, 0, wall.width, wall.height);
        outline.fill({texture: app.pixi_textures['wall_tex'], color:0xDEB887, matrix:new PIXI.Matrix(scale,0,0,scale,0,0)});
       
        //outline.endFill();

        wall_container.addChild(outline);

        pixi_walls[i].wall_container = wall_container;

        pixi_container_main.addChild(pixi_walls[i].wall_container);
    }
},

/**
 * check wall intersection
 */
check_walls_intersection: function check_walls_intersection(rect1)
{
    for(let i in app.session.parameter_set.parameter_set_walls)
    {
        let temp_wall = app.session.parameter_set.parameter_set_walls[i];
        let rect2={x:temp_wall.start_x,
                   y:temp_wall.start_y,
                   width:temp_wall.width,
                   height:temp_wall.height};

        if(app.check_for_rect_intersection(rect1, rect2))
        {  
            return true;
        }
    }

    return false;
},