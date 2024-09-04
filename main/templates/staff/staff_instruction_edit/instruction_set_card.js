/**
 * send request to create new instruction
 */
function send_update_instruction_set(){
    app.working = true;
    app.create_instruction_button_text ='<i class="fas fa-spinner fa-spin"></i>';
    app.send_message("create_instruction",{});
}

