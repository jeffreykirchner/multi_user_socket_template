
{% load static %}

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

//vue app
var app = Vue.createApp({
    delimiters: ["[[", "]]"],

    data() {return {chat_socket : "",
                    reconnecting : true,
                    working : false,
                    first_load_done : false,          //true after software is loaded for the first time
                    help_text : "Loading ...",
                    session : {{session_json | safe}},
                    parameter_set : {{parameter_set_json | safe}},                   
    
                    current_parameter_set_player : {
                        id:0,
                    },                  

                    parameterset_form_ids: {{parameterset_form_ids|safe}},
                    parameterset_player_form_ids: {{parameterset_player_form_ids|safe}},

                    upload_file: null,
                    upload_file_name:'Choose File',
                    upload_parameter_set_button_text:'Upload  <i class="fas fa-upload"></i>',
                    upload_parameter_set_messaage:'',
                    import_parameters_message : "",

                    //modals
                    import_parameters_modal : null,
                    edit_parameterset_modal : null,
                    edit_parameterset_player_modal : null,

                    //form paramters
                    session_import : null,
                }},
    methods: {

        /** fire when websocket connects to server
        */
        handle_socket_connected(){            
            if(!app.first_load_done)
            {
                Vue.nextTick(() => {
                    app.do_first_load();
                });
            }
        },

        /** take websocket message from server
        *    @param data {json} incoming data from server, contains message and message type
        */
        take_message(data) {

            {%if DEBUG%}
            console.log(data);
            {%endif%}

            message_type = data.message.message_type;
            message_data = data.message.message_data;

            switch(message_type) {                
                case "get_parameter_set":
                    app.take_get_parameter_set(message_data);
                    break;
                case "update_parameter_set":
                    app.take_update_parameter_set(message_data);
                    break;        
                case "update_parameter_set_player":
                    app.take_update_parameter_setPlayer(message_data);
                    break;     
                case "remove_parameterset_player":
                    app.take_remove_parameter_set_player(message_data);
                    break;
                case "add_parameterset_player":
                    app.take_add_parameter_set_player(message_data);
                    break;                
                case "import_parameters":
                    app.take_import_parameters(message_data);
                    break;
                case "download_parameters":
                    app.take_download_parameters(message_data);
                    break;
                case "help_doc":
                    app.take_load_help_doc(message_data);
                    break;
            }

            app.working = false;
        },

        /** send websocket message to server
        *    @param message_type {string} type of message sent to server
        *    @param message_text {json} body of message being sent to server
        */
        send_message(message_type, message_text) {

            app.chat_socket.send(JSON.stringify({
                    'message_type': message_type,
                    'message_text': message_text,
                }));
        },

        do_first_load()
        {
            app.import_parameters_modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('import_parameters_modal'), {keyboard: false})
            app.edit_parameterset_modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('edit_parameterset_modal'), {keyboard: false})            
            app.edit_parameterset_player_modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('edit_parameterset_player_modal'), {keyboard: false})
            app.upload_parameter_set_modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('upload_parameter_set_modal'), {keyboard: false})   
               
            document.getElementById('import_parameters_modal').addEventListener('hidden.bs.modal', app.hide_import_parameters);
            document.getElementById('edit_parameterset_modal').addEventListener('hidden.bs.modal', app.hide_edit_parameter_set);
            document.getElementById('upload_parameter_set_modal').addEventListener('hidden.bs.modal', app.hide_upload_parameters);

            app.first_load_done = true;
        },

        /** take create new session
        *    @param message_data {json} session day in json format
        */
        take_get_parameter_set(message_data){
            
            app.parameter_set = message_data.parameter_set;

            if(app.session.started)
            {
                
            }
            else
            {
                
            }
        },

        /** send winsock request to get session info
        */
        // send_get_session(){
        //     app.send_message("get_parameter_set", {"session_id" : app.session.id});
        // },

        //do nothing on when enter pressed for post
        onSubmit(){
            //do nothing
        },

        {%include "staff/staff_session_parameters/general_settings/general_settings.js"%}
        {%include "staff/staff_session_parameters/control/control.js"%}
        {%include "staff/staff_session_parameters/players/players.js"%}
        {%include "js/help_doc.js"%}
    
        /** clear form error messages
        */
        clear_main_form_errors(){
            
            for(var item in app.session)
            {
                e = document.getElementById("id_errors_" + item);
                if(e) e.remove();
            }

            s = app.parameterset_form_ids;
            for(var i in s)
            {
                e = document.getElementById("id_errors_" + s[i]);
                if(e) e.remove();
            }

            s = app.parameterset_player_form_ids;
            for(var i in s)
            {
                e = document.getElementById("id_errors_" + s[i]);
                if(e) e.remove();
            }
        },

        /** display form error messages
        */
        display_errors(errors){
            for(var e in errors)
                {
                    //e = document.getElementById("id_" + e).getAttribute("class", "form-control is-invalid")
                    var str='<span id=id_errors_'+ e +' class="text-danger">';
                    
                    for(var i in errors[e])
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

  