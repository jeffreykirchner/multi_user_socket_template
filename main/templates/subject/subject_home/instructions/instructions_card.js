
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
        let result = message_data.result;       
        
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
    app.working = false;
    
    if(message_data.value == "success")
    {
        let result = message_data.result;       
        
        app.session_player.instructions_finished = result.instructions_finished;
        app.session_player.current_instruction_complete = result.current_instruction_complete;
    } 
    else
    {
        
    }
},

/**
 * send_current_instruction_complete
 */
send_current_instruction_complete: function current_instruction_complete()
{
    app.send_message("current_instruction_complete", {"page_number" : app.session_player.current_instruction_complete});
},

/**
 * process instruction page
 */
process_instruction_page: function process_instruction_page(){

    //update view when instructions changes
    switch(app.session_player.current_instruction){
        case app.instructions.action_page_1:    
            return;        
            break; 
        case app.instructions.action_page_2:
            return; 
            break;
        case app.instructions.action_page_3:
            return; 
            break;
        case app.instructions.action_page_4:
            return; 
            break;
        case app.instructions.action_page_5:
            return; 
            break;
        case app.instructions.action_page_6:
            return; 
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


/*
* send chat instructions
*/
send_chat_instructions: function send_chat_instructions(chat_text_processed)
{

    if(app.session_player.current_instruction != app.instructions.action_page_3) return;

    let message_data = {
        "status": "success",
        "text": chat_text_processed,
        "sender_id": app.session_player.id,       
        "nearby_players": [],
    };

    app.take_update_chat(message_data);
},