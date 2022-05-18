/**show edit parameter set player
 */
 showEditParametersetPlayer:function(id){
    
    if(app.session.started) return;

    var parameter_set_players = app.session.parameter_set.parameter_set_players;

    index = -1;
    for(i=0;i<parameter_set_players.length;i++)
    {
        if(parameter_set_players[i].id == id)
        {
            index = i;
            break;
        }
    }
    
    app.clearMainFormErrors();
    app.cancelModal=true;
    app.parametersetPlayerBeforeEdit = Object.assign({}, app.session.parameter_set.parameter_set_players[index]);
    
    app.parametersetPlayerBeforeEditIndex = index;
    app.current_parameter_set_player = app.session.parameter_set.parameter_set_players[index];
    

    app.editParametersetPlayerModal.toggle();
},

/** hide edit parmeter set player
*/
hideEditParametersetPlayer:function(){
    if(app.cancelModal)
    {
        Object.assign(app.session.parameter_set.parameter_set_players[app.parametersetPlayerBeforeEditIndex], app.parametersetPlayerBeforeEdit);
       
        app.parametersetPlayerBeforeEdit=null;
    }
},

/** update parameterset type settings
*/
sendUpdateParametersetPlayer(){
    
    app.working = true;

    let parameter_set_players = app.session.parameter_set.parameter_set_players;

    index=-1;
    for(i=0;i<parameter_set_players.length;i++)
    {
        if(parameter_set_players[i].id == app.current_parameter_set_player.id)
        {
            index=i;
            break;
        }
    }

    formData = {}    

    for(i=0;i<app.parameterset_player_form_ids.length;i++)
    {
        v = app.parameterset_player_form_ids[i];
        formData[v] = parameter_set_players[index][v];
    }

    app.sendMessage("update_parameterset_player", {"sessionID" : app.sessionID,
                                                   "paramterset_player_id" : app.current_parameter_set_player.id,
                                                   "formData" : formData});
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
        app.editParametersetPlayerModal.hide();        
    } 
    else
    {
        app.cancelModal=true;                           
        app.displayErrors(messageData.status.errors);
    } 
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
    app.editParametersetPlayerModal.hide();
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
