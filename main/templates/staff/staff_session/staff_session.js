
{% load static %}

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

//vue app
var app = Vue.createApp({
    delimiters: ["[[", "]]"],

    data() {return {chat_socket : "",
                    reconnecting : true,
                    working : false,
                    is_subject : false,
                    first_load_done : false,          //true after software is loaded for the first time
                    help_text : "Loading ...",
                    session_id : {{session.id}},
                    session_key : "{{session.session_key}}",
                    other_color : 0xD3D3D3,
                    session : null,

                    staff_edit_name_etc_form_ids: {{staff_edit_name_etc_form_ids|safe}},

                    move_to_next_phase_text : 'Start Next Experiment Phase',

                    chat_list_to_display : [],                  //list of chats to display on screen

                    data_downloading : false,                   //show spinner when data downloading
                    earnings_copied : false,                    //if true show earnings copied   

                    staff_edit_name_etc_form : {name : "", student_id : "", email : "", id : -1},
                    send_message_modal_form : {subject : "", text : ""},

                    email_result : "",                          //result of sending invitation emails
                    email_default_subject : "{{parameters.invitation_subject}}",
                    email_default_text : `{{parameters.invitation_text|safe}}`,

                    email_list_error : "",

                    csv_email_list : "",           //csv email list

                    //modals
                    edit_subject_modal : null,
                    edit_session_modal : null,
                    send_message_modal : null,
                    upload_email_modal : null,
                   
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
                case "update_session":
                    app.take_update_session(message_data);
                    break;
                case "start_experiment":
                    app.take_start_experiment(message_data);
                    break;
                case "update_start_experiment":
                    app.take_update_start_experiment(message_data);
                    break;
                case "reset_experiment":
                    app.take_reset_experiment(message_data);
                    break;
                case "next_phase":
                    app.take_next_phase(message_data);
                    break; 
                case "update_next_phase":
                    app.take_update_next_phase(message_data);
                    break; 
                case "update_reset_experiment":
                    app.take_update_reset_experiment(message_data);
                    break;
                case "update_chat":
                    app.take_update_chat(message_data);
                    break;
                case "update_time":
                    app.take_update_time(message_data);
                    break;
                case "start_timer":
                    app.take_start_timer(message_data);
                    break;   
                case "update_connection_status":
                    app.take_update_connection_status(message_data);
                    break;   
                case "reset_connections":
                    app.take_reset_connections(message_data);
                    break; 
                case "update_reset_connections":
                    app.take_update_reset_connections(message_data);
                    break; 
                case "update_name":
                    app.take_update_name(message_data);
                    break;         
                case "download_summary_data":
                    app.take_download_summary_data(message_data);
                    break;
                case "download_action_data":
                    app.take_download_action_data(message_data);
                    break;
                case "download_recruiter_data":
                    app.take_download_recruiter_data(message_data);
                    break;
                case "download_payment_data":
                    app.take_download_payment_data(message_data);
                    break;
                case "update_next_instruction":
                    app.take_next_instruction(message_data);
                    break;
                case "update_finish_instructions":
                    app.take_finished_instructions(message_data);
                    break;
                case "help_doc":
                    app.take_load_help_doc(message_data);
                    break;
                case "end_early":
                    app.take_end_early(message_data);
                    break;
                case "update_subject":
                    app.take_update_subject(message_data);
                    break;
                case "send_invitations":
                    app.take_send_invitations(message_data);
                    break;
                case "email_list":
                    app.take_update_email_list(message_data);
                    break;
                case "update_anonymize_data":
                    app.take_anonymize_data(message_data);
                    break;
                case "update_survey_complete":
                    app.take_update_survey_complete(message_data);
                    break;
                case "update_refresh_screens":
                    app.take_refresh_screens(message_data);
                    break;

            }

            app.first_load_done = true;
            app.working = false;
            //Vue.nextTick(app.update_sdgraph_canvas());
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
             app.edit_subject_modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('edit_subject_modal'), {keyboard: false});
             app.edit_session_modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('edit_session_modal'), {keyboard: false});;           
             app.send_message_modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('send_message_modal'), {keyboard: false});           
             app.upload_email_modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('upload_email_modal'), {keyboard: false});
 
             document.getElementById('edit_subject_modal').addEventListener('hidden.bs.modal', app.hide_edit_subject);
             document.getElementById('edit_session_modal').addEventListener('hidden.bs.modal', app.hide_edit_session);
             document.getElementById('send_message_modal').addEventListener('hidden.bs.modal', app.hide_send_invitations);
             document.getElementById('upload_email_modal').addEventListener('hidden.bs.modal', app.hide_send_email_list);

            tinyMCE.init({
                target: document.getElementById('id_invitation_subject'),
                height : "400",
                theme: "silver",
                plugins: "directionality,paste,searchreplace,code",
                directionality: "{{ directionality }}",
            });
    
            // Prevent Bootstrap dialog from blocking focusin
            document.addEventListener('focusin', (e) => {
                if (e.target.closest(".tox-tinymce-aux, .moxman-window, .tam-assetmanager-root") !== null) {
                    e.stopImmediatePropagation();
                }
                });
         },

        /** send winsock request to get session info
        */
        send_get_session(){
            app.send_message("get_session",{"session_key" : app.session_key});
        },

        /** take create new session
        *    @param message_data {json} session day in json format
        */
        take_get_session(message_data){
            
            app.session = message_data;

            if(app.session.started)
            {
                
            }
            else
            {
                
            }

            if(!app.first_load_done)
            {
                Vue.nextTick(() => {
                    app.do_first_load();
                });
            }
            
            app.update_chat_display();
            app.update_phase_button_text();    
        },

        /**update text of move on button based on current state
         */
        update_phase_button_text(){
            if(app.session.finished && app.session.current_experiment_phase == "Done")
            {
                app.move_to_next_phase_text = '** Session complete **';
            }
            else if(app.session.current_experiment_phase == "Names")
            {
                app.move_to_next_phase_text = 'Complete Session <i class="fas fa-flag-checkered"></i>';
            }
            else if(app.session.current_experiment_phase == "Run")
            {
                app.move_to_next_phase_text = 'Running ...';
            }
            else if(app.session.started && !app.session.finished)
            {
                if(app.session.current_experiment_phase == "Selection" && app.session.parameter_set.show_instructions == "True")
                {
                    app.move_to_next_phase_text = 'Show Instrutions <i class="fas fa-map"></i>';
                }
                else
                {
                    app.move_to_next_phase_text = 'Continue Session <i class="far fa-play-circle"></i>';
                }
            }
        },

        /** take updated data from goods being moved by another player
        *    @param message_data {json} session day in json format
        */
        take_update_chat(message_data){
            
            let result = message_data;
            let chat = result.chat;

            if(app.session.chat_all.length>=100)
                app.session.chat_all.shift();
            
            app.session.chat_all.push(chat);
            app.update_chat_display();
        },

        /**
         * update chat
         */
        update_chat_display(){
            
            app.chat_list_to_display=app.session.chat_all;
        },

        /**
         * update time and start status
         */
        take_update_time(message_data){

            let result = message_data.result;
            let status = message_data.value;

            if(status == "fail") return;

            app.session.started = result.started;
            app.session.current_period = result.current_period;
            app.session.time_remaining = result.time_remaining;
            app.session.timer_running = result.timer_running;
            app.session.finished = result.finished;
            app.session.current_experiment_phase = result.current_experiment_phase;

            app.take_update_earnings(message_data);

            app.update_phase_button_text();
        },
       
        //do nothing on when enter pressed for post
        onSubmit(){
            //do nothing
        },
        
        {%include "staff/staff_session/control/control_card.js"%}
        {%include "staff/staff_session/session/session_card.js"%}
        {%include "staff/staff_session/subjects/subjects_card.js"%}
        {%include "staff/staff_session/summary/summary_card.js"%}
        {%include "staff/staff_session/data/data_card.js"%}
        {%include "js/help_doc.js"%}
    
        /** clear form error messages
        */
        clear_main_form_errors(){
            
            for(let item in app.session)
            {
                e = document.getElementById("id_errors_" + item);
                if(e) e.remove();
            }

            s = app.staff_edit_name_etc_form_ids;
            for(let i in s)
            {
                e = document.getElementById("id_errors_" + s[i]);
                if(e) e.remove();
            }
        },

        /** display form error messages
        */
        display_errors(errors){
            for(let e in errors)
                {
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
    },

    mounted(){

    },

}).mount('#app');

{%include "js/web_sockets.js"%}

  