
/**show edit parameter set type
 */
 showEditParametersetType:function(index){
    app.clearMainFormErrors();
    app.$data.cancelModal=true;
    app.$data.parametersetTypeBeforeEdit = Object.assign({}, app.$data.session.parameter_set.parameter_set_types[index]);
    app.$data.parametersetTypeBeforeEditIndex = index;
    app.$data.current_parameterset_type = app.$data.session.parameter_set.parameter_set_types[index];

    var myModal = new bootstrap.Modal(document.getElementById('editParametersetTypeModal'), {
        keyboard: false
        })

    myModal.toggle();
},

/** hide edit parmeter set type
*/
hideEditParametersetType:function(){
    if(app.$data.cancelModal)
    {
        Object.assign(app.$data.session.parameter_set.parameter_set_types[app.$data.parametersetTypeBeforeEditIndex], app.$data.parametersetTypeBeforeEdit);
        app.$data.parametersetTypeBeforeEdit=null;
    }
},

/** update parameterset type settings
*/
sendUpdateParametersetType(){
    
    app.$data.working = true;
    app.sendMessage("update_parameterset_type", {"sessionID" : app.$data.sessionID,
                                                 "parameterset_type_id" : app.$data.current_parameterset_type.id,
                                                 "formData" : $("#parametersetTypeForm").serializeArray(),});
},

/** handle result of updating parameter set type
*/
takeUpdateParametersetType(messageData){
    //app.$data.cancelModal=false;
    //app.clearMainFormErrors();

    app.$data.cancelModal=false;
    app.clearMainFormErrors();

    if(messageData.status.value == "success")
    {
        app.takeGetSession(messageData);       
        $('#editParametersetTypeModal').modal('hide');            
    } 
    else
    {
        app.$data.cancelModal=true;                           
        app.displayErrors(messageData.status.errors);
    } 
},

