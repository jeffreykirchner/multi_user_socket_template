/**show edit parameter set player
 */
 showEditParametersetPlayer:function(index){
    
    if(app.$data.session.started) return;
    
    app.clearMainFormErrors();
    app.$data.cancelModal=true;
    app.$data.parametersetPlayerBeforeEdit = Object.assign({}, app.$data.session.parameter_set.parameter_set_players[index]);
    app.$data.parametersetPlayerBeforeEdit.good_one =  Object.assign({}, app.$data.session.parameter_set.parameter_set_players[index].good_one);
    app.$data.parametersetPlayerBeforeEdit.good_two =  Object.assign({}, app.$data.session.parameter_set.parameter_set_players[index].good_two);
    app.$data.parametersetPlayerBeforeEdit.good_three =  Object.assign({}, app.$data.session.parameter_set.parameter_set_players[index].good_three);
    app.$data.parametersetPlayerBeforeEdit.parameter_set_type =  Object.assign({}, app.$data.session.parameter_set.parameter_set_players[index].parameter_set_type);
    app.$data.parametersetPlayerBeforeEdit.avatar =  Object.assign({}, app.$data.session.parameter_set.parameter_set_players[index].avatar);

    app.$data.parametersetPlayerBeforeEditIndex = index;
    app.$data.current_parameter_set_player = app.$data.session.parameter_set.parameter_set_players[index];
    

    var myModal = new bootstrap.Modal(document.getElementById('editParametersetPlayerModal'), {
        keyboard: false
        })

    myModal.toggle();
},

/** hide edit parmeter set player
*/
hideEditParametersetPlayer:function(){
    if(app.$data.cancelModal)
    {
        Object.assign(app.$data.session.parameter_set.parameter_set_players[app.$data.parametersetPlayerBeforeEditIndex], app.$data.parametersetPlayerBeforeEdit);

        Object.assign(app.$data.session.parameter_set.parameter_set_players[app.$data.parametersetPlayerBeforeEditIndex].good_one, app.$data.parametersetPlayerBeforeEdit.good_one);
        Object.assign(app.$data.session.parameter_set.parameter_set_players[app.$data.parametersetPlayerBeforeEditIndex].good_two, app.$data.parametersetPlayerBeforeEdit.good_two);
        Object.assign(app.$data.session.parameter_set.parameter_set_players[app.$data.parametersetPlayerBeforeEditIndex].good_three, app.$data.parametersetPlayerBeforeEdit.good_three);
        Object.assign(app.$data.session.parameter_set.parameter_set_players[app.$data.parametersetPlayerBeforeEditIndex].parameter_set_type, app.$data.parametersetPlayerBeforeEdit.parameter_set_type);
        Object.assign(app.$data.session.parameter_set.parameter_set_players[app.$data.parametersetPlayerBeforeEditIndex].avatar, app.$data.parametersetPlayerBeforeEdit.avatar);

        app.$data.parametersetPlayerBeforeEdit=null;
    }
},

/** update parameterset type settings
*/
sendUpdateParametersetPlayer(){
    
    app.$data.working = true;
    app.sendMessage("update_parameterset_player", {"sessionID" : app.$data.sessionID,
                                                   "paramterset_player_id" : app.$data.current_parameter_set_player.id,
                                                   "formData" : $("#parametersetPlayerForm").serializeArray(),});
},

/** handle result of updating parameter set player
*/
takeUpdateParametersetPlayer(messageData){
    //app.$data.cancelModal=false;
    //app.clearMainFormErrors();

    app.$data.cancelModal=false;
    app.clearMainFormErrors();

    if(messageData.status.value == "success")
    {
        app.takeGetSession(messageData);       
        $('#editParametersetPlayerModal').modal('hide');        
    } 
    else
    {
        app.$data.cancelModal=true;                           
        app.displayErrors(messageData.status.errors);
    } 
},

/**show edit parameter set player group
 */
 showEditParametersetPlayerGroup:function(player_id, period_id){
     
    if(app.$data.session.started) return;

    app.clearMainFormErrors();
    app.$data.cancelModal=true;
    app.$data.parametersetPlayerGroupBeforeEdit = Object.assign({}, app.$data.session.parameter_set.parameter_set_players[player_id].period_groups[period_id]);
    app.$data.parametersetPlayerBeforeEditIndex = player_id;
    app.$data.parametersetPlayerGroupBeforeEditIndex = period_id;
    app.$data.current_parameter_set_player_group = app.$data.session.parameter_set.parameter_set_players[player_id].period_groups[period_id];

    var myModal = new bootstrap.Modal(document.getElementById('editParametersetPlayerGroupModal'), {
        keyboard: false
        })

    myModal.toggle();
},

/** hide edit parmeter set player group
*/
hideEditParametersetPlayerGroup:function(){
    if(app.$data.cancelModal)
    {
        Object.assign(app.$data.session.parameter_set.parameter_set_players[app.$data.parametersetPlayerBeforeEditIndex].period_groups[app.$data.parametersetPlayerGroupBeforeEditIndex],
                      app.$data.parametersetPlayerGroupBeforeEdit);
        app.$data.parametersetPlayerBeforeEdit=null;
    }
},

/** update parameterset player group settings
*/
sendUpdateParametersetPlayerGroup(){
    
    app.$data.working = true;
    app.sendMessage("update_parameterset_player_group", {"sessionID" : app.$data.sessionID,
                                                   "paramterset_player_group_id" : app.$data.current_parameter_set_player_group.id,
                                                   "formData" : $("#parametersetPlayerGroupForm").serializeArray(),});
},

/** handle result of updating parameter set player group
*/
takeUpdateParametersetPlayerGroup(messageData){
    //app.$data.cancelModal=false;
    //app.clearMainFormErrors();

    app.$data.cancelModal=false;
    app.clearMainFormErrors();

    if(messageData.status.value == "success")
    {
        app.takeGetSession(messageData);       
        $('#editParametersetPlayerGroupModal').modal('hide');            
    } 
    else
    {
        app.$data.cancelModal=true;                           
        app.displayErrors(messageData.status.errors);
    } 
},

/** copy specified period's groups forward to future groups
*/
sendCopyGroupForward(period_number){
    app.$data.working = true;
    app.sendMessage("copy_group_forward", {"sessionID" : app.$data.sessionID,
                                           "period_number" : period_number,});
                                                   
},

/** handle result of copying groups forward
*/
takeCopyGroupForward(messageData){
    //app.$data.cancelModal=false;
    //app.clearMainFormErrors();

    app.takeGetSession(messageData);   
},

/** copy specified period's groups forward to future groups
*/
sendRemoveParameterSetPlayer(){

    app.$data.working = true;
    app.sendMessage("remove_parameterset_player", {"sessionID" : app.$data.sessionID,
                                                   "paramterset_player_id" : app.$data.current_parameter_set_player.id,});
                                                   
},

/** handle result of copying groups forward
*/
takeRemoveParameterSetPlayer(messageData){
    app.$data.cancelModal=false;
    //app.clearMainFormErrors();
    app.takeGetSession(messageData);   
    $('#editParametersetPlayerModal').modal('hide');
},

/** copy specified period's groups forward to future groups
*/
sendAddParameterSetPlayer(player_id){
    app.$data.working = true;
    app.sendMessage("add_parameterset_player", {"sessionID" : app.$data.sessionID});
                                                   
},

/** handle result of copying groups forward
*/
takeAddParameterSetPlayer(messageData){
    //app.$data.cancelModal=false;
    //app.clearMainFormErrors();
    app.takeGetSession(messageData); 
},
