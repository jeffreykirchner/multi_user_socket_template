/**
 * send request to create new session
 */
sendCreateSession(){
    app.working = true;
    app.createSessionButtonText ='<i class="fas fa-spinner fa-spin"></i>';
    app.sendMessage("create_session",{});
},

/**
 * take crate a new session
 */
takeCreateSession(messageData){    
    app.createSessionButtonText ='Create Session <i class="fas fa-plus"></i>';
    app.takeGetSessions(messageData);
},

/**
 * send request to delete session
 * @param id : int
 */
sendDeleteSession(id){
    app.working = true;
    app.sendMessage("delete_session",{"id" : id});
},