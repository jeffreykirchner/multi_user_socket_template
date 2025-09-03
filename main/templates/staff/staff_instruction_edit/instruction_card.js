/**
 * send request to add new instruction page
 */
function send_add_instruction(){
    app.working = true;
    app.send_message("add_instruction_page", {id:app.instruction_set.id});
}

/**
 * send request to delete instruction page
 */
async function send_delete_instruction(instruction_id){
    if (!await show_confirm_dialog('Delete Page?')) {
        return;
    }

    app.working = true;
    app.send_message("delete_instruction_page", {id:app.instruction_set.id, instruction_id:instruction_id});
}

/**
 * show edit instruction modal
 */
function show_edit_instruction_modal(id){
    app.clear_main_form_errors();
    app.cancel_modal = true;

    let instruction = app.instruction_set.instruction_pages[id];

    tinymce.get("id_text_html").setContent(instruction.text_html);
    
    app.current_instruction = Object.assign({}, instruction);
    app.edit_instruction_modal.show();
}

/**
 * send request to update instruction
 */
function send_update_instruction(){
    app.working = true;
    app.current_instruction.text_html = tinymce.get("id_text_html").getContent();
    app.send_message("update_instruction", {form_data:app.current_instruction});
}

/** hide edit instruction modal
*/
function hide_edit_instruction_modal(){

    if(app.cancel_modal) Object.assign(app.instruction_set, app.paramterset_before_edit);
    app.paramterset_before_edit=null;
    app.cancel_modal = false;
    
}



