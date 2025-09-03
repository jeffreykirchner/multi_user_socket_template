
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

const { createApp, ref } = Vue
//vue app
let app = createApp({
    delimiters: ["[[", "]]"],

    setup() {
        //letiables
        const chat_socket = ref("");
        const reconnecting = ref(true);
        const working = ref(false);
        const help_text = ref("Loading ...");
        const sessions = ref([]);
        const sessions_full_admin = ref([]);
        const sessions_full_admin_visible = ref(false);
        const create_session_button_text = ref('Create Session <i class="fas fa-plus"></i>');
        const date_sort_button_text = ref('Date <i class="fas fa-sort"></i>');
        const title_sort_button_text = ref('Title <i class="fas fa-sort"></i>');

        //methods
        function handle_socket_connected(){
            //fire when socket connects
            app.send_get_sessions();
        }

        /** fire trys to connect to server
         * return true if re-connect should be allowed else false
         * */
        function handle_socket_connection_try(){            
            return true;
        }

        function take_message(data) {
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
        }


        function send_message(message_type, message_text, message_target="self")
        {
            app.chat_socket.send(JSON.stringify({
                    'message_type': message_type,
                    'message_text': message_text,
                    'message_target': message_target,
                }));
        }

        function send_get_sessions(){
            //get list of sessions
            app.send_message("get_sessions",{});
        }

        function take_get_sessions(message_data){
            //process list of sessions

            app.sessions = message_data.sessions;

            if(app.sessions_full_admin_visible)
            {
                app.send_get_sessionsAdmin()
            }
            
        }

        function format_date(value){
            if (value) {        
                return moment(String(value)).local().format('MM/DD/YYYY');
            }
            else{
                return "date format error";
            }
        }

        function send_get_sessionsAdmin(){
            //get list of sessions
            app.send_message("get_sessions_admin",{});
        }

        function take_get_sessionsAdmin(message_data){
            //process list of sessions
            app.sessions_full_admin = message_data.sessions;
        }

        function toggle_sessions_full_admin(){
            app.sessions_full_admin_visible = !app.sessions_full_admin_visible;
        }

        function sort_sessions_date(){
            app.sessions.sort((a, b) => (a.date > b.date) ? 1 : -1);
        }

        function sort_sessions_title(){
            app.sessions.sort((a, b) => (a.title > b.title) ? 1 : -1);
        }

        
        {%include "staff/staff_home/sessions_card_full_admin.js"%}
        {%include "staff/staff_home/sessions_card.js"%}
        
        //return                        
        return {
            chat_socket , 
            reconnecting, 
            working, 
            help_text, 
            sessions, 
            sessions_full_admin, 
            sessions_full_admin_visible, 
            create_session_button_text, 
            date_sort_button_text, 
            title_sort_button_text,
            handle_socket_connected,
            handle_socket_connection_try,
            take_message,
            send_message,
            send_get_sessions,
            take_get_sessions,
            format_date,
            send_get_sessionsAdmin,
            take_get_sessionsAdmin,
            toggle_sessions_full_admin,
            sort_sessions_date,
            sort_sessions_title,
            send_create_session,
            take_create_session,
            send_delete_session,
            sort_by_title,
            sort_by_date,
            send_get_sessionsAdmin,
            take_get_sessionsAdmin,
            sort_by_title_all_sessions,
            sort_by_date_all_sessions,
            sort_by_owner_all_sessions,
            show_confirm_dialog,
        }
    }
}).mount('#app');

{%include "js/web_sockets.js"%}
{%include "js/alert_dialog.js"%}
