/**show edit parameter set barrier
 */
show_edit_parameter_set_barrier: function show_edit_parameter_set_barrier(index){
    
    if(app.session.started) return;
    if(app.working) return;

    app.clear_main_form_errors();
    app.current_parameter_set_barrier = Object.assign({}, app.parameter_set.parameter_set_barriers[index]);
    
    app.edit_parameterset_barrier_modal.toggle();
},

/** update parameterset barrier
*/
send_update_parameter_set_barrier: function send_update_parameter_set_barrier(){
    
    app.working = true;

    app.send_message("update_parameter_set_barrier", {"session_id" : app.session.id,
                                                     "parameterset_barrier_id" : app.current_parameter_set_barrier.id,
                                                     "form_data" : app.current_parameter_set_barrier});
},

/** remove the selected parameterset barrier
*/
send_remove_parameter_set_barrier: function send_remove_parameter_set_barrier(){

    app.working = true;
    app.send_message("remove_parameterset_barrier", {"session_id" : app.session.id,
                                                    "parameterset_barrier_id" : app.current_parameter_set_barrier.id,});
                                                   
},

/** add a new parameterset barrier
*/
send_add_parameter_set_barrier: function send_add_parameter_set_barrier(barrier_id){
    app.working = true;
    app.send_message("add_parameterset_barrier", {"session_id" : app.session.id});
                                                   
},