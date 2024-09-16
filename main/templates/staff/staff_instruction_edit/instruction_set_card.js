/**
 * send request to update instruction set
 */
function send_update_instruction_set(){
    app.working = true;
    app.send_message("update_instruction_set", {form_data:app.instruction_set});
}

/**show edit instruction set model
 */
function show_edit_instruction_set_modal(){
    app.clear_main_form_errors();
    app.cancel_modal = true;

    app.paramterset_before_edit = Object.assign({}, app.instruction_set);
    app.edit_instruction_set_modal.show();
}

/** hide edit instruction set modal
*/
function hide_edit_instruction_set_modal(){

    if(app.cancel_modal) Object.assign(app.instruction_set, app.paramterset_before_edit);
    app.paramterset_before_edit=null;
    app.cancel_modal = false;
    
}

/**
 * send request to import instruction set
 */
function send_import_instruction_set(){
    app.working = true;
    app.send_message("import_instruction_set", {form_data:app.instruction_set_import,
                                                instruction_set_id:app.instruction_set.id});
}

/**
 * show import instruction set modal
 */
function show_import_instruction_set_modal(){
    app.clear_main_form_errors();
    app.import_instruction_set_modal.show();
}

/**
 * hide import instruction set modal
 */
function hide_import_instruction_set_modal(){
    app.cancel_modal = false;
    app.clear_main_form_errors();
}
