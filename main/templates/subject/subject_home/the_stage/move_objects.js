/**
 * move the object towards its target location
 */
move_object: function move_object(delta, obj, move_speed)
{
    let temp_move_speed = (move_speed * delta);

    let temp_current_location = Object.assign({}, obj.current_location);

    let target_location_local = Object.assign({}, obj.target_location);
    if("nav_point" in obj && obj.nav_point) 
    target_location_local = Object.assign({}, obj.nav_point);

    let temp_angle = Math.atan2(target_location_local.y - obj.current_location.y,
                                target_location_local.x - obj.current_location.x)

    //y
    if(Math.abs(target_location_local.y - obj.current_location.y) < temp_move_speed)
        obj.current_location.y = target_location_local.y;
    else
        obj.current_location.y += temp_move_speed * Math.sin(temp_angle);
 
    //x
    if(Math.abs(target_location_local.x - obj.current_location.x) < temp_move_speed)
        obj.current_location.x = target_location_local.x;
    else
        obj.current_location.x += temp_move_speed * Math.cos(temp_angle);  

    
},

move_avatar: function move_avatar(delta, player_id)
{
    
    let temp_move_speed = (parseFloat(app.session.parameter_set.avatar_move_speed) * delta);
    let obj = app.session.world_state.session_players[player_id];
    let parameter_set_group = app.session.parameter_set.parameter_set_players[obj.parameter_set_player_id].parameter_set_group;
    let container=pixi_avatars[player_id].bounding_box
    let scale = app.session.parameter_set.avatar_scale;

    let temp_current_location = Object.assign({}, obj.current_location);

    let target_location_local = Object.assign({}, obj.target_location);
    if("nav_point" in obj && obj.nav_point) 
    target_location_local = Object.assign({}, obj.nav_point);

    let temp_angle = Math.atan2(target_location_local.y - obj.current_location.y,
                                target_location_local.x - obj.current_location.x)

    //y
    if(Math.abs(target_location_local.y - obj.current_location.y) < temp_move_speed)
        obj.current_location.y = target_location_local.y;
    else
        obj.current_location.y += temp_move_speed * Math.sin(temp_angle);
 
    //x
    if(Math.abs(target_location_local.x - obj.current_location.x) < temp_move_speed)
        obj.current_location.x = target_location_local.x;
    else
        obj.current_location.x += temp_move_speed * Math.cos(temp_angle);  

    //if nav point reached remove it.
    if("nav_point" in obj && obj.nav_point && obj.current_location.x == obj.nav_point.x && obj.current_location.y == obj.nav_point.y)
        obj.nav_point = null;

    //if wall limited prevent object from moving through
    if(!obj.nav_point)
    {
        let wall_limit_hit = false;

        let rect1={x:obj.current_location.x - container.width/2,
                   y:obj.current_location.y - container.height/2,
                   width:container.width,
                   height:container.height};  
        
        if(app.check_walls_intersection(rect1) || 
           app.check_barriers_intersection(rect1, parameter_set_group, obj.parameter_set_player_id))
        {
            obj.current_location =  Object.assign({}, temp_current_location);  
            wall_limit_hit = true;
        }

        if(wall_limit_hit)
        {
            //check if not moving and no path available
            if("last_wall_limit_hit" in obj)
            {
                if(obj.last_wall_limit_hit.current_location.x == obj.current_location.x &&
                   obj.last_wall_limit_hit.current_location.y == obj.current_location.y &&
                   obj.last_wall_limit_hit.target_location.x == obj.target_location.x &&
                   obj.last_wall_limit_hit.target_location.y == obj.target_location.y)

                {
                    obj.nav_point = null;
                    return;
                }
            }
            else
            {
                obj.last_wall_limit_hit = {};
            }

            obj.last_wall_limit_hit.current_location = Object.assign({}, obj.current_location);
            obj.last_wall_limit_hit.target_location = Object.assign({}, obj.target_location);

            //reset rect
            rect1={x:obj.current_location.x - container.width/2,
                        y:obj.current_location.y - container.height/2,
                        width:container.width,
                        height:container.height};

            let v = app.search_for_path_around_walls(rect1, obj.current_location, obj.target_location, 
                                                     parameter_set_group, obj.parameter_set_player_id);       
           
            if(v)
            {
                obj.nav_point = v;
            }

        }

    }
},

/**
 * seach for path around walls
 */
search_for_path_around_walls: function search_for_path_around_walls(starting_rect, current_location, 
                                                         target_location, parameter_set_group, parameter_set_player)
{
    
    //target already in bounding rect
    if(app.check_point_in_rectagle(target_location, starting_rect))
    {
        return {x:starting_rect.x + starting_rect.width/2, 
                y:starting_rect.y + starting_rect.height/2};
    }

    let nearest_point =  "x_" + starting_rect.x + "_y_" + starting_rect.y;
    let nearest_point_distance = app.get_distance(target_location, current_location);

    let contact_found = null;
    wall_search.counter = 0;
    wall_search.search_grid = {};

    let v = {rect:{x:starting_rect.x, y:starting_rect.y, width: starting_rect.width, height:starting_rect.height}, 
             searched:false, shortest_path:0, parent:null, contact:false};
    wall_search.search_grid["x_" + starting_rect.x + "_y_" + starting_rect.y] = v;

    for(let a=0;a<15;a++)
    {
        let new_search_grid = {};
        wall_search.counter += 1;
        //expand grid
        for(let i in wall_search.search_grid)
        {
            let search_grid = wall_search.search_grid[i];
            let temp_x = search_grid.rect.x-starting_rect.width;
            let temp_y = search_grid.rect.y-starting_rect.height;

            for(let j=0;j<3;j++)
            {
                for(let k=0;k<3;k++)
                {
                    if(j == 0 && k==1 || j==1 && k==0 || j==1 && k==2 || j==2 && k==1)
                    {
                        let v = "x_" + temp_x + "_y_" + temp_y;
                        let rect1 = {x:temp_x, y:temp_y, width:starting_rect.width, height:starting_rect.height};

                        if(v in wall_search.search_grid)
                        {
                            if(wall_search.search_grid[v].shortest_path > search_grid.shortest_path+1)
                            {
                                wall_search.search_grid[v].shortest_path = search_grid.shortest_path+1;
                                wall_search.search_grid[v].parent = i;
                            }
                            else if(wall_search.search_grid[v].shortest_path+1 < search_grid.shortest_path)
                            {
                                search_grid.shortest_path = wall_search.search_grid[v].shortest_path+1;
                                search_grid.parent = v;
                            }
                        }
                        else if(!app.check_walls_intersection(rect1) && 
                                !app.check_barriers_intersection(rect1, parameter_set_group, parameter_set_player)) 
                        {
                            new_search_grid[v] = {rect:rect1, 
                                                  searched:false, 
                                                  shortest_path:search_grid.shortest_path+1, 
                                                  parent:i, 
                                                  contact:false};
                            
                            //keep track of closest valid spot
                            let temp_distance = app.get_distance(target_location, 
                                                                {x:rect1.x + rect1.width/2, y:rect1.y + rect1.height/2});
                            if(temp_distance<nearest_point_distance)
                            {
                                nearest_point = v;
                                nearest_point_distance = temp_distance;
                            }
                        }

                    }

                    temp_x += starting_rect.width;
                }

                temp_x = search_grid.rect.x-starting_rect.width;
                temp_y += starting_rect.height;
            }
        }

        //add new grid to existing grid
        
        for(let i in new_search_grid)
        {
            wall_search.search_grid[i] = new_search_grid[i];

            if(app.check_point_in_rectagle(target_location, wall_search.search_grid[i].rect))
            {
                wall_search.search_grid[i].contact = true;
                contact_found = i;
                break;
            }
        }

        if(contact_found) 
            break;
    }

    let draw_grid = false;
    //draw grid for testing
    if(draw_grid)
    {
        for(let i=0;i<wall_search_objects.length;i++)
        {
            wall_search_objects[i].destroy({children:true, baseTexture:true});
        }

        wall_search_objects = [];

        for(let i in wall_search.search_grid)
        {
            //outline
            let search_grid = wall_search.search_grid[i];
            let box = new PIXI.Graphics();
            let rect = search_grid.rect;
        
            

            box.rect(rect.x, rect.y, rect.width, rect.height);
            box.stroke({width:1, color:"black"});
            // bounding_box.fill(0xBDB76B);
            
            wall_search_objects.push(box);
            pixi_container_main.addChild(box);

            //line to parent
            if(search_grid.parent)
            {
                let line_to_parent = new PIXI.Graphics();
                let search_grid_parent = wall_search.search_grid[search_grid.parent];
               

                line_to_parent.moveTo(rect.x + rect.width/2, rect.y + rect.height/2);
                line_to_parent.lineTo(search_grid_parent.rect.x + search_grid_parent.rect.width/2, search_grid_parent.rect.y + search_grid_parent.rect.height/2);
                
                line_to_parent.stroke({width:1, color:"gray"});

                wall_search_objects.push(line_to_parent);
                pixi_container_main.addChild(line_to_parent);
            }

        }
    }

    //find path to start
    if(!contact_found)
    {
        contact_found = nearest_point;
    }

    let go = true;
    while(go)
    {
        let search_grid = wall_search.search_grid[contact_found];

        if(search_grid.parent)
        {
            let search_grid_parent = wall_search.search_grid[search_grid.parent];

            let pt1 = {x:search_grid.rect.x + search_grid.rect.width/2, y:search_grid.rect.y + search_grid.rect.height/2};
            let pt2 = {x:search_grid_parent.rect.x + search_grid_parent.rect.width/2, y:search_grid_parent.rect.y + search_grid_parent.rect.height/2};

            if(draw_grid)
            {
                let line_to_parent = new PIXI.Graphics();               

                line_to_parent.moveTo(pt1.x, pt1.y);
                line_to_parent.lineTo(pt2.x, pt2.y);

                line_to_parent.stroke({width:2, color:"purple"});

                wall_search_objects.push(line_to_parent);
                pixi_container_main.addChild(line_to_parent);
            }

            if(search_grid_parent.parent)
            {
                contact_found = search_grid.parent;
            }
            else
            {
                return pt1;
            }
        }
        else
        {
            go = false;
        }
    }

},