{%if session.parameter_set.test_mode%}
/**
 * return random number between min and max inclusive
 */
random_number: function random_number(min, max){
    //return a random number between min and max
    min = Math.ceil(min);
    max = Math.floor(max+1);
    return Math.floor(Math.random() * (max - min) + min);
},

do_test_mode: function do_test_mode(){

    if(worker) worker.terminate();

    {%if DEBUG%}
    console.log("Do Test Mode");
    {%endif%}

    if(app.end_game_modal_visible && app.test_mode)
    {
        if(app.session_player.name == "")
        {
            Vue.nextTick(() => {
                app.session_player.name = app.random_string(5, 20);
                app.session_player.student_id =  app.random_number(1000, 10000);

                app.send_name();
            })
        }

        return;
    }

    if(app.session.started &&
       app.test_mode
       )
    {
        
        switch (app.session.world_state.current_experiment_phase)
        {
            case "Instructions":
                app.do_test_mode_instructions();
                break;
            case "Run":
                app.do_test_mode_run();
                break;
            
        }        
       
    }

    // setTimeout(app.do_test_mode, app.random_number(1000 , 1500));
    worker = new Worker("/static/js/worker_test_mode.js");

    worker.onmessage = function (evt) {   
        app.do_test_mode();
    };

    worker.postMessage(0);
},

/**
 * test during instruction phase
 */
do_test_mode_instructions: function do_test_mode_instructions()
 {
    if(app.session_player.instructions_finished) return;
    if(app.working) return;
    
   
    if(app.session_player.current_instruction == app.session_player.current_instruction_complete)
    {

        if(app.session_player.current_instruction == app.instructions.instruction_pages.length)
            document.getElementById("instructions_start_id").click();
        else
            document.getElementById("instructions_next_id").click();

    }else
    {
        //take action if needed to complete page
        switch (app.session_player.current_instruction)
        {
            case 1:
                break;
            case 2:
                
                break;
            case 3:
                
                break;
            case 4:
                
                break;
            case 5:
                break;
        }   
    }

    
 },

/**
 * test during run phase
 */
do_test_mode_run: function do_test_mode_run()
{
    //do chat
    let go = true;

    if(go)
        if(app.chat_text != "")
        {
            document.getElementById("send_chat_id").click();
            go=false;
        }
    
    if(app.session.world_state.finished) return;
        
    if(go)
        switch (app.random_number(1, 3)){
            case 1:
                app.do_test_mode_chat();
                break;
            
            case 2:                
                app.test_mode_move();
                break;
            case 3:
                
                break;
        }
},

/**
 * test mode chat
 */
do_test_mode_chat: function do_test_mode_chat(){

    app.chat_text = app.random_string(5, 20);
},

/**
 * test mode move to a location
 */
test_mode_move: function test_mode_move(){

    if(app.session.world_state.finished) return;

    let obj = app.session.world_state.session_players[app.session_player.id];
    let current_period_id = app.session.world_state.session_periods_order[app.session.world_state.current_period-1];

    if(!current_period_id) return;
   
    if(!app.test_mode_location_target || 
        app.get_distance(app.test_mode_location_target,  obj.current_location) <= 25)
    {
         //if near target location, move to a new one

        let rn = app.random_number(0, Object.keys(app.session.world_state.tokens[current_period_id]).length-1);
        let r = Object.keys(app.session.world_state.tokens[current_period_id])[rn];
        
        app.test_mode_location_target = app.session.world_state.tokens[current_period_id][r].current_location;
    }
    else if(app.get_distance(app.test_mode_location_target,  obj.current_location)<1000)
    {
        //object is close move to it
        obj.target_location = app.test_mode_location_target;
    }
    else
    {
        //if far from target location, move to intermediate location
        obj.target_location = app.get_point_from_angle_distance(obj.current_location.x, 
                                                        obj.current_location.y,
                                                        app.test_mode_location_target.x,
                                                        app.test_mode_location_target.y,
                                                        app.random_number(300,1000))
    }

    app.target_location_update();
},
{%endif%}