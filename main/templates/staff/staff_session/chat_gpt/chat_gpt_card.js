/**
 * take chat gpt response
 */
take_process_chat_gpt_prompt : function take_chat_gpt_response(message_data) {
    app.session.chat_gpt_history.unshift(message_data);

    if(app.session.chat_gpt_history.length > 20) {
        app.session.chat_gpt_history.pop();
    }
},


    