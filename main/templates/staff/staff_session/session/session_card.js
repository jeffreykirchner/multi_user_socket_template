/** send session update form   
*/
sendUpdateSession(){
    app.cancelModal = false;
    app.working = true;
    app.sendMessage("update_session",{"formData" : {title:app.session.title}});
},

/** take update session reponse
 * @param messageData {json} result of update, either sucess or fail with errors
*/
takeUpdateSession(messageData){
    app.clearMainFormErrors();

    if(messageData.status == "success")
    {
        app.takeGetSession(messageData);       
        app.editSessionModal.hide();    
    } 
    else
    {
        app.cancelModal=true;                           
        app.displayErrors(messageData.errors);
    } 
},

/** show edit session modal
*/
showEditSession:function(){
    app.clearMainFormErrors();
    app.cancelModal=true;
    app.sessionBeforeEdit = Object.assign({}, app.session);

    app.editSessionModal.toggle();
},

/** hide edit session modal
*/
hideEditSession:function(){
    if(app.cancelModal)
    {
        Object.assign(app.session, app.sessionBeforeEdit);
        app.sessionBeforeEdit=null;
    }
},