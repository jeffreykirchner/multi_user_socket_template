/**
 * send request to add new instruction page
 */
function send_add_help_doc(){
    app.working = true;
    app.send_message("add_help_doc_page", {id:app.instruction_set.id});
}

/**
 * send request to delete instruction page
 */
async function send_delete_help_doc(help_doc_id){
    if (!await show_confirm_dialog('Delete Help Doc?')) {
        return;
    }

    app.working = true;
    app.send_message("delete_help_doc_page", {id:app.instruction_set.id, help_doc_id:help_doc_id});
}

/**
 * show edit instruction modal
 */
function show_edit_help_doc_modal(id){
    app.clear_main_form_errors();
    app.cancel_modal = true;

    let help_doc = app.instruction_set.help_docs_subject[id];

    tinymce.get("id_text").setContent(help_doc.text);
    
    app.current_help_doc_subject = Object.assign({}, help_doc);
    app.edit_help_doc_modal.show();
}

/**
 * send request to update instruction
 */
function send_update_help_doc(){
    app.working = true;
    app.current_help_doc_subject.text = tinymce.get("id_text").getContent();
    app.send_message("update_help_doc", {form_data:app.current_help_doc_subject});
}

/** hide edit instruction modal
*/
function hide_edit_help_doc_modal(){

    if(app.cancel_modal) Object.assign(app.instruction_set, app.paramterset_before_edit);
    app.paramterset_before_edit=null;
    app.cancel_modal = false;
}



