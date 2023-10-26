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