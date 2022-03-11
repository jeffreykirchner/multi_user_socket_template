
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
                    session : {{session_json|safe}},
                   
                    valuecost_modal_label:'Edit Value or Cost',
                    current_parameterset_type:{                       //json attached to parameterset type edit modal
                        id:0,
                        good_one_amount:0,
                        good_two_amount:0,
                        good_one_production_1:0,
                        good_one_production_2:0,
                        good_one_production_3:0,
                        good_two_production_1:0,
                        good_two_production_2:0,
                        good_two_production_3:0,
                    },
                    current_parameter_set_player : {
                        id:0,
                        id_label:"",
                        location:1,      
                        subject_type:"",            
                        good_one:{id:0},
                        good_two:{id:0},
                        good_three:{id:0},
                        avatar:{id:0},
                        parameter_set_type:{id:0},     
                    },
                    current_parameter_set_player_group : {
                        id : 0,
                        group_number : 0,
                        period :0,
                    },
                    current_parameter_set_good:{
                        id : 0,
                        label : 0,
                        rgb_color :0,
                    },
                    current_parameter_set_avatar:{
                        id : 0,
                        grid_location_row : 0,
                        grid_location_col : 0,
                        avatar : {id:0},
                    },

                    parameterset_form_ids: {{parameterset_form_ids|safe}},
                    parameterset_type_form_ids: {{parameterset_type_form_ids|safe}},
                    parameterset_player_form_ids: {{parameterset_player_form_ids|safe}},
                    parameterset_player_group_form_ids: {{parameterset_player_group_form_ids|safe}},
                    parameterset_good_form_ids: {{parameterset_good_form_ids|safe}},
                    parameterset_avatar_form_ids: {{parameterset_avatar_form_ids|safe}},

                    upload_file: null,
                    upload_file_name:'Choose File',
                    uploadParametersetButtonText:'Upload  <i class="fas fa-upload"></i>',
                    uploadParametersetMessaage:'',
                    // show_parameters:false,
                    import_parameters_message : "",

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
                case "update_session":
                    app.takeUpdateSession(messageData);
                    break;
                case "update_parameterset":
                    app.takeUpdateParameterset(messageData);
                    break;         
                case "update_parameterset_type":
                    app.takeUpdateParametersetType(messageData);
                    break;    
                case "update_parameterset_good":
                    app.takeUpdateParametersetGood(messageData);
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
                case "update_parameterset_player_group":
                    app.takeUpdateParametersetPlayerGroup(messageData);
                    break;
                case "copy_group_forward":
                    app.takeCopyGroupForward(messageData);
                    break;
                case "import_parameters":
                    app.takeImportParameters(messageData);
                    break;
                case "download_parameters":
                    app.takeDownloadParameters(messageData);
                    break;
                case "update_parameterset_avatar":
                    app.takeUpdateParametersetAvatar(messageData);
                    break;
                case "help_doc":
                    app.takeLoadHelpDoc(messageData);
                    break;
            }

            // if(!app.$data.first_load_done)
            // {
            //     if(!app.$data.session.started)
            //     {
            //         app.$data.show_parameters = true;
            //     }
            // }

            app.$data.first_load_done = true;

            app.working = false;
            //Vue.nextTick(app.update_sdgraph_canvas());
        },

        /** send websocket message to server
        *    @param messageType {string} type of message sent to server
        *    @param messageText {json} body of message being sent to server
        */
        sendMessage(messageType, messageText) {
            

            app.$data.chatSocket.send(JSON.stringify({
                    'messageType': messageType,
                    'messageText': messageText,
                }));
        },

        /** take create new session
        *    @param messageData {json} session day in json format
        */
        takeGetSession(messageData){
            
            app.$data.session = messageData.session;

            if(app.$data.session.started)
            {
                
            }
            else
            {
                
            }                     
        },

        /** send winsock request to get session info
        */
        sendGetSession(){
            app.sendMessage("get_session",{"sessionID" : app.$data.sessionID});
        },

        /** send session update form   
        */
        sendUpdateSession(){
            app.$data.cancelModal = false;
            app.$data.working = true;
            app.sendMessage("update_session",{"formData" : $("#sessionForm").serializeArray(),
                                              "sessionID" : app.$data.sessionID});
        },

        /** take update session reponse
         * @param messageData {json} result of update, either sucess or fail with errors
        */
        takeUpdateSession(messageData){
            app.clearMainFormErrors();

            if(messageData.status == "success")
            {
                app.takeGetSession(messageData);       
                $('#editSessionModal').modal('hide');    
            } 
            else
            {
                app.$data.cancelModal=true;                           
                app.displayErrors(messageData.errors);
            } 
        },

        //do nothing on when enter pressed for post
        onSubmit(){
            //do nothing
        },

        {%include "staff/staff_session_parameters/general_settings/general_settings.js"%}
        {%include "staff/staff_session_parameters/good_settings/good_settings.js"%}
        {%include "staff/staff_session_parameters/control/control.js"%}
        {%include "staff/staff_session_parameters/player_types/player_type.js"%}
        {%include "staff/staff_session_parameters/players/players.js"%}
        {%include "staff/staff_session_parameters/avatars/avatars.js"%}
        {%include "js/help_doc.js"%}
    
        /** clear form error messages
        */
        clearMainFormErrors(){
            
            for(var item in app.$data.session)
            {
                $("#id_" + item).attr("class","form-control");
                $("#id_errors_" + item).remove();
            }

            s = app.$data.parameterset_form_ids;
            for(var i in s)
            {
                $("#id_" + s[i]).attr("class","form-control");
                $("#id_errors_" + s[i]).remove();
            }

            s = app.$data.parameterset_type_form_ids;
            for(var i in s)
            {
                $("#id_" + s[i]).attr("class","form-control");
                $("#id_errors_" + s[i]).remove();
            }

            s = app.$data.parameterset_player_form_ids;
            for(var i in s)
            {
                $("#id_" + s[i]).attr("class","form-control");
                $("#id_errors_" + s[i]).remove();
            }

            s = app.$data.parameterset_player_group_form_ids;
            for(var i in s)
            {
                $("#id_" + s[i]).attr("class","form-control");
                $("#id_errors_" + s[i]).remove();
            }

            s = app.$data.parameterset_good_form_ids;
            for(var i in s)
            {
                $("#id_" + s[i]).attr("class","form-control");
                $("#id_errors_" + s[i]).remove();
            }

            s = app.$data.parameterset_avatar_form_ids;
            for(var i in s)
            {
                $("#id_" + s[i]).attr("class","form-control");
                $("#id_errors_" + s[i]).remove();
            }
        },

        /** display form error messages
        */
        displayErrors(errors){
            for(var e in errors)
            {
                $("#id_" + e).attr("class","form-control is-invalid")
                var str='<span id=id_errors_'+ e +' class="text-danger">';
                
                for(var i in errors[e])
                {
                    str +=errors[e][i] + '<br>';
                }

                str+='</span>';
                $("#div_id_" + e).append(str); 

                var elmnt = document.getElementById("div_id_" + e);
                elmnt.scrollIntoView(); 

            }
        }, 
    },

    mounted(){
        $('#editSessionModal').on("hidden.bs.modal", this.hideEditSession); 
        $('#importParametersModal').on("hidden.bs.modal", this.hideImportParameters); 
        $('#editParametersetModal').on("hidden.bs.modal", this.hideEditParameterset);
        $('#editParametersetTypeModal').on("hidden.bs.modal", this.hideEditParametersetType);
        $('#editParametersetPlayerModal').on("hidden.bs.modal", this.hideEditParametersetPlayer);
        $('#editParametersetPlayerGroupModal').on("hidden.bs.modal", this.hideEditParametersetPlayerGroup);
        $('#editParametersetGoodModal').on("hidden.bs.modal", this.hideEditParametersetGood);
        $('#editAvatarsModal').on("hidden.bs.modal", this.hideEditParametersetAvatar);
    },

}).mount('#app');

{%include "js/web_sockets.js"%}

  