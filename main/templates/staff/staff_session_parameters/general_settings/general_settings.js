

/**show edit paramter set
 */
showEditParameterset:function(){
    app.clearMainFormErrors();
    app.cancelModal=true;
    app.paramtersetBeforeEdit = Object.assign({}, app.session.parameter_set);

    app.editParametersetModal.toggle();
},

/** hide edit session modal
*/
hideEditParameterset:function(){
    if(app.cancelModal)
    {
        Object.assign(app.session.parameter_set, app.paramtersetBeforeEdit);
        app.paramtersetBeforeEdit=null;
    }
},

/** update parameterset settings
*/
sendUpdateParameterset(){
    
    app.working = true;

    formData = {}

    for(i=0;i<app.parameterset_form_ids.length;i++)
    {
        v=app.parameterset_form_ids[i];
        formData[v]=app.session.parameter_set[v];
    }

    app.sendMessage("update_parameterset", {"sessionID" : app.sessionID,
                                            "formData" : formData});
},

/** handle result of updating parameter set
*/
takeUpdateParameterset(messageData){
    //app.cancelModal=false;
    //app.clearMainFormErrors();

    app.cancelModal=false;
    app.clearMainFormErrors();

    if(messageData.status.value == "success")
    {
        app.takeGetSession(messageData);       
        app.editParametersetModal.hide();            
    } 
    else
    {
        app.cancelModal=true;                           
        app.displayErrors(messageData.status.errors);
    } 
},

