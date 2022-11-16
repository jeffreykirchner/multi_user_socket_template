

/**show edit paramter set
 */
show_edit_parameter_set:function(){
    app.clear_main_form_errors();
    app.cancel_modal=true;
    app.paramtersetBeforeEdit = Object.assign({}, app.session.parameter_set);

    app.edit_parameterset_modal.toggle();
},

/** hide edit session modal
*/
hide_edit_parameter_set:function(){
    if(app.cancel_modal)
    {
        Object.assign(app.session.parameter_set, app.paramtersetBeforeEdit);
        app.paramtersetBeforeEdit=null;
    }
},

/** update parameterset settings
*/
send_update_parameter_set(){
    
    app.working = true;

    let form_data = {}

    for(i=0;i<app.parameterset_form_ids.length;i++)
    {
        v=app.parameterset_form_ids[i];
        form_data[v]=app.session.parameter_set[v];
    }

    app.send_message("update_parameter_set", {"session_id" : app.session_id,
                                            "form_data" : form_data});
},

/** handle result of updating parameter set
*/
take_update_parameter_set(message_data){

    app.cancel_modal=false;
    app.clear_main_form_errors();

    if(message_data.status.value == "success")
    {
        app.take_get_session(message_data);       
        app.edit_parameterset_modal.hide();            
    } 
    else
    {
        app.cancel_modal=true;                           
        app.display_errors(message_data.status.errors);
    } 
},

