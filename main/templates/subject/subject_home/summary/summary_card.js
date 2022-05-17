sendName(){

    app.working = true;
    app.sendMessage("name", {"formData" : {name : app.session_player.name, student_id : app.session_player.student_id}});
                     
},

/** take result of submitting name
*/
takeName(messageData){

    app.clearMainFormErrors();

    if(messageData.status.value == "success")
    {
        app.session_player.name = messageData.status.result.name; 
        app.session_player.student_id = messageData.status.result.student_id;           
        app.session_player.name_submitted = messageData.status.result.name_submitted;       
    } 
    else
    {
        app.displayErrors(messageData.status.errors);
    }
},