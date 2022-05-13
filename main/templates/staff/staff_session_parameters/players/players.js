/**show edit parameter set player
 */
 showEditParametersetPlayer:function(index){
    
    if(app.session.started) return;
    
    app.clearMainFormErrors();
    app.cancelModal=true;
    app.parametersetPlayerBeforeEdit = Object.assign({}, app.session.parameter_set.parameter_set_players[index]);
    app.parametersetPlayerBeforeEdit.good_one =  Object.assign({}, app.session.parameter_set.parameter_set_players[index].good_one);
    app.parametersetPlayerBeforeEdit.good_two =  Object.assign({}, app.session.parameter_set.parameter_set_players[index].good_two);
    app.parametersetPlayerBeforeEdit.good_three =  Object.assign({}, app.session.parameter_set.parameter_set_players[index].good_three);
    app.parametersetPlayerBeforeEdit.parameter_set_type =  Object.assign({}, app.session.parameter_set.parameter_set_players[index].parameter_set_type);
    app.parametersetPlayerBeforeEdit.avatar =  Object.assign({}, app.session.parameter_set.parameter_set_players[index].avatar);

    app.parametersetPlayerBeforeEditIndex = index;
    app.current_parameter_set_player = app.session.parameter_set.parameter_set_players[index];
    

    var myModal = new bootstrap.Modal(document.getElementById('editParametersetPlayerModal'), {
        keyboard: false
        })

    myModal.toggle();
},

/** hide edit parmeter set player
*/
hideEditParametersetPlayer:function(){
    if(app.cancelModal)
    {
        Object.assign(app.session.parameter_set.parameter_set_players[app.parametersetPlayerBeforeEditIndex], app.parametersetPlayerBeforeEdit);

        Object.assign(app.session.parameter_set.parameter_set_players[app.parametersetPlayerBeforeEditIndex].good_one, app.parametersetPlayerBeforeEdit.good_one);
        Object.assign(app.session.parameter_set.parameter_set_players[app.parametersetPlayerBeforeEditIndex].good_two, app.parametersetPlayerBeforeEdit.good_two);
        Object.assign(app.session.parameter_set.parameter_set_players[app.parametersetPlayerBeforeEditIndex].good_three, app.parametersetPlayerBeforeEdit.good_three);
        Object.assign(app.session.parameter_set.parameter_set_players[app.parametersetPlayerBeforeEditIndex].parameter_set_type, app.parametersetPlayerBeforeEdit.parameter_set_type);
        Object.assign(app.session.parameter_set.parameter_set_players[app.parametersetPlayerBeforeEditIndex].avatar, app.parametersetPlayerBeforeEdit.avatar);

        app.parametersetPlayerBeforeEdit=null;
    }
},

/** update parameterset type settings
*/
sendUpdateParametersetPlayer(){
    
    app.working = true;
    app.sendMessage("update_parameterset_player", {"sessionID" : app.sessionID,
                                                   "paramterset_player_id" : app.current_parameter_set_player.id,
                                                   "formData" : $("#parametersetPlayerForm").serializeArray(),});
},

/** handle result of updating parameter set player
*/
takeUpdateParametersetPlayer(messageData){
    //app.cancelModal=false;
    //app.clearMainFormErrors();

    app.cancelModal=false;
    app.clearMainFormErrors();

    if(messageData.status.value == "success")
    {
        app.takeGetSession(messageData);       
        $('#editParametersetPlayerModal').modal('hide');        
    } 
    else
    {
        app.cancelModal=true;                           
        app.displayErrors(messageData.status.errors);
    } 
},

/**show edit parameter set player group
 */
 showEditParametersetPlayerGroup:function(player_id, period_id){
     
    if(app.session.started) return;

    app.clearMainFormErrors();
    app.cancelModal=true;
    app.parametersetPlayerGroupBeforeEdit = Object.assign({}, app.session.parameter_set.parameter_set_players[player_id].period_groups[period_id]);
    app.parametersetPlayerBeforeEditIndex = player_id;
    app.parametersetPlayerGroupBeforeEditIndex = period_id;
    app.current_parameter_set_player_group = app.session.parameter_set.parameter_set_players[player_id].period_groups[period_id];

    var myModal = new bootstrap.Modal(document.getElementById('editParametersetPlayerGroupModal'), {
        keyboard: false
        })

    myModal.toggle();
},

/** hide edit parmeter set player group
*/
hideEditParametersetPlayerGroup:function(){
    if(app.cancelModal)
    {
        Object.assign(app.session.parameter_set.parameter_set_players[app.parametersetPlayerBeforeEditIndex].period_groups[app.parametersetPlayerGroupBeforeEditIndex],
                      app.parametersetPlayerGroupBeforeEdit);
        app.parametersetPlayerBeforeEdit=null;
    }
},

/** update parameterset player group settings
*/
sendUpdateParametersetPlayerGroup(){
    
    app.working = true;
    app.sendMessage("update_parameterset_player_group", {"sessionID" : app.sessionID,
                                                   "paramterset_player_group_id" : app.current_parameter_set_player_group.id,
                                                   "formData" : $("#parametersetPlayerGroupForm").serializeArray(),});
},

/** handle result of updating parameter set player group
*/
takeUpdateParametersetPlayerGroup(messageData){
    //app.cancelModal=false;
    //app.clearMainFormErrors();

    app.cancelModal=false;
    app.clearMainFormErrors();

    if(messageData.status.value == "success")
    {
        app.takeGetSession(messageData);       
        $('#editParametersetPlayerGroupModal').modal('hide');            
    } 
    else
    {
        app.cancelModal=true;                           
        app.displayErrors(messageData.status.errors);
    } 
},

/** copy specified period's groups forward to future groups
*/
sendCopyGroupForward(period_number){
    app.working = true;
    app.sendMessage("copy_group_forward", {"sessionID" : app.sessionID,
                                           "period_number" : period_number,});
                                                   
},

/** handle result of copying groups forward
*/
takeCopyGroupForward(messageData){
    //app.cancelModal=false;
    //app.clearMainFormErrors();

    app.takeGetSession(messageData);   
},

/** copy specified period's groups forward to future groups
*/
sendRemoveParameterSetPlayer(){

    app.working = true;
    app.sendMessage("remove_parameterset_player", {"sessionID" : app.sessionID,
                                                   "paramterset_player_id" : app.current_parameter_set_player.id,});
                                                   
},

/** handle result of copying groups forward
*/
takeRemoveParameterSetPlayer(messageData){
    app.cancelModal=false;
    //app.clearMainFormErrors();
    app.takeGetSession(messageData);   
    $('#editParametersetPlayerModal').modal('hide');
},

/** copy specified period's groups forward to future groups
*/
sendAddParameterSetPlayer(player_id){
    app.working = true;
    app.sendMessage("add_parameterset_player", {"sessionID" : app.sessionID});
                                                   
},

/** handle result of copying groups forward
*/
takeAddParameterSetPlayer(messageData){
    //app.cancelModal=false;
    //app.clearMainFormErrors();
    app.takeGetSession(messageData); 
},
