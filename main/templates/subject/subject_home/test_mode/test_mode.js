{%if session.parameter_set.test_mode%}

/**
 * do random self test actions
 */
random_number(min, max){
    //return a random number between min and max
    min = Math.ceil(min);
    max = Math.floor(max+1);
    return Math.floor(Math.random() * (max - min) + min);
},

random_string(min_length, max_length){

    let s = "";
    let r = app.random_number(min_length, max_length);

    for(let i=0;i<r;i++)
    {
        let v = app.random_number(48, 122);
        s += String.fromCharCode(v);
    }

    return s;
},

do_test_mode(){
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

                app.sendName();
            })
        }

        return;
    }

    if(app.session.started &&
       app.test_mode
       )
    {
        
        switch (app.session.current_experiment_phase)
        {
            case "Instructions":
                app.do_test_mode_instructions();
                break;
            case "Run":
                app.do_test_mode_run();
                break;
            
        }        
       
    }

    setTimeout(app.do_test_mode, app.random_number(1000 , 1500));
},

/**
 * test during instruction phase
 */
 do_test_mode_instructions()
 {
    if(app.session_player.instructions_finished) return;
    if(app.working) return;
    
   
    if(app.session_player.current_instruction == app.session_player.current_instruction_complete)
    {

        if(app.session_player.current_instruction == app.instruction_pages.length)
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
do_test_mode_run()
{
    //do chat
    let go = true;

    if(go)
        if(app.chat_text != "")
        {
            document.getElementById("send_chat_id").click();
            go=false;
        }
    
    if(app.session.finished) return;
        
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
do_test_mode_chat(){

    if(app.session.parameter_set.private_chat)
    {
        let session_player_id = app.session.session_players_order[app.random_number(0,  app.session.session_players_order.length-1)]
        let session_player_local = app.session.session_players[session_player_id];

        if(session_player_local.id == app.session_player.id || app.session.current_experiment_phase == "Instructions")
        {
            document.getElementById("chat_all_id").click();
        }
        else
        {
            document.getElementById('chat_invididual_' + session_player_local.id + '_id').click();
        }        
    }
    else
    {
        document.getElementById("chat_all_id").click();
    }

    app.chat_text = app.random_string(5, 20);
},


/**
 * test mode move to a location
 */
test_mode_move(){

    if(!app.test_mode_location_target)
    {
      
    }

    app.test_mode_location_target = {"x" : app.random_number(0, 5000), "y" : app.random_number(0, 5000)};

    obj = app.session.world_state.session_players[app.session_player.id];
    obj.target_location = app.test_mode_location_target;

    app.target_location_update();
},

{%endif%}