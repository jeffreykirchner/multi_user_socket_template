
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
        const instructions = ref([]);
        const create_instruction_button_text = ref('Create instruction <i class="fas fa-plus"></i>');
        const date_sort_button_text = ref('Date <i class="fas fa-sort"></i>');
        const title_sort_button_text = ref('Title <i class="fas fa-sort"></i>');


        //methods
        function handle_socket_connected(){
            //fire when socket connects
            app.send_get_instructions();
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
                // case "create_instruction":
                //     app.take_create_instruction(message_data);
                //     break;
                case "get_instructions":
                    app.take_get_instructions(message_data);
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

        function send_get_instructions(){
            //get list of instructions
            app.send_message("get_instructions",{});
        }

        function take_get_instructions(message_data){
            //process list of instructions

            app.instructions = message_data.instructions;
            
        }

        function format_date(value){
            if (value) {        
                return moment(String(value)).local().format('MM/DD/YYYY');
            }
            else{
                return "date format error";
            }
        }

        function sort_instructions_date(){
            app.instructions.sort((a, b) => (a.date > b.date) ? 1 : -1);
        }

        function sort_instructions_title(){
            app.instructions.sort((a, b) => (a.title > b.title) ? 1 : -1);
        }

        {%include "staff/staff_instructions/instructions_card.js"%}

        //return                        
        return {
            chat_socket , 
            reconnecting, 
            working, 
            help_text, 
            instructions, 
            create_instruction_button_text, 
            date_sort_button_text, 
            title_sort_button_text,
            handle_socket_connected,
            handle_socket_connection_try,
            take_message,
            send_message,
            send_get_instructions,
            take_get_instructions,
            format_date,
            sort_instructions_date,
            sort_instructions_title,
            send_create_instruction,
            // take_create_instruction,
            send_delete_instruction,
            // sort_by_title,
            // sort_by_date,
        }
    }
}).mount('#app');

{%include "js/web_sockets.js"%}
{%include "js/alert_dialog.js"%}
