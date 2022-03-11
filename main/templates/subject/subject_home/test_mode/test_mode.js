{%if session.parameter_set.test_mode%}

/**
 * do random self test actions
 */
randomNumber(min, max){
    //return a random number between min and max
    min = Math.ceil(min);
    max = Math.floor(max+1);
    return Math.floor(Math.random() * (max - min) + min);
},

randomString(min_length, max_length){

    s = "";
    r = this.randomNumber(min_length, max_length);

    for(let i=0;i<r;i++)
    {
        v = this.randomNumber(48, 122);
        s += String.fromCharCode(v);
    }

    return s;
},

doTestMode(){
    {%if DEBUG%}
    console.log("Do Test Mode");
    {%endif%}

    if(this.end_game_modal_visible)
    {
        if(this.session_player.name == "")
        {
            document.getElementById("id_name").value =  this.randomString(5, 20);
            document.getElementById("id_student_id").value =  this.randomNumber(1000, 10000);

            this.sendName();
        }

        return;
    }

    if(this.session.started &&
       this.session.parameter_set.test_mode
       )
    {
        
        switch (this.session.current_experiment_phase)
        {
            case "Selection":
                this.doTestModeSelection();
                break;
            case "Instructions":
                this.doTestModeInstructions();
                break;
            case "Run":
                this.doTestModeRun();
                break;
            
        }        
       
    }

    setTimeout(this.doTestMode, this.randomNumber(1000 , 10000));
},

/**
 * test during selection phase
 */
 doTestModeSelection()
 {

    if(this.avatar_choice_grid_selected_row == 0 && this.avatar_choice_grid_selected_col == 0)
    {
        let r = this.randomNumber(1, this.session.parameter_set.avatar_grid_row_count);
        let c = this.randomNumber(1, this.session.parameter_set.avatar_grid_col_count);

        document.getElementById('choice_grid_' + r + '_' + c + '_id').click();
    }
    else if(this.session_player.avatar == null)
    {
        document.getElementById('submit_avatar_choice_id').click();
    }

 },

/**
 * test during instruction phase
 */
 doTestModeInstructions()
 {
    if(this.session_player.instructions_finished) return;
    if(this.working) return;
    
    if(this.session_player.current_instruction == this.session_player.current_instruction_complete)
    {

        if(this.session_player.current_instruction == 5)
            document.getElementById("instructions_start_id").click();
        else
            document.getElementById("instructions_next_id").click();

    }else
    {
        switch (this.session_player.current_instruction)
        {
            case 1:
                break;
            case 2:
                document.getElementById("simulate_production_id").click();
                break;
            case 3:
                if(this.pixi_modal_open)
                {
                    if(this.session.parameter_set.good_count==2)
                        document.getElementById("move_two_id").click();
                    else           
                        document.getElementById("move_three_id").click();        
                }
                else
                {
                    this.doTestModeMove();
                }
                break;
            case 4:
                if(this.chat_text != "")
                {
                    document.getElementById("send_chat_id").click();                   
                }
                else
                {
                    this.doTestModeChat();
                }
                break;
            case 5:
                break;
        }
    }

    
 },

/**
 * test during run phase
 */
doTestModeRun()
{
    //do chat
    let go = true;

    if(go)
        if(this.chat_text != "")
        {
            document.getElementById("send_chat_id").click();
            go=false;
        }

    //move goods
    if(go)
        if(this.pixi_modal_open)
        {
            this.sendMoveGoods();
            go=false;
        }
    
    //update production
    if(go)
        if(this.production_slider_one != this.session_player.good_one_production_rate)
        {
            this.sendProdution();
            go=false;
        }
    
    if(app.$data.session.finished) return;
        
    if(go)
        switch (this.randomNumber(1, 3)){
            case 1:
                this.doTestModeChat();
                break;
            
            case 2:
                this.doTestModeMove();
                break;
            
            case 3:
                this.doTestModeProductionUpdate();
                break;
        }
},

/**
 * test mode chat
 */
doTestModeChat(){

    session_player_local = this.session.session_players[this.randomNumber(0,  this.session.session_players.length-1)];

    if(session_player_local.id == this.session_player.id || this.session.current_experiment_phase == "Instructions")
    {
        document.getElementById("chat_all_id").click();
    }
    else
    {
        document.getElementById('chat_invididual_' + session_player_local.id + '_id').click();
    }

    this.chat_text = this.randomString(5, 20);
},

/**
 * test mode move
 */
doTestModeMove(){
    let session_player_source = null;
    let source_container = null;

    if(this.randomNumber(1, 2) == 1 || this.session.current_experiment_phase == "Instructions")
    {
        if(this.session.parameter_set.allow_stealing == "True" && this.session.current_experiment_phase != "Instructions")
        {
            session_player_source = this.session.session_players[this.randomNumber(0, this.session.session_players.length-1)];        }
        else
        {
            session_player_source = this.findSessionPlayer(this.session_player.id);            
        }

        source_container = session_player_source.fieldContainer;        

        this.transfer_good_one_amount = this.randomNumber(0, session_player_source.good_one_field);
        this.transfer_good_two_amount = this.randomNumber(0, session_player_source.good_two_field);
    }
    else
    {
        if(this.session.parameter_set.allow_stealing == "True")
        {
            session_player_source = this.session.session_players[this.randomNumber(0, this.session.session_players.length-1)];
        }
        else
        {
            session_player_source = this.findSessionPlayer(this.session_player.id);  
        }            

        source_container = session_player_source.houseContainer;

        this.transfer_good_one_amount = this.randomNumber(0, session_player_source.good_one_house);
        this.transfer_good_two_amount = this.randomNumber(0, session_player_source.good_two_house);

        if(this.session.parameter_set.good_count==3)
        {
            this.transfer_good_three_amount = this.randomNumber(0, session_player_source.good_three_house);
        }
    }

    let session_player_target = null;
    
    if(this.session.current_experiment_phase == "Instructions")
        session_player_target = this.findSessionPlayer(this.session_player.id);
    else
        session_player_target = this.session.session_players[this.randomNumber(0, this.session.session_players.length-1)];

    let target_container = session_player_target.houseContainer;

    this.handleContainerDown(source_container,
                                {data: {global: {x:source_container.x, y:source_container.y}}})
    
    this.handleContainerUp(target_container,
                            {data: {global: {x:target_container.x, y:target_container.y}}})
},

/**
 * test mode update production percentages
 */
doTestModeProductionUpdate(){
    this.production_slider = this.randomNumber(-50, 50)
    this.update_production_slider();
},
{%endif%}