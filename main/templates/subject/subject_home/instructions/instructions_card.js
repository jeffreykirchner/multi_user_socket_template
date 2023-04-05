
/**
 * Given the page number return the requested instruction text
 * @param pageNumber : int
 */
getInstructionPage(pageNumber){

    for(i=0;i<app.instruction_pages.length;i++)
    {
        if(app.instruction_pages[i].page_number==pageNumber)
        {
            return app.instruction_pages[i].text_html;
        }
    }

    return "Text not found";
},

/**
 * advance to next instruction page
 */
sendNextInstruction(direction){

    if(app.working) return;
    
    app.working = true;
    app.send_message("next_instruction", {"direction" : direction});
},

/**
 * advance to next instruction page
 */
take_next_instruction(message_data){
    if(message_data.value == "success")
    {
        result = message_data.result;       
        
        app.session_player.current_instruction = result.current_instruction;
        app.session_player.current_instruction_complete = result.current_instruction_complete;

        app.processInstruction_page();
        app.instruction_display_scroll();
    } 
    else
    {
        
    }
    
},

/**
 * finish instructions
 */
sendFinishInstructions(){

    if(app.working) return;
    
    app.working = true;
    app.send_message("finish_instructions", {});
},

/**
 * finish instructions
 */
take_finish_instructions(message_data){
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
processInstruction_page(){

    //update view when instructions changes
    switch(app.session_player.current_instruction){
        case 1:            
            break; 
        case 2:
            break;
        case 3:            
            break;
        case 4:
            break; 
        case 5:           
            break;
        case 6:
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
instruction_display_scroll(){
    
    if(document.getElementById("instructions_frame"))
        document.getElementById("instructions_frame").scrollIntoView();
    
    Vue.nextTick(() => {
        app.scroll_update();
    });
},

scroll_update()
{
    var scrollTop = document.getElementById('instructions_frame_a').scrollTop;
    var scrollHeight = document.getElementById('instructions_frame_a').scrollHeight; // added
    var offsetHeight = document.getElementById('instructions_frame_a').offsetHeight;
    // var clientHeight = document.getElementById('box').clientHeight;
    var contentHeight = scrollHeight - offsetHeight; // added
    if (contentHeight <= scrollTop) // modified
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
simulate_chat_instructions(){

    if(app.chat_text.trim() == "") return;
    if(app.chat_text.trim().length > 200) return;

    if(app.chat_recipients == "NONE") return;

    if(app.chat_recipients == "all")
    {
        chat_type = "All";

        message_data = {chat: {text : app.chat_text.trim(),
                               sender_label : app.session_player.parameter_set_player.id_label,
                               sender_id : app.session_player.id,
                               id : random_number(1, 1000000),},
                        chat_type:chat_type}
    }
    else
    {
        chat_type = "Individual";

        message_data = {chat: {text : app.chat_text.trim(),
                               sender_label : app.session_player.parameter_set_player.id_label,
                               sender_id : app.session_player.id,
                               id : random_number(1, 1000000),},      
                        sesson_player_target : app.chat_recipients,       
                        chat_type:chat_type}
    }

   

    app.take_update_chat(message_data);

    app.chat_text="";
},