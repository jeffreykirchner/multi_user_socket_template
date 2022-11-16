
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
    app.sendMessage("next_instruction", {"direction" : direction});
},

/**
 * advance to next instruction page
 */
takeNextInstruction(messageData){
    if(messageData.status.value == "success")
    {
        result = messageData.status.result;       
        
        app.session_player.current_instruction = result.current_instruction;
        app.session_player.current_instruction_complete = result.current_instruction_complete;

        app.processInstructionPage();
        app.instructionDisplayScroll();
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
    app.sendMessage("finish_instructions", {});
},

/**
 * finish instructions
 */
takeFinishInstructions(messageData){
    if(messageData.status.value == "success")
    {
        result = messageData.status.result;       
        
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
processInstructionPage(){

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
instructionDisplayScroll(){
    
    if(document.getElementById("instructions_frame"))
        document.getElementById("instructions_frame").scrollIntoView();
    
    setTimeout(app.scroll_update, 500);
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