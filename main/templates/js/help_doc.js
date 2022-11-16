/**
 * send request for help doc
 * @param title : string
 */
send_load_help_doc(title){
    app.working = true;
    app.help_text = "Loading ...";

    let help_modal = new bootstrap.Modal(document.getElementById('help_modal'), {
        keyboard: false
        })

    help_modal.toggle();

    app.send_message("help_doc", {title : title});
},

/**
 * take help text load request
 * @param message_data : json
 */
take_load_help_doc(message_data){

    if(message_data.status.value == "success")
    {
        app.help_text = message_data.status.result.help_doc.text;
    }
    else
    {
        app.help_text = message_data.status.message;
    }
},

