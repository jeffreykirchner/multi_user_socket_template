/**
 * send chat gpt prompt to server
 *  */ 
send_process_chat_gpt_prompt : function send_process_chat_gpt_prompt(message_data) {

    if(app.chat_working || app.working) {
        return;
    }

    let session_player = app.session.world_state.session_players[app.session_player.id];
    if(session_player.status != "Chatting") {
        return;
    }

    //check for empty prompt
    if(app.chat_text.trim().length == 0) {
        return;
    }

    app.chat_working = true;

    let prompt = {"role":"user", "content": app.chat_text};

    app.chat_history.unshift(prompt);
    app.scroll_chat_gpt_history_to_bottom("chat_message_0");
    //set to font awesome spinner
    app.chat_button_text = '<i class="fas fa-spinner fa-spin"></i>';   

    app.send_message("process_chat_gpt_prompt", 
                     {"prompt": app.chat_text,
                      "current_period": app.session.world_state.current_period, 
                     },
                      "self");

    app.chat_text = "";
},

/**
 * take chat gpt response
 */
take_process_chat_gpt_prompt : function take_chat_gpt_response(message_data) {
    app.chat_working = false;
    app.chat_button_text = 'Chat <i class="far fa-comments"></i>';

    if (message_data.status == "success") {       
        app.chat_history.unshift(message_data.response);     
        app.scroll_chat_gpt_history_to_bottom("chat_message_1");   
    } else {
        
    }

    if(app.session.world_state.current_experiment_phase == 'Instructions') {
        app.session_player.current_instruction_complete = app.instructions.action_page_3;
        app.session.world_state.session_players[app.session_player.id].status = "Waiting";
    }
},

/**
 * clear chat gpt history
 */
send_clear_chat_gpt_history: function send_clear_chat_gpt_history() {
    if(app.chat_working) {
        return;
    }

    app.clear_chat_gpt_history_modal.hide();
    app.chat_working = true;
    app.send_message("clear_chat_gpt_history", 
                     {},
                      "self");
},

/**
 * take clear chat gpt history
 */
take_clear_chat_gpt_history: function take_clear_chat_gpt_history(message_data) {
    app.chat_working = false;
    
    if (message_data.status == "success") {
        app.chat_history = message_data.chat_history;
    } else {
       
    }
},

/**
 * send done chatting
 */
send_done_chatting: function send_done_chatting(auto_submit = false) {

    app.chat_working = true;
    app.session.world_state.session_players[app.session_player.id].status = "Finished_Chatting";

    app.send_message("done_chatting", 
                     {"current_period": app.session.world_state.current_period,
                      "auto_submit": auto_submit,
                     }, 
                     "group");
},

/**
 * take done chatting
 */
take_done_chatting: function take_done_chatting(message_data) {
    app.chat_working = false;
    
    let subject_status = message_data.subject_status;

    for (let i in subject_status) {
        app.session.world_state.session_players[i].status = subject_status[i];
    }

    app.setup_timer();
},

/**
 * scroll to this element in chat gpt history
 */
scroll_chat_gpt_history_to_bottom: function scroll_chat_gpt_history_to_bottom(id) {
    Vue.nextTick(() => {
        // if (app.last_scroll_chat_gpt_history_to_bottom == id) {
        //     return;
        // }
        // app.last_scroll_chat_gpt_history_to_bottom = id;        
        document.getElementById(id).scrollIntoView();
    });
},


    