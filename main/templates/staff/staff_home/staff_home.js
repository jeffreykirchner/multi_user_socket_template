
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

//vue app
var app = Vue.createApp({
    delimiters: ["[[", "]]"],

    data() {return {chat_socket : "",
                    reconnecting : true,
                    working : false,
                    help_text : "Loading ...",
                    sessions : [],
                    sessions_full_admin : [],
                    sessions_full_admin_visible : false,
                    create_session_button_text : 'Create Session <i class="fas fa-plus"></i>',
                    date_sort_button_text: 'Date <i class="fas fa-sort"></i>',
                    title_sort_button_text: 'Title <i class="fas fa-sort"></i>',
                }},
    methods: {
        handle_socket_connected(){
            //fire when socket connects
            app.send_get_sessions();
        },

        /** fire trys to connect to server
         * return true if re-connect should be allowed else false
        */
        handle_socket_connection_try(){            
            return true;
        },

        take_message(data) {
           //process socket message from server

           {%if DEBUG%}
           console.log(data);
           {%endif%}

           let message_type = data.message.message_type;
           let message_data = data.message.message_data;

            switch(message_type) {
                case "create_session":
                    app.take_create_session(message_data);
                    break;
                case "get_sessions":
                    app.take_get_sessions(message_data);
                    break;
                case "get_sessions_admin":
                    app.take_get_sessionsAdmin(message_data);
                    break;
    
            }

            app.working = false;
        },

        send_message(message_type, message_text, message_target="self")
        {          
            app.chat_socket.send(JSON.stringify({
                    'message_type': message_type,
                    'message_text': message_text,
                    'message_target': message_target,
                }));
        },

        send_get_sessions(){
            //get list of sessions
            app.send_message("get_sessions",{});
        },

        take_get_sessions(message_data){
            //process list of sessions

            app.sessions = message_data.sessions;

            if(app.sessions_full_admin_visible)
            {
                app.send_get_sessionsAdmin()
            }
            
        },       

        format_date: function(value){
            if (value) {        
                //console.log(value);                    
                return moment(String(value)).local().format('MM/DD/YYYY');
            }
            else{
                return "date format error";
            }
        },
        
        {%include "staff/staff_home/sessions_card_full_admin.js"%}
        {%include "staff/staff_home/sessions_card.js"%}
    },

    mounted(){
        
    },

}).mount('#app');

{%include "js/web_sockets.js"%}
