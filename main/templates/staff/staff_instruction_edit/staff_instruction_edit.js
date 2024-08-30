
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
        const instruction = ref([]);


        //methods
        function handle_socket_connected(){
            //fire when socket connects
            app.send_get_instruction();
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
                case "get_instruction":
                    app.get_instruction(message_data);
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

        function send_get_instruction(){
            //get list of instruction
            app.send_message("get_instruction",{});
        }

        function take_get_instruction(message_data){
            //process list of instruction

            app.instruction = message_data.instruction;
            
        }

        {%include "staff/staff_instruction_edit/actions_card.js"%}

        //return                        
        return {
            chat_socket , 
            reconnecting, 
            working, 
            help_text, 
            instruction, 
            handle_socket_connected,
            handle_socket_connection_try,
            take_message,
            send_message,
            send_get_instruction,
            take_get_instruction,
        }
    }
}).mount('#app');

{%include "js/web_sockets.js"%}
