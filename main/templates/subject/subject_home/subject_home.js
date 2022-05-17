
{% load static %}

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

//vue app
var app = Vue.createApp({
    delimiters: ["[[", "]]"],

    data() {return {chatSocket : "",
                    reconnecting : true,
                    is_subject : true,
                    working : false,
                    first_load_done : false,                       //true after software is loaded for the first time
                    playerKey : "{{session_player.player_key}}",
                    owner_color : 0xA9DFBF,
                    other_color : 0xD3D3D3,
                    session_player : {{session_player_json|safe}}, 
                    session : {{session_json|safe}},

                    end_game_form_ids: {{end_game_form_ids|safe}},

                    chat_text : "",
                    chat_recipients : "all",
                    chat_recipients_index : 0,
                    chat_button_label : "Everyone",
                    chat_list_to_display : [],                //list of chats to display on screen

                    end_game_modal_visible : false,
                    avatar_choice_modal_visible : false,

                    instruction_pages : {{instruction_pages|safe}},

                    // modals
                    endGameModal : null,
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
                case "update_start_experiment":
                    app.takeUpdateStartExperiment(messageData);
                    break;
                case "update_reset_experiment":
                    app.takeUpdateResetExperiment(messageData);
                    break;
                case "chat":
                    app.takeChat(messageData);
                    break;
                case "update_chat":
                    app.takeUpdateChat(messageData);
                    break;
                case "update_time":
                    app.takeUpdateTime(messageData);
                    break;
                case "update_end_game":
                    app.takeEndGame(messageData);
                    break;
                case "name":
                    app.takeName(messageData);
                    break;
                case "update_next_phase":
                    app.takeUpdateNextPhase(messageData);
                    break;
                case "next_instruction":
                    app.takeNextInstruction(messageData);
                    break;
                case "finish_instructions":
                    app.takeFinishInstructions(messageData);
                    break;
                
            }

            this.first_load_done = true;

            this.working = false;
        },

        /** send websocket message to server
        *    @param messageType {string} type of message sent to server
        *    @param messageText {json} body of message being sent to server
        */
        sendMessage(messageType, messageText) {            

            this.chatSocket.send(JSON.stringify({
                    'messageType': messageType,
                    'messageText': messageText,
                }));
        },

        /**
         * do after session has loaded
         */
         doFirstLoad()
         {           
             app.endGameModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('endGameModal'), {keyboard: false})           
             document.getElementById('endGameModal').addEventListener('hidden.bs.modal', app.hideEndGameModal);

             {%if session.parameter_set.test_mode%} setTimeout(this.doTestMode, this.randomNumber(1000 , 1500)); {%endif%}

            // if game is finished show modal
            if(app.session.finished)
            {
                this.showEndGameModal();
            }
         },

        /** send winsock request to get session info
        */
        sendGetSession(){
            app.sendMessage("get_session", {"playerKey" : this.playerKey});
        },
        
        /** take create new session
        *    @param messageData {json} session day in json format
        */
        takeGetSession(messageData){
            

            app.session = messageData.status.session;
            app.session_player = messageData.status.session_player;

            if(app.session.started)
            {
               
            }
            else
            {
                
            }            
            
            if(this.session.current_experiment_phase != 'Done')
            {
                                
                if(this.session.current_experiment_phase != 'Instructions')
                {
                    app.updateChatDisplay();               
                }
            }

            if(this.session.current_experiment_phase == 'Instructions')
            {
                setTimeout(this.processInstructionPage, 1000);
                this.instructionDisplayScroll();
            }

            if(!app.first_load_done)
            {
                setTimeout(app.doFirstLoad, 500);
            }
        },

        /** update start status
        *    @param messageData {json} session day in json format
        */
        takeUpdateStartExperiment(messageData){
            app.takeGetSession(messageData);
        },

        /** update reset status
        *    @param messageData {json} session day in json format
        */
        takeUpdateResetExperiment(messageData){
            app.takeGetSession(messageData);

            app.endGameModal.hide();            
        },

        /**
        * update time and start status
        */
        takeUpdateTime(messageData){
            let result = messageData.status.result;
            let status = messageData.status.value;
            let notice_list = messageData.status.notice_list;

            if(status == "fail") return;

            this.session.started = result.started;
            this.session.current_period = result.current_period;
            this.session.time_remaining = result.time_remaining;
            this.session.timer_running = result.timer_running;
            this.session.finished = result.finished;

            //update subject earnings
            this.session_player.earnings = result.session_player_earnings.earnings;

            //session complete
            if(app.session.finished)
            {
                this.showEndGameModal();
            }            
        },

        /**
         * show the end game modal
         */
        showEndGameModal(){
            if(this.end_game_modal_visible) return;
   
            app.endGameModal.toggle();

            this.end_game_modal_visible = true;
        },

         /**
         * take end of game notice
         */
        takeEndGame(messageData){

        },

      
        /** take next period response
         * @param messageData {json}
        */
        takeUpdateNextPhase(messageData){
            app.endGameModal.hide();

            this.session.current_experiment_phase = messageData.status.session.current_experiment_phase;
            this.session.session_players = messageData.status.session_players;
            this.session_player = messageData.status.session_player;

            app.updateChatDisplay();          
        },

        /** hide choice grid modal modal
        */
        hideChoiceGridModal(){
            this.avatar_choice_modal_visible=false;
        },

        /** hide choice grid modal modal
        */
        hideEndGameModal(){
            this.end_game_modal_visible=false;
        },

        //do nothing on when enter pressed for post
        onSubmit(){
            //do nothing
        },
        
        {%include "subject/subject_home/chat/chat_card.js"%}
        {%include "subject/subject_home/summary/summary_card.js"%}
        {%include "subject/subject_home/test_mode/test_mode.js"%}
        {%include "subject/subject_home/instructions/instructions_card.js"%}
    
        /** clear form error messages
        */
        clearMainFormErrors(){
            
            for(var item in app.session)
            {
                e = document.getElementById("id_errors_" + item);
                if(e) e.remove();
            }

            s = this.end_game_form_ids;
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

        /**
         * return session player that has specified id
         */
        findSessionPlayer(id){

            let session_players = app.session.session_players;
            for(let i=0; i<session_players.length; i++)
            {
                if(session_players[i].id == id)
                {
                    return session_players[i];
                }
            }

            return null;
        },

        /**
         * return session player index that has specified id
         */
        findSessionPlayerIndex(id){

            let session_players = app.session.session_players;
            for(let i=0; i<session_players.length; i++)
            {
                if(session_players[i].id == id)
                {
                    return i;
                }
            }

            return null;
        },

    },

    mounted(){
        
    },

}).mount('#app');

{%include "js/web_sockets.js"%}

  