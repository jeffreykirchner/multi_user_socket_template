
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
        let edit_instruction_modal = ref("");
        let import_instruction_set_modal = ref("");
        let upload_instruction_set_modal = ref("");
        let edit_help_doc_modal = ref("");

        let current_instruction = ref({id:0});
        let instruction_set_import = ref({instruction_set:0});
        let current_help_doc_subject = ref({id:0});

        //upload instruction set
        let upload_file = ref(null);
        let upload_file_name = ref('Choose File');
        let upload_file_text = ref('');
        let upload_instruction_set_button_text = ref('Upload  <i class="fas fa-upload"></i>');
        let upload_instruction_set_message = ref('');
        
        //methods
        function do_first_load()
        {
            tinyMCE.init({
                target: document.getElementById('id_text_html'),
                height : "400",
                theme: "silver",
                convert_urls: false,
                promotion: false,
                auto_focus: 'id_text_html',
                plugins: "directionality,searchreplace,code,link,image,lists",
                    toolbar: "undo redo | styleselect forecolor bold italic alignleft aligncenter alignright alignjustify outdent indent numlist bullist link code image",
                directionality: "{{ directionality }}",
                license_key: 'gpl',
            });

            tinyMCE.init({
                target: document.getElementById('id_text'),
                height : "400",
                theme: "silver",
                convert_urls: false,
                promotion: false,
                auto_focus: 'id_text',
                plugins: "directionality,searchreplace,code,link,image,lists",
                    toolbar: "undo redo | styleselect forecolor bold italic alignleft aligncenter alignright alignjustify outdent indent numlist bullist link code image",
                directionality: "{{ directionality }}",
                license_key: 'gpl',
            });

             // Prevent Bootstrap dialog from blocking focusin
             document.addEventListener('focusin', (e) => {
                if (e.target.closest(".tox-tinymce-aux, .moxman-window, .tam-assetmanager-root") !== null) {
                    e.stopImmediatePropagation();
                }
            });

            app.edit_instruction_set_modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('edit_instruction_set_modal'), {keyboard: false})
            app.edit_instruction_modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('edit_instruction_modal'), {keyboard: false})
            app.import_instruction_set_modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('import_instruction_set_modal'), {keyboard: false})
            app.upload_instruction_set_modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('upload_instruction_set_modal'), {keyboard: false})
            app.edit_help_doc_modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('edit_help_doc_modal'), {keyboard: false})

            document.getElementById('edit_instruction_set_modal').addEventListener('hidden.bs.modal', app.hide_edit_instruction_set_modal);
            document.getElementById('edit_instruction_modal').addEventListener('hidden.bs.modal', app.hide_edit_instruction_modal);
            document.getElementById('import_instruction_set_modal').addEventListener('hidden.bs.modal', app.hide_import_instruction_set_modal);
            document.getElementById('upload_instruction_set_modal').addEventListener('hidden.bs.modal', app.hide_upload_instruction_set);
            document.getElementById('edit_help_doc_modal').addEventListener('hidden.bs.modal', app.hide_edit_help_doc_modal);

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
                case "download_instruction_set":
                    app.take_download_instruction_set(message_data);
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
                app.edit_instruction_modal.hide();
                app.edit_help_doc_modal.hide();
                app.import_instruction_set_modal.hide();
                app.upload_instruction_set_modal.hide();

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
        {%include "staff/staff_instruction_edit/help_doc_subject_card.js"%}

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
            send_delete_instruction,
            edit_instruction_modal,
            current_instruction,
            show_edit_instruction_modal,
            send_update_instruction,
            instruction_set_import,
            show_import_instruction_set_modal,
            send_import_instruction_set,
            hide_import_instruction_set_modal,
            upload_file,
            upload_file_name,
            upload_instruction_set_button_text,
            upload_instruction_set_message,
            send_download_instruction_set,
            take_download_instruction_set,
            send_upload_instruction_set,
            handle_file_upload,
            show_upload_instruction_set,
            upload_file_text,
            edit_help_doc_modal,
            current_help_doc_subject,
            show_edit_help_doc_modal,
            hide_edit_help_doc_modal,
            send_update_help_doc,
            send_add_help_doc,
            send_delete_help_doc,

        }
    }
}).mount('#app');

{%include "js/web_sockets.js"%}
{%include "js/alert_dialog.js"%}
