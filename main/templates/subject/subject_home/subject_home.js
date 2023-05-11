
{% load static %}

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

//vue app
var app = Vue.createApp({
    delimiters: ["[[", "]]"],

    data() {return {chat_socket : "",
                    reconnecting : true,
                    is_subject : true,
                    working : false,
                    reconnection_count : 0,
                    first_load_done : false,                       //true after software is loaded for the first time
                    player_key : "{{session_player.player_key}}",
                    owner_color : 0xA9DFBF,
                    other_color : 0xD3D3D3,
                    session_player : null, 
                    session : null,

                    form_ids: {{form_ids|safe}},

                    chat_text : "",
                    chat_recipients : "all",
                    chat_button_label : "Chat",
                    chat_list_to_display : [],                //list of chats to display on screen

                    end_game_modal_visible : false,

                    instruction_pages : {{instruction_pages|safe}},
                    instruction_pages_show_scroll : false,

                    // modals
                    end_game_modal : null,
                    interaction_modal : null,
                    test_mode : {%if session.parameter_set.test_mode%}true{%else%}false{%endif%},

                    //pixi
                    //pixi_app : null,
                    canvas_width  : null,
                    canvas_height : null,
                    //tilingSprite : null,
                    // target_location : {x:0,y:0},
                    // current_location : {x:0,y:0},
                    move_speed : 5,
                    animation_speed : 0.5,
                    scroll_speed : 10,
                    pixi_mode : "subject",
                    pixi_scale : 1,
                    stage_width : 10000,
                    stage_height : 10000,
                    scroll_direction : {x:0, y:0},

                    //forms
                    interaction_form : {direction:null, amount:null},
                }},
    methods: {

        /** fire when websocket connects to server
        */
        handle_socket_connected(){            
            app.send_get_session();
        },

        /** fire trys to connect to server
         * return true if re-connect should be allowed else false
        */
        handle_socket_connection_try(){            
            if(!app.session) return true;

            app.reconnection_count+=1;

            if(app.reconnection_count > app.session.parameter_set.reconnection_limit)
            {
                app.reconnection_failed = true;
                app.check_in_error_message = "Refresh your browser."
                return false;
            }

            return true;
        },

        /** take websocket message from server
        *    @param data {json} incoming data from server, contains message and message type
        */
        take_message(data) {

            {%if DEBUG%}
            console.log(data);
            {%endif%}

            let message_type = data.message.message_type;
            let message_data = data.message.message_data;

            switch(message_type) {                
                case "get_session":
                    app.take_get_session(message_data);
                    break; 
                case "update_start_experiment":
                    app.take_update_start_experiment(message_data);
                    break;
                case "update_reset_experiment":
                    app.take_update_reset_experiment(message_data);
                    break;
                case "chat":
                    app.take_chat(message_data);
                    break;
                case "update_chat":
                    app.take_update_chat(message_data);
                    break;
                case "update_time":
                    app.take_update_time(message_data);
                    break;
                case "name":
                    app.take_name(message_data);
                    break;
                case "update_next_phase":
                    app.take_update_next_phase(message_data);
                    break;
                case "next_instruction":
                    app.take_next_instruction(message_data);
                    break;
                case "finish_instructions":
                    app.take_finish_instructions(message_data);
                    break;
                case "update_refresh_screens":
                    app.take_refresh_screens(message_data);
                    break;
                case "update_target_location_update":
                    app.take_target_location_update(message_data);
                    break;
                case "update_collect_token":
                    app.take_update_collect_token(message_data);
                    break;
                case "update_tractor_beam":
                    app.take_update_tractor_beam(message_data);
                    break;
                case "update_interaction":
                    app.take_update_interaction(message_data);
                    break;
                case "update_cancel_interaction":
                    app.take_update_cancel_interaction(message_data);
                    break;
            }

            app.first_load_done = true;

            app.working = false;
        },

        /** send websocket message to server
        *    @param message_type {string} type of message sent to server
        *    @param message_text {json} body of message being sent to server
        */
        send_message(message_type, message_text, message_target="self")
        {          
            app.chat_socket.send(JSON.stringify({
                    'message_type': message_type,
                    'message_text': message_text,
                    'message_target': message_target,
                }));
        },

        /**
         * do after session has loaded
        */
        do_first_load()
        {           
             app.end_game_modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('end_game_modal'), {keyboard: false})   
             app.interaction_modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('interaction_modal'), {keyboard: false})          

             document.getElementById('end_game_modal').addEventListener('hidden.bs.modal', app.hide_end_game_modal);
             document.getElementById('interaction_modal').addEventListener('hidden.bs.modal', app.hide_interaction_modal);

             {%if session.parameter_set.test_mode%} setTimeout(app.do_test_mode, app.random_number(1000 , 1500)); {%endif%}

            // if game is finished show modal
            if(app.session.current_experiment_phase == 'Names')
            {
                app.show_end_game_modal();
            }
            else if(app.session.current_experiment_phase == 'Done' && 
                    app.session.parameter_set.survey_required=='True' && 
                    !app.session_player.survey_complete)
            {
                window.location.replace(app.session_player.survey_link);
            }

            if(document.getElementById('instructions_frame_a'))
            {
                document.getElementById('instructions_frame_a').addEventListener('scroll',
                    function()
                    {
                        app.scroll_update();
                    },
                    false
                )

                app.scroll_update();
            }

            app.setup_pixi();

        },

        /**
         * after reconnection, load again
         */
        do_reload()
        {
            app.setup_pixi_tokens_for_current_period();
            app.setup_pixi_subjects();
            app.setup_pixi_minimap();
        },

        /** send winsock request to get session info
        */
        send_get_session(){
            app.send_message("get_session", {"player_key" : app.player_key});
        },
        
        /** take create new session
        *    @param message_data {json} session day in json format
        */
        take_get_session(message_data){
            app.destroy_pixi_tokens_for_all_periods();
            app.destory_setup_pixi_subjects();
            
            app.session = message_data.session;
            app.session_player = message_data.session_player;

            if(app.session.started)
            {
               
            }
            else
            {
                
            }            
            
            if(app.session.current_experiment_phase != 'Done')
            {
                                
            }

            if(app.session.current_experiment_phase == 'Instructions')
            {
                Vue.nextTick(() => {
                    app.process_instruction_page();
                    app.instruction_display_scroll();
                });
            }

            if(!app.first_load_done)
            {
                Vue.nextTick(() => {
                    app.do_first_load();
                });
            }
            else
            {
                Vue.nextTick(() => {
                    app.do_reload();
                });
            }
        },

        /** update start status
        *    @param message_data {json} session day in json format
        */
        take_update_start_experiment(message_data){
            app.take_get_session(message_data);
        },

        /** update reset status
        *    @param message_data {json} session day in json format
        */
        take_update_reset_experiment(message_data){
            app.take_get_session(message_data);

            app.end_game_modal.hide();            
        },

        /**
        * update time and start status
        */
        take_update_time(message_data){
            let result = message_data.result;
            let status = message_data.value;

            if(status == "fail") return;

            let period_change = false;
            let period_earnings = 0;

            if (app.session.current_period != result.current_period)
            {
                period_change = true;
                period_earnings = result.session_player_earnings.earnings - app.session_player.earnings;
            }

            app.session.started = result.started;
            app.session.current_period = result.current_period;
            app.session.time_remaining = result.time_remaining;
            app.session.timer_running = result.timer_running;
            app.session.finished = result.finished;
            app.session.current_experiment_phase = result.current_experiment_phase;

            //update subject earnings
            app.session_player.earnings = result.session_player_earnings.earnings;

            //collect names
            if(app.session.current_experiment_phase == 'Names')
            {
                app.show_end_game_modal();
            }            

            app.update_subject_status_overlay();

            //period has changed display earnings
            if(period_change)
            {
                session_player = app.session.world_state.session_players[app.session_player.id];

                app.setup_pixi_tokens_for_current_period();
                app.setup_pixi_minimap();
                app.update_player_inventory();

                app.add_text_emitters("+" + period_earnings + "¢", 
                          session_player.current_location.x, 
                          session_player.current_location.y,
                          session_player.current_location.x,
                          session_player.current_location.y-100,
                          0xFFFFFF,
                          28,
                          null)
            }

            //update player states
            for(p in message_data.session_player_status)
            {
                session_player = message_data.session_player_status[p];
                app.session.world_state.session_players[p].interaction = session_player.interaction;
                app.session.world_state.session_players[p].frozen = session_player.frozen;
                app.session.world_state.session_players[p].cool_down = session_player.cool_down;
                app.session.world_state.session_players[p].tractor_beam_target = session_player.tractor_beam_target;
            }

            //hide interaction modal if interaction is over
            if(app.session.world_state.session_players[app.session_player.id].interaction == 0)
            {
                app.interaction_modal.hide();
            }
        },

        /**
         * show the end game modal
         */
        show_end_game_modal(){
            if(app.end_game_modal_visible) return;
   
            app.end_game_modal.toggle();

            app.end_game_modal_visible = true;
        },

        /** take refresh screen
         * @param messageData {json} result of update, either sucess or fail with errors
        */
        take_refresh_screens(message_data){
            if(message_data.value == "success")
            {           
                app.session = message_data.session;
                app.session_player = message_data.session_player;
            } 
            else
            {
            
            }
        },

      
        /** take next period response
         * @param message_data {json}
        */
        take_update_next_phase(message_data){
            app.end_game_modal.hide();

            app.session.current_experiment_phase = message_data.session.current_experiment_phase;
            app.session.session_players = message_data.session_players;
            app.session.session_players_order = message_data.session_players_order;
            app.session_player = message_data.session_player;

            if(app.session.current_experiment_phase == 'Names')
            {
                app.show_end_game_modal();
            }
            else
            {
                app.hide_end_game_modal();
            }
            
            if(app.session.current_experiment_phase == 'Done' && 
                    app.session.parameter_set.survey_required=='True' && 
                    !app.session_player.survey_complete)
            {
                window.location.replace(app.session_player.survey_link);
            }
        },

        /** hide choice grid modal modal
        */
        hide_end_game_modal(){
            app.end_game_modal_visible=false;
        },

        //do nothing on when enter pressed for post
        onSubmit(){
            //do nothing
        },
        
        {%include "subject/subject_home/chat/chat_card.js"%}
        {%include "subject/subject_home/summary/summary_card.js"%}
        {%include "subject/subject_home/test_mode/test_mode.js"%}
        {%include "subject/subject_home/instructions/instructions_card.js"%}
        {%include "subject/subject_home/the_stage/pixi_setup.js"%}
        {%include "subject/subject_home/the_stage/interface.js"%}
    
        /** clear form error messages
        */
        clear_main_form_errors(){
            
            let s = app.form_ids;
            for(let i in s)
            {
                let e = document.getElementById("id_errors_" + s[i]);
                if(e) e.remove();
            }
        },

        /** display form error messages
        */
        display_errors(errors){
            for(let e in errors)
                {
                    //e = document.getElementById("id_" + e).getAttribute("class", "form-control is-invalid")
                    let str='<span id=id_errors_'+ e +' class="text-danger">';
                    
                    for(let i in errors[e])
                    {
                        str +=errors[e][i] + '<br>';
                    }

                    str+='</span>';

                    document.getElementById("div_id_" + e).insertAdjacentHTML('beforeend', str);
                    document.getElementById("div_id_" + e).scrollIntoView(); 
                }
        }, 

        /**
         * return session player index that has specified id
         */
        find_session_player_index(id){

            let session_players = app.session.session_players;
            for(let i=0; i<session_players.length; i++)
            {
                if(session_players[i].id == id)
                {
                    return i;
                }
            }

            return null;
        },

        /**
         * handle window resize event
         */
        handleResize(){
            app.update_subject_status_overlay();
        },

    },

    mounted(){
        window.addEventListener('resize', this.handleResize);
    },

}).mount('#app');

{%include "js/web_sockets.js"%}

  