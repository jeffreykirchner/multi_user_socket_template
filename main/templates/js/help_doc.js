/**
 * send request for help doc
 * @param title : string
 */
sendLoadHelpDoc(title){
    this.working = true;
    this.helpText = "Loading ...";

    var myModal = new bootstrap.Modal(document.getElementById('helpModal'), {
        keyboard: false
        })

    myModal.toggle();

    app.sendMessage("help_doc", {title : title});
},

/**
 * take help text load request
 * @param messageData : json
 */
takeLoadHelpDoc(messageData){

    if(messageData.status.value == "success")
    {
        this.helpText = messageData.status.result.help_doc.text;
    }
    else
    {
        this.helpText = messageData.status.message;
    }
},

