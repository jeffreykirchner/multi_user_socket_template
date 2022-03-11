/**show edit paramter set avatar
 */
 showEditParametersetAvatar(index){
    app.clearMainFormErrors();
    this.cancelModal=true;
    this.paramtersetAvatarBeforeEdit = Object.assign({}, this.session.parameter_set.parameter_set_avatars[index]);
    this.paramtersetAvatarBeforeEditAvatar = Object.assign({}, this.session.parameter_set.parameter_set_avatars[index].avatar);
    this.paramtersetAvatarBeforeEditIndex = index;
    this.current_parameter_set_avatar = Object.assign({}, this.session.parameter_set.parameter_set_avatars[index]);

    if(!this.current_parameter_set_avatar.avatar)
    {
        this.current_parameter_set_avatar.avatar = {id:-1}
    }

    var myModal = new bootstrap.Modal(document.getElementById('editAvatarsModal'), {
        keyboard: false
        })

    myModal.toggle();
},

/** hide edit session modal
*/
hideEditParametersetAvatar(){
    if(this.cancelModal)
    {
       // Object.assign(this.session.parameter_set.parameter_set_avatars[this.paramtersetAvatarBeforeEditIndex], this.paramtersetAvatarBeforeEdit);

        // if(this.current_parameter_set_avatar.avatar)
        //     if(this.current_parameter_set_avatar.avatar.id == -1)
        //         this.session.parameter_set.parameter_set_avatars[this.paramtersetAvatarBeforeEditIndex].avatar = null;
    }
},

/** update parameterset avatar 
*/
sendUpdateParametersetAvatar(){
    
    app.$data.working = true;
    app.sendMessage("update_parameterset_avatar", {"sessionID" : app.$data.sessionID,
                                                   "parameterset_avatar_id" : this.session.parameter_set.parameter_set_avatars[this.paramtersetAvatarBeforeEditIndex].id,
                                                   "formData" : $("#avatarsForm").serializeArray(),});
},

/** handle result of updating parameter set
*/
takeUpdateParametersetAvatar(messageData){
    //app.$data.cancelModal=false;
    //app.clearMainFormErrors();

    this.cancelModal=false;
    app.clearMainFormErrors();

    if(messageData.status.value == "success")
    {
        app.$data.session.parameter_set = messageData.status.result;
        $('#editAvatarsModal').modal('hide');            
    } 
    else
    {
        app.$data.cancelModal=true;                           
        app.displayErrors(messageData.status.errors);
    } 
},