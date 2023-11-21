/**
 * send request for help doc
 * @param title : string
 */
send_load_help_doc_subject: function send_load_help_doc_subject(title){
   
    app.help_text = "Loading ...";

    app.help_modal.show();

    app.send_message("help_doc_subject", {title : title});
},

/**
 * take help text load request
 * @param message_data : json
 */
take_load_help_doc_subject: function take_load_help_doc_subject(message_data){

    if(message_data.value == "success")
    {
        app.help_text = message_data.result.text;
    }
    else
    {
        app.help_text = message_data.message;
    }

    app.working = false;
},

