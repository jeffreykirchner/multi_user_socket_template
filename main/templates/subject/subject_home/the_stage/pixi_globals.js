
var pixi_app = null;                           //pixi app   
var pixi_container_main = null;                //main container for pixi
var pixi_text_emitter = {};                    //text emitter json
var pixi_text_emitter_key = 0;
var pixi_transfer_beams = {};                  //transfer beam json
var pixi_transfer_beams_key = 0;
var pixi_fps_label = null;                     //fps label
var pixi_avatars = {};                         //avatars
var pixi_tokens = {};                          //tokens
var pixi_walls = {};                           //walls
var pixi_barriers = {};                        //barriers
var pixi_grounds = {};                         //grounds
var wall_search = {counter:0, current_location:{x:-1,y:-1}, target_location:{x:-1,y:-1}};
var wall_search_objects = [];