

/**show edit paramter set
 */
showEditParameterset:function(){
    app.clearMainFormErrors();
    app.$data.cancelModal=true;
    app.$data.paramtersetBeforeEdit = Object.assign({}, app.$data.session.parameter_set);

    var myModal = new bootstrap.Modal(document.getElementById('editParametersetModal'), {
        keyboard: false
        })

    myModal.toggle();
},

/** hide edit session modal
*/
hideEditParameterset:function(){
    if(app.$data.cancelModal)
    {
        Object.assign(app.$data.session.parameter_set, app.$data.paramtersetBeforeEdit);
        app.$data.paramtersetBeforeEdit=null;
    }
},

/** update parameterset settings
*/
sendUpdateParameterset(){
    
    app.$data.working = true;
    app.sendMessage("update_parameterset", {"sessionID" : app.$data.sessionID,
                                            "formData" : $("#parametersetForm").serializeArray(),});
},

/** handle result of updating parameter set
*/
takeUpdateParameterset(messageData){
    //app.$data.cancelModal=false;
    //app.clearMainFormErrors();

    app.$data.cancelModal=false;
    app.clearMainFormErrors();

    if(messageData.status.value == "success")
    {
        app.takeGetSession(messageData);       
        $('#editParametersetModal').modal('hide');            
    } 
    else
    {
        app.$data.cancelModal=true;                           
        app.displayErrors(messageData.status.errors);
    } 
},

