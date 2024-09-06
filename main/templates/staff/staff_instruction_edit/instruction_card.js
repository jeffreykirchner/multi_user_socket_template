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
function send_delete_instruction(instruction_id){
    if (!confirm('Delete Page?')) {
        return;
    }

    app.working = true;
    app.send_message("delete_instruction_page", {id:app.instruction_set.id, instruction_id:instruction_id});
}


