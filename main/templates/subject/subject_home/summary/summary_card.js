sendName(){

    app.working = true;
    app.sendMessage("name", {"formData" : {name: session_player.name, student_id:session_player.student_id}});
                     
},

/** take result of moving goods
*/
takeName(messageData){

    app.clearMainFormErrors();

    if(messageData.status.value == "success")
    {
        app.session_player.name = messageData.status.result.name; 
        app.session_player.student_id = messageData.status.result.student_id;                   
    } 
    else
    {
        app.displayErrors(messageData.status.errors);
    }
},