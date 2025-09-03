/**
 * send request to create new instruction
 */
function send_create_instruction(){
    app.working = true;
    app.send_message("create_instruction",{});
}

// /**
//  * take crate a new instruction
//  */
// function take_create_instruction(message_data){    
//     app.create_instruction_button_text ='Create instruction <i class="fas fa-plus"></i>';
//     app.take_get_instructions(message_data);
// }

/**
 * send request to delete instruction
 * @param id : int
 */
async function send_delete_instruction(id){
    if (!await show_confirm_dialog('Delete instruction?')) {
        return;
    }
    app.working = true;
    app.send_message("delete_instruction",{"id" : id});
}