

/**show edit paramter set
 */
show_edit_parameter_set:function show_edit_parameter_set(){
    app.clear_main_form_errors();
    app.cancel_modal=true;
    app.paramterset_before_edit = Object.assign({}, app.parameter_set);

    app.edit_parameterset_modal.toggle();
},

/** hide edit session modal
*/
hide_edit_parameter_set:function hide_edit_parameter_set(){
    if(app.cancel_modal)
    {
        Object.assign(app.parameter_set, app.paramterset_before_edit);
        app.paramterset_before_edit=null;
    }
},

/** update parameterset settings
*/
send_update_parameter_set: function send_update_parameter_set(){
    
    app.working = true;

    let form_data = {}

    for(let i=0;i<app.parameterset_form_ids.length;i++)
    {
        let v=app.parameterset_form_ids[i];
        form_data[v]=app.parameter_set[v];
    }

    app.send_message("update_parameter_set", {"session_id" : app.session.id,
                                              "form_data" : form_data});
},

/** handle result of updating parameter set
*/
take_update_parameter_set: function take_update_parameter_set(message_data){

    app.cancel_modal=false;
    app.clear_main_form_errors();

    if(message_data.status.value == "success")
    {
        app.take_get_parameter_set(message_data);       

        app.edit_parameterset_modal.hide();            
        app.edit_parameterset_player_modal.hide();
        app.edit_parameterset_notice_modal.hide();
        app.edit_parameterset_wall_modal.hide();
        app.edit_parameterset_group_modal.hide();
        app.edit_parameterset_barrier_modal.hide();
        app.edit_parameterset_ground_modal.hide();
    } 
    else
    {
        app.cancel_modal=true;                           
        app.display_errors(message_data.status.errors);
    } 
},

