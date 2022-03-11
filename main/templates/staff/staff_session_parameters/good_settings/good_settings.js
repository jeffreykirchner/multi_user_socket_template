/**show edit parameter set good
 */
 showEditParametersetGood:function(good_id, index){

    app.clearMainFormErrors();
    app.$data.cancelModal=true;
    app.$data.parametersetGoodBeforeEdit = Object.assign({}, app.$data.session.parameter_set.parameter_set_goods[index]);
    app.$data.parametersetGoodEditIndex = index;
    app.$data.parametersetGoodBeforeEditIndex = good_id;
    app.$data.current_parameter_set_good = app.$data.session.parameter_set.parameter_set_goods[index];

    var myModal = new bootstrap.Modal(document.getElementById('editParametersetGoodModal'), {
        keyboard: false
        })

    myModal.toggle();
},

/** hide edit parmeter set good
*/
hideEditParametersetGood:function(){
    if(app.$data.cancelModal)
    {
        Object.assign(app.$data.session.parameter_set.parameter_set_goods[app.$data.parametersetPlayerBeforeEditIndex],
                      app.$data.parametersetGoodBeforeEdit);
        app.$data.parametersetGoodBeforeEdit=null;
    }
},

/** update parameterset good settings
*/
sendUpdateParametersetGood(){
    
    app.$data.working = true;
    app.sendMessage("update_parameterset_good", {"sessionID" : app.$data.sessionID,
                                                 "parameterset_good_id" : app.$data.current_parameter_set_good.id,
                                                 "formData" : $("#parametersetGoodForm").serializeArray(),});
},

/** handle result of updating parameter set good
*/
takeUpdateParametersetGood(messageData){

    app.$data.cancelModal=false;
    app.clearMainFormErrors();

    if(messageData.status.value == "success")
    {
        app.takeGetSession(messageData);       
        $('#editParametersetGoodModal').modal('hide');        
        location.reload();    
    } 
    else
    {
        app.$data.cancelModal=true;                           
        app.displayErrors(messageData.status.errors);
    } 
},