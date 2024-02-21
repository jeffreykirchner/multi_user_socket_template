/**
 * find point given angle and distance
 **/
get_point_from_angle_distance: function get_point_from_angle_distance(start_x, start_y, end_x, end_y, distance)
{
    let angle = app.get_angle(start_x, start_y, end_x, end_y);
    return {x:start_x + distance * Math.cos(angle), 
            y:start_y + distance * Math.sin(angle)};
},

/**
 * find the angle between two points
 */
get_angle: function get_angle(x1, y1, x2, y2)
{
    return Math.atan2(y2 - y1, x2 - x1);
},

/**
 * do random self test actions
 */
random_number: function random_number(min, max){
    //return a random number between min and max
    min = Math.ceil(min);
    max = Math.floor(max+1);
    return Math.floor(Math.random() * (max - min) + min);
},

random_string: function random_string(min_length, max_length){

    let s = "";
    let r = app.random_number(min_length, max_length);

    for(let i=0;i<r;i++)
    {
        let v = app.random_number(48, 122);
        s += String.fromCharCode(v);
    }

    return s;
},

/**
 * get distance in pixels between two points
 */
get_distance: function get_distance(point1, point2) 
{
    // Get the difference between the x-coordinates of the two points.
    const dx = point2.x - point1.x;
  
    // Get the difference between the y-coordinates of the two points.
    const dy = point2.y - point1.y;
  
    // Calculate the square of the distance between the two points.
    const distanceSquared = dx * dx + dy * dy;
  
    // Take the square root of the distance between the two points.
    const distance = Math.sqrt(distanceSquared);
  
    // Return the distance between the two points.
    return distance;
},

/**
 * check for rectangle intersection
 */
check_for_rect_intersection: function check_for_rect_intersection(rect1, rect2)
{
   if(rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y)
   {
        return true;
   }

   return false;

},

/**
 * check if point is in rectangle
 */
check_point_in_rectagle: function check_point_in_rectagle(point, rect)
{
    if(point.x >= rect.x && point.x <= rect.x + rect.width &&
         point.y >= rect.y && point.y <= rect.y + rect.height)
    {
        return true;
    }

    return false;
},

/**
 * degrees to radians
 */
degrees_to_radians: function degrees_to_radians(degrees)
{
    let pi = Math.PI;
    return degrees * (pi/180);
},

/**
 * get the parameter set player from the player id
*/
get_parameter_set_player_from_player_id: function get_parameter_set_player_from_player_id(player_id)
{
    try 
    {
        let parameter_set_player_id = app.session.world_state.session_players[player_id].parameter_set_player_id;
        return app.session.parameter_set.parameter_set_players[parameter_set_player_id];
    }
    catch (error) {
        return {id_label:null};
    }
},

/**
 * get the parameter set group for a player id
 */
get_parameter_set_group_from_player_id: function get_parameter_set_group_from_player_id(player_id)
{
    if(!player_id) return null;

    let parameter_set_player_id = app.session.world_state.session_players[player_id].parameter_set_player_id;
    let parameter_set_player = app.session.parameter_set.parameter_set_players[parameter_set_player_id];
    return app.session.parameter_set.parameter_set_groups[parameter_set_player.parameter_set_group];
},