/**
 * send request to create new instruction
 */
function send_create_instruction(){
    app.working = true;
    app.create_instruction_button_text ='<i class="fas fa-spinner fa-spin"></i>';
    app.send_message("create_instruction",{});
}

/**
 * take crate a new instruction
 */
function take_create_instruction(message_data){    
    app.create_instruction_button_text ='Create instruction <i class="fas fa-plus"></i>';
    app.take_get_instructions(message_data);
}

/**
 * send request to delete instruction
 * @param id : int
 */
function send_delete_instruction(id){
    if (!confirm('Delete instruction?')) {
        return;
    }
    app.working = true;
    app.send_message("delete_instruction",{"id" : id});
}

/**
 * sort by title
 */
function sort_by_title(){

    app.working = true;

    app.instructions.sort(function(a, b) {
        a=a.title.trim().toLowerCase();
        b=b.title.trim().toLowerCase();
        return a < b ? -1 : a > b ? 1 : 0;
    });

    app.working = false;
}

/**
 * sort by date
 */
function sort_by_date(){

    app.working = true;

    app.instructions.sort(function(a, b) {
        return new Date(b.start_date) - new Date(a.start_date);

    });

    app.working = false;
}