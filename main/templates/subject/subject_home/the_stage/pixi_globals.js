
let pixi_app = null;                           //pixi app   
let pixi_container_main = null;                //main container for pixi
let pixi_text_emitter = {};                    //text emitter json
let pixi_text_emitter_key = 0;
let pixi_transfer_beams = {};                  //transfer beam json
let pixi_transfer_beams_key = 0;
let pixi_fps_label = null;                     //fps label
let pixi_avatars = {};                         //avatars
let pixi_tokens = {};                          //tokens
let pixi_walls = {};                           //walls
let pixi_barriers = {};                        //barriers
let pixi_grounds = {};                         //grounds
let wall_search = {counter:0, current_location:{x:-1,y:-1}, target_location:{x:-1,y:-1}};
let wall_search_objects = [];