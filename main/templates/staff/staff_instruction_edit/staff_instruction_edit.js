
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

const { createApp, ref } = Vue
//vue app
let app = createApp({
    delimiters: ["[[", "]]"],

    setup() {
        //variables
        let chat_socket = ref("");
        let reconnecting = ref(true);
        let first_load_done = ref(false);
        let working = ref(false);
        let help_text = ref("Loading ...");
        let instruction_set = ref([]);
        let instrution_set_id = {{instrution_set_id}};
        let paramterset_before_edit = ref(null);
        let form_ids = {{form_ids|safe}};
        let cancel_modal = ref(true);

        //modals
        let edit_instruction_set_modal = ref("");

        function do_first_load()
        {
            app.edit_instruction_set_modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('edit_instruction_set_modal'), {keyboard: false})
           
            document.getElementById('edit_instruction_set_modal').addEventListener('hidden.bs.modal', app.hide_edit_instruction_set_modal);

            app.first_load_done = true;
        }

        //methods
        function handle_socket_connected(){
            //fire when socket connects
            app.send_get_instruction_set();
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
                case "get_instruction_set":
                    app.take_get_instruction_set(message_data);
                    break;
                case "update_instruction_set":
                    app.take_update_instruction_set(message_data);
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

        function send_get_instruction_set(){
            //get list of instruction
            app.send_message("get_instruction_set",{"id":instrution_set_id});
        }

        function take_get_instruction_set(message_data){
            //process list of instruction

            app.cancel_modal = false;
            app.instruction_set = message_data.instruction_set;

            if(!app.first_load_done)
            {
                Vue.nextTick(() => {
                    app.do_first_load();
                });
            }
            
        }

        function take_update_instruction_set(message_data){
            app.clear_main_form_errors();
        
            if(message_data.value == "success")
            {

                app.edit_instruction_set_modal.hide();

                Vue.nextTick(() => {
                    app.take_get_instruction_set(message_data);         
                });       
            } 
            else
            {                      
                app.display_errors(message_data.errors);
            } 
        }

        {%include "staff/staff_instruction_edit/instruction_set_card.js"%}
        {%include "staff/staff_instruction_edit/instruction_card.js"%}

        /** clear form error messages*/
        function clear_main_form_errors(){
    
            for(let item in app.form_ids)
            {
                let e = document.getElementById("id_errors_" + app.form_ids[item]);
                if(e) e.remove();
            }

        }

        /** display form error messages
        */
        function display_errors(errors){
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
        }

        //return                        
        return {
            chat_socket, 
            reconnecting,
            first_load_done, 
            working, 
            help_text, 
            handle_socket_connected,
            handle_socket_connection_try,
            take_message,
            send_message,
            send_get_instruction_set,
            take_get_instruction_set,
            instruction_set,
            edit_instruction_set_modal,
            do_first_load,  
            show_edit_instruction_set_modal,
            hide_edit_instruction_set_modal,
            paramterset_before_edit,
            clear_main_form_errors,
            display_errors,
            send_update_instruction_set,
            take_update_instruction_set,
            form_ids,
            send_add_instruction,
        }
    }
}).mount('#app');

{%include "js/web_sockets.js"%}
