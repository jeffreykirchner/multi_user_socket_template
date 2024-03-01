
/**
 * Given the page number return the requested instruction text
 * @param pageNumber : int
 */
get_instruction_page: function get_instruction_page(pageNumber){

    for(let i=0;i<app.instructions.instruction_pages.length;i++)
    {
        if(app.instructions.instruction_pages[i].page_number==pageNumber)
        {
            return app.instructions.instruction_pages[i].text_html;
        }
    }

    return "Text not found";
},

/**
 * advance to next instruction page
 */
send_next_instruction: function send_next_instruction(direction){

    if(app.working) return;
    
    app.working = true;
    app.send_message("next_instruction", {"direction" : direction});
},

/**
 * advance to next instruction page
 */
take_next_instruction: function take_next_instruction(message_data){
    if(message_data.value == "success")
    {
        result = message_data.result;       
        
        app.session_player.current_instruction = result.current_instruction;
        app.session_player.current_instruction_complete = result.current_instruction_complete;

        app.process_instruction_page();
        app.instruction_display_scroll();

        app.working = false;
    } 
    else
    {
        
    }
    
},

/**
 * finish instructions
 */
send_finish_instructions: function send_finish_instructions(){

    if(app.working) return;
    
    app.working = true;
    app.send_message("finish_instructions", {});
},

/**
 * finish instructions
 */
take_finish_instructions: function take_finish_instructions(message_data){
    if(message_data.value == "success")
    {
        result = message_data.result;       
        
        app.session_player.instructions_finished = result.instructions_finished;
        app.session_player.current_instruction_complete = result.current_instruction_complete;
    } 
    else
    {
        
    }
},

/**
 * process instruction page
 */
process_instruction_page: function process_instruction_page(){

    //update view when instructions changes
    switch(app.session_player.current_instruction){
        case app.instructions.action_page_1:            
            break; 
        case app.instructions.action_page_2:
            break;
        case app.instructions.action_page_3:
            break;
        case app.instructions.action_page_4:
            break;
        case app.instructions.action_page_5:
            break;
        case app.instructions.action_page_6:
            break;
    }

    if(app.session_player.current_instruction_complete < app.session_player.current_instruction)
    {
        app.session_player.current_instruction_complete = app.session_player.current_instruction;
    }

        
},

/**
 * scroll instruction into view
 */
instruction_display_scroll: function instruction_display_scroll(){
    
    if(document.getElementById("instructions_frame"))
        document.getElementById("instructions_frame").scrollIntoView();
    
    Vue.nextTick(() => {
        app.scroll_update();
    });
},

scroll_update: function scroll_update()
{
    let scroll_top = document.getElementById('instructions_frame_a').scrollTop;
    let scroll_height = document.getElementById('instructions_frame_a').scrollHeight; // added
    let offset_height = document.getElementById('instructions_frame_a').offsetHeight;

    let content_height = scroll_height - offset_height; // added
    if (content_height <= scroll_top) // modified
    {
        // Now this is called when scroll end!
        app.instruction_pages_show_scroll = false;
    }
    else
    {
        app.instruction_pages_show_scroll = true;
    }
},

/**
 * simulate goods transfer on page 4
 */
simulate_chat_instructions: function simulate_chat_instructions(){

    if(app.chat_text.trim() == "") return;
    if(app.chat_text.trim().length > 200) return;

    message_data = {chat: {text : app.chat_text.trim(),
                            sender_label : app.session_player.parameter_set_player.id_label,
                            sender_id : app.session_player.id,
                            id : random_number(1, 1000000),},
                    chat_type:chat_type}
   
    app.take_update_chat(message_data);

    app.chat_text="";
},