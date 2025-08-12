/**
 * send chat gpt prompt to server
 *  */ 
send_process_chat_gpt_prompt : function send_process_chat_gpt_prompt(message_data) {

    if(app.chat_gpt_working || app.working) {
        return;
    }

    //check for empty prompt
    if(app.chat_gpt_text.trim().length == 0) {
        return;
    }

    app.chat_gpt_working = true;

    let prompt = {"role":"user", "content": app.chat_gpt_text};

    app.chat_gpt_history.unshift(prompt);
    app.scroll_chat_gpt_history_to_bottom("chat_gpt_message_0");
    //set to font awesome spinner
    app.chat_gpt_button_text = '<i class="fas fa-spinner fa-spin"></i>';   

    app.send_message("process_chat_gpt_prompt", 
                     {"prompt": app.chat_gpt_text,
                      "current_period": app.session.world_state.current_period, 
                     },
                      "self");

    app.chat_gpt_text = "";
},

/**
 * take chat gpt response
 */
take_process_chat_gpt_prompt : function take_chat_gpt_response(message_data) {
    app.chat_gpt_working = false;
    app.chat_gpt_button_text = 'Chat <i class="far fa-comments"></i>';

    if (message_data.status == "success") {       
        app.chat_gpt_history.unshift(message_data.response);     
        app.scroll_chat_gpt_history_to_bottom("chat_gpt_message_1");   
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
    if(app.chat_gpt_working) {
        return;
    }

    // app.clear_chat_gpt_history_modal.hide();
    app.chat_gpt_working = true;
    app.send_message("clear_chat_gpt_history", 
                     {},
                      "self");
},

/**
 * take clear chat gpt history
 */
take_clear_chat_gpt_history: function take_clear_chat_gpt_history(message_data) {
    app.chat_gpt_working = false;

    if (message_data.status == "success") {
        app.chat_gpt_history = message_data.chat_gpt_history;
    } else {
       
    }
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


    