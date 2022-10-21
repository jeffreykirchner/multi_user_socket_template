
{% load static %}

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

//vue app
var app = Vue.createApp({
    delimiters: ["[[", "]]"],

    data() {return {chatSocket : "",
                    reconnecting : true,
                    working : false,
                    first_load_done : false,          //true after software is loaded for the first time
                    helpText : "Loading ...",
                    sessionID : {{session.id}},
                    session : null,                   
    
                    current_parameter_set_player : {
                        id:0,
                    },                  

                    parameterset_form_ids: {{parameterset_form_ids|safe}},
                    parameterset_player_form_ids: {{parameterset_player_form_ids|safe}},

                    upload_file: null,
                    upload_file_name:'Choose File',
                    uploadParametersetButtonText:'Upload  <i class="fas fa-upload"></i>',
                    uploadParametersetMessaage:'',
                    import_parameters_message : "",

                    //modals
                    importParametersModal : null,
                    editParametersetModal : null,
                    editParametersetPlayerModal : null,

                    //form paramters
                    session_import : null,
                }},
    methods: {

        /** fire when websocket connects to server
        */
        handleSocketConnected(){            
            app.sendGetSession();
        },

        /** take websocket message from server
        *    @param data {json} incoming data from server, contains message and message type
        */
        takeMessage(data) {

            {%if DEBUG%}
            console.log(data);
            {%endif%}

            messageType = data.message.messageType;
            messageData = data.message.messageData;

            switch(messageType) {                
                case "get_session":
                    app.takeGetSession(messageData);
                    break;
                case "update_parameterset":
                    app.takeUpdateParameterset(messageData);
                    break;        
                case "update_parameterset_player":
                    app.takeUpdateParametersetPlayer(messageData);
                    break;     
                case "remove_parameterset_player":
                    app.takeRemoveParameterSetPlayer(messageData);
                    break;
                case "add_parameterset_player":
                    app.takeAddParameterSetPlayer(messageData);
                    break;                
                case "import_parameters":
                    app.takeImportParameters(messageData);
                    break;
                case "download_parameters":
                    app.takeDownloadParameters(messageData);
                    break;
                case "help_doc":
                    app.takeLoadHelpDoc(messageData);
                    break;
            }

            app.first_load_done = true;

            app.working = false;
        },

        /** send websocket message to server
        *    @param messageType {string} type of message sent to server
        *    @param messageText {json} body of message being sent to server
        */
        sendMessage(messageType, messageText) {

            app.chatSocket.send(JSON.stringify({
                    'messageType': messageType,
                    'messageText': messageText,
                }));
        },

        doFirstLoad()
        {
            app.importParametersModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('importParametersModal'), {keyboard: false})
            app.editParametersetModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('editParametersetModal'), {keyboard: false})            
            app.editParametersetPlayerModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('editParametersetPlayerModal'), {keyboard: false})   
            app.editParametersetPlayerModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('editParametersetPlayerModal'), {keyboard: false})         
   
            document.getElementById('importParametersModal').addEventListener('hidden.bs.modal', app.hideImportParameters);
            document.getElementById('editParametersetModal').addEventListener('hidden.bs.modal', app.hideEditParameterset);
            document.getElementById('editParametersetPlayerModal').addEventListener('hidden.bs.modal', app.hideEditParametersetPlayer);

        },

        /** take create new session
        *    @param messageData {json} session day in json format
        */
        takeGetSession(messageData){
            
            app.session = messageData.session;

            if(app.session.started)
            {
                
            }
            else
            {
                
            }
            
            if(!app.first_load_done)
            {
                setTimeout(app.doFirstLoad, 500);
            }
        },

        /** send winsock request to get session info
        */
        sendGetSession(){
            app.sendMessage("get_session",{"sessionID" : app.sessionID});
        },

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
        clearMainFormErrors(){
            
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
        displayErrors(errors){
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

  