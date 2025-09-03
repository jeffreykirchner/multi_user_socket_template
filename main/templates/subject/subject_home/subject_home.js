
{% load static %}

"use strict";

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

//global letiables
let subject_status_overlay = {container:null, current_period_label:null, time_remaining_label:null, profit_label:null};
let pixi_target = null;                        //target sprite for your avatar
let pixi_mini_map = {container:null};               //mini map container
let pixi_notices = {container:null, notices:{}};                         //notices
let pixi_notices_key = 0;

let last_location_update = Date.now();          //last time location was updated

//prevent right click
document.addEventListener('contextmenu', event => event.preventDefault());

let worker = null;

{%include "subject/subject_home/the_stage/pixi_globals.js"%}

//vue app
let app = Vue.createApp({
    delimiters: ["[[", "]]"],

    data() {return {chat_socket : "",
                    reconnecting : true,
                    help_text : "Loading ...",
                    is_subject : true,
                    working : false,
                    reconnection_count : 0,
                    first_load_done : false,                       //true after software is loaded for the first time
                    player_key : "{{session_player.player_key}}",
                    session_player : null, 
                    session : null,
                    website_instance_id : "{{website_instance_id}}",

                    form_ids: {{form_ids|safe}},

                    chat_text : "",
                    chat_button_label : "Chat",

                    end_game_modal_visible : false,

                    instructions : {{instructions|safe}},
                    instruction_pages_show_scroll : false,

                    notices_seen: [],

                    // modals
                    end_game_modal : null,
                    interaction_modal : null,
                    insteration_start_modal : null,
                    help_modal : null,
                    chat_gpt_modal : null,
                    test_mode : {%if session.parameter_set.test_mode%}true{%else%}false{%endif%},

                    //last time screen was tapped
                    last_subject_pointer_tap : Date.now(),

                    //pixi
                    canvas_width  : null,
                    canvas_height : null,
                    move_speed : 5,
                    animation_speed : 0.5,
                    scroll_speed : 10,
                    pixi_mode : "subject",
                    pixi_scale : 1,
                    stage_width : 10000,
                    stage_height : 10000,
                    scroll_direction : {x:0, y:0},
                    draw_bounding_boxes: false,

                    //selected avatar
                    selected_player : {
                        session_player:null,
                        parameter_set_player:null,
                        interaction_amount:null,
                    },

                    //forms
                    interaction_form : {direction:null, amount:null},

                    //test mode
                    test_mode_location_target : null,

                    //errors
                    interaction_start_error: null,
                    interaction_error: null,
                    chat_gpt_error: null,

                    //open modals
                    interaction_start_modal_open : false,

                    //chat gpt
                    chat_gpt_text : "",
                    chat_gpt_history : {{session_player.get_chat_display_history|safe}},
                    chat_gpt_button_text : 'Chat <i class="far fa-comments"></i>',
                    last_scroll_chat_gpt_history_to_bottom : null,
                    chat_gpt_working : false,
                }},
    methods: {

        /** fire when websocket connects to server
        */
        handle_socket_connected: function handle_socket_connected(){            
            app.send_get_session();
            app.working = false;
        },

        /** fire trys to connect to server
         * return true if re-connect should be allowed else false
        */
        handle_socket_connection_try: function handle_socket_connection_try(){            
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
        take_message: function take_message(data) {

            {%if DEBUG%}
            console.log(data);
            {%endif%}

            let message_type = data.message.message_type;
            let message_data = data.message.message_data;

            switch(message_type) {                
                case "get_session":
                    app.take_get_session(message_data);
                    break; 
                case "help_doc_subject":
                    app.take_load_help_doc_subject(message_data);
                    break;
                case "update_start_experiment":
                    app.take_update_start_experiment(message_data);
                    break;
                case "update_reset_experiment":
                    app.take_reset_experiment(message_data);
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
                    app.take_collect_token(message_data);
                    break;
                case "update_tractor_beam":
                    app.take_tractor_beam(message_data);
                    break;
                case "update_interaction":
                    app.take_interaction(message_data);
                    break;
                case "update_cancel_interaction":
                    app.take_cancel_interaction(message_data);
                    break;
                case "update_rescue_subject":
                    app.take_rescue_subject(message_data);
                    break;
                case "process_chat_gpt_prompt":
                    app.take_process_chat_gpt_prompt(message_data);
                    break;
                case "clear_chat_gpt_history":
                    app.take_clear_chat_gpt_history(message_data);
                    break;
            }

            app.first_load_done = true;
        },

        /** send websocket message to server
        *    @param message_type {string} type of message sent to server
        *    @param message_text {json} body of message being sent to server
        */
        send_message: function send_message(message_type, message_text, message_target="self")
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
        do_first_load: function do_first_load()
        {           
            app.end_game_modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('end_game_modal'), {keyboard: false})   
            app.interaction_modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('interaction_modal'), {keyboard: false})
            app.interaction_start_modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('interaction_start_modal'), {keyboard: false})          
            app.help_modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('help_modal'), {keyboard: false})
            app.chat_gpt_modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('chat_gpt_modal'), {keyboard: false})

            document.getElementById('end_game_modal').addEventListener('hidden.bs.modal', app.hide_end_game_modal);
            document.getElementById('interaction_modal').addEventListener('hidden.bs.modal', app.hide_interaction_modal);
            document.getElementById('interaction_start_modal').addEventListener('hidden.bs.modal', app.hide_interaction_start_modal);

            {%if session.parameter_set.test_mode%} setTimeout(app.do_test_mode, app.random_number(1000 , 1500)); {%endif%}

            // if game is finished show modal
            if( app.session.world_state.current_experiment_phase == 'Names')
            {
                app.show_end_game_modal();
            }
            else if(app.session.world_state.current_experiment_phase == 'Done' && 
                    app.session.parameter_set.survey_required && 
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
            app.auto_update_avatar_location();
        },

        /**
         * if more than 5 seconds have passed since last location update, send location to server
         */
        auto_update_avatar_location: function auto_update_avatar_location()
        {
            if(Date.now() - app.last_location_update > 5000)
            {
                app.target_location_update();
            }

            setTimeout(app.auto_update_avatar_location, 5000);
        },

        /**
         * after reconnection, load again
         */
        do_reload: function do_reload()
        {
            app.setup_pixi_tokens_for_current_period();
            app.setup_pixi_ground();
            app.setup_pixi_subjects();
            app.setup_pixi_wall();
            app.setup_pixi_barrier();
            app.update_subject_status_overlay();
            app.setup_pixi_minimap();
        },

        /** send winsock request to get session info
        */
        send_get_session: function send_get_session(){
            app.send_message("get_session", {"player_key" : app.player_key});
        },
        
        /** take create new session
        *    @param message_data {json} session day in json format
        */
        take_get_session: function take_get_session(message_data){
            app.destroy_pixi_tokens_for_all_periods();
            app.destroy_setup_pixi_subjects();
            
            app.session = message_data.session;
            app.session_player = message_data.session_player;

            if(app.session.started)
            {
               
            }
            else
            {
               
            }            
            
            if(app.session.world_state.current_experiment_phase != 'Done')
            {
                                
            }

            if(app.session.world_state.current_experiment_phase == 'Instructions')
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
        take_update_start_experiment:function take_update_start_experiment(message_data){
            app.take_get_session(message_data);
        },

        /** update reset status
        *    @param message_data {json} session day in json format
        */
        take_reset_experiment: function take_reset_experiment(message_data){
            app.take_get_session(message_data);

            app.end_game_modal.hide();        
            
            app.interaction_modal.hide();
            app.interaction_start_modal.hide();
            app.help_modal.hide();

            app.setup_pixi_minimap();
            app.remove_all_notices();

            app.notices_seen = [];
        },

        /**
        * update time and start status
        */
        take_update_time: function take_update_time(message_data){
          
            let status = message_data.value;

            if(status == "fail") return;

            let period_change = false;
            let period_earnings = 0;

            if (message_data.period_is_over)
            {
                period_earnings = message_data.earnings[app.session_player.id].period_earnings;
                app.session.world_state.session_players[app.session_player.id].earnings = message_data.earnings[app.session_player.id].total_earnings;
            }

            app.session.started = message_data.started;

            app.session.world_state.current_period = message_data.current_period;
            app.session.world_state.time_remaining = message_data.time_remaining;
            app.session.world_state.timer_running = message_data.timer_running;
            app.session.world_state.started = message_data.started;
            app.session.world_state.finished = message_data.finished;
            app.session.world_state.current_experiment_phase = message_data.current_experiment_phase;

            // app.session.world_state.finished = message_data.finished;
        
            //collect names
            if(app.session.world_state.current_experiment_phase == 'Names')
            {
                app.show_end_game_modal();
            }            

            Vue.nextTick(() => {
                app.update_subject_status_overlay();
            });


            //period has changed
            if(message_data.period_is_over)
            {
                Vue.nextTick(() => {
                    let current_location = app.session.world_state.session_players[app.session_player.id].current_location;

                    app.add_text_emitters("+" + period_earnings + "¢", 
                            current_location.x, 
                            current_location.y,
                            current_location.x,
                            current_location.y-100,
                            0xFFFFFF,
                            28,
                            null)                    
                });          
                
                app.setup_pixi_tokens_for_current_period();
                app.setup_pixi_minimap();
                app.update_player_inventory();

                //add break notice
                if(app.session.world_state.current_period % app.session.parameter_set.break_frequency == 0)
                {
                    app.add_notice("Break Time: Interactions are disabled. Chat is enabled.", 
                                    app.session.world_state.current_period,
                                    app.session.parameter_set.period_length);
                }
            }

            //update player states
            for(let p in message_data.session_player_status)
            {
                let session_player = message_data.session_player_status[p];
                app.session.world_state.session_players[p].interaction = session_player.interaction;
                app.session.world_state.session_players[p].frozen = session_player.frozen;
                app.session.world_state.session_players[p].cool_down = session_player.cool_down;
                app.session.world_state.session_players[p].tractor_beam_target = session_player.tractor_beam_target;
            }

            //update player location
            for(let p in message_data.current_locations)
            {
                if(p != app.session_player.id)
                {
                    let server_location = message_data.current_locations[p];

                    if(app.get_distance(server_location, app.session.world_state.session_players[p].current_location) > 1000)
                    {
                        app.session.world_state.session_players[p].current_location = server_location;
                    }
                }
            }

            //add notices
            for(let i in app.session.parameter_set.parameter_set_notices)
            {
                let notice = app.session.parameter_set.parameter_set_notices[i];

                if(notice.start_period == app.session.world_state.current_period && 
                   notice.start_time >= app.session.world_state.time_remaining &&
                   app.notices_seen.indexOf(notice.id) === -1)
                {
                    app.add_notice(notice.text, notice.end_period, notice.end_time);
                    app.notices_seen.push(notice.id);
                }
            }

            //update any notices on screen
            app.update_notices();

            //update barriers
            app.update_barriers();
        },

        /**
         * show the end game modal
         */
        show_end_game_modal: function show_end_game_modal(){
            if(app.end_game_modal_visible) return;
   
            app.interaction_modal.hide();
            app.help_modal.hide();

            app.end_game_modal.toggle();

            app.end_game_modal_visible = true;
            app.working = false;
        },

        /** take refresh screen
         * @param messageData {json} result of update, either sucess or fail with errors
        */
        take_refresh_screens: function take_refresh_screens(message_data){
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
        take_update_next_phase: function take_update_next_phase(message_data){
            app.end_game_modal.hide();

            app.session.world_state.current_experiment_phase = message_data.current_experiment_phase;
            app.session.world_state.finished = message_data.finished;

            if(app.session.world_state.current_experiment_phase == 'Names')
            {
                app.show_end_game_modal();
            }
            else
            {
                app.hide_end_game_modal();
            }
            
            if(app.session.world_state.current_experiment_phase == 'Done' && 
                    app.session.parameter_set.survey_required && 
                    !app.session_player.survey_complete)
            {
                window.location.replace(app.session_player.survey_link);
            }

            if(app.session.world_state.current_experiment_phase == 'Run' || 
                app.session.world_state.current_experiment_phase == 'Instructions')
            {
                app.session.world_state = message_data.world_state;
                
                app.destroy_setup_pixi_subjects();
                app.do_reload();
                app.remove_all_notices();
            }
        },

        /** hide choice grid modal modal
        */
        hide_end_game_modal: function hide_end_game_modal(){
            app.end_game_modal_visible=false;
        },

        //do nothing on when enter pressed for post
        onSubmit: function onSubmit(){
            //do nothing
        },
        
        {%include "subject/subject_home/chat/chat_card.js"%}
        {%include "subject/subject_home/summary/summary_card.js"%}
        {%include "subject/subject_home/test_mode/test_mode.js"%}
        {%include "subject/subject_home/instructions/instructions_card.js"%}
        {%include "subject/subject_home/the_stage/pixi_setup.js"%}
        {%include "subject/subject_home/the_stage/token.js"%}
        {%include "subject/subject_home/the_stage/avatar.js"%}
        {%include "subject/subject_home/the_stage/helpers.js"%}
        {%include "subject/subject_home/the_stage/subject.js"%}
        {%include "subject/subject_home/the_stage/mini_map.js"%}
        {%include "subject/subject_home/the_stage/subject_overlay.js"%}
        {%include "subject/subject_home/the_stage/text_emitter.js"%}
        {%include "subject/subject_home/the_stage/transfer_beam.js"%}
        {%include "subject/subject_home/the_stage/notices.js"%}
        {%include "subject/subject_home/the_stage/wall.js"%}
        {%include "subject/subject_home/the_stage/move_objects.js"%}
        {%include "subject/subject_home/the_stage/barriers.js"%}
        {%include "subject/subject_home/the_stage/ground.js"%}
        {%include "subject/subject_home/help_doc_subject.js"%}
        {%include "subject/subject_home/the_stage/chat_gpt.js"%}

        /** clear form error messages
        */
        clear_main_form_errors: function clear_main_form_errors(){
            
            let s = app.form_ids;
            for(let i in s)
            {
                let e = document.getElementById("id_errors_" + s[i]);
                if(e) e.remove();
            }
        },

        /** display form error messages
        */
        display_errors: function display_errors(errors){
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
         * handle window resize event
         */
        handleResize: function handleResize(){
            app.update_subject_status_overlay();
        },

    },

    mounted(){
        Vue.nextTick(() => {
            window.addEventListener('resize', app.handleResize);
        });
    },

}).mount('#app');

{%include "js/web_sockets.js"%}
{%include "js/alert_dialog.js"%}

  