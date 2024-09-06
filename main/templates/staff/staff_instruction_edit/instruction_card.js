/**
 * send request to add new instruction page
 */
function send_add_instruction(){
    app.working = true;
    app.send_message("add_instruction_page", {id:app.instruction_set.id});
}


