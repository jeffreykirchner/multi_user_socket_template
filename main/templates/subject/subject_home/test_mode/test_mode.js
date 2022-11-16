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

randomString(min_length, max_length){

    s = "";
    r = app.random_number(min_length, max_length);

    for(let i=0;i<r;i++)
    {
        v = app.random_number(48, 122);
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
            document.getElementById("id_name").value =  app.randomString(5, 20);
            document.getElementById("id_student_id").value =  app.random_number(1000, 10000);

            app.sendName();
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
                app.do_test_modeInstructions();
                break;
            case "Run":
                app.do_test_modeRun();
                break;
            
        }        
       
    }

    setTimeout(app.do_test_mode, app.random_number(1000 , 1500));
},

/**
 * test during instruction phase
 */
 do_test_modeInstructions()
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
do_test_modeRun()
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
                app.do_test_modeChat();
                break;
            
            case 2:
                break;
            
            case 3:
                
                break;
        }
},

/**
 * test mode chat
 */
do_test_modeChat(){

    if(app.session.parameter_set.private_chat)
    {
        session_player_local = app.session.session_players[app.random_number(0,  app.session.session_players.length-1)];

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

    app.chat_text = app.randomString(5, 20);
},


{%endif%}