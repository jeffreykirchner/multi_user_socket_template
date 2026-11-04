
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
 * Get the read-aloud script for the current instruction page.
 */
get_current_instruction_script: function get_current_instruction_script(){
    const instruction = app.instructions.instruction_pages.find(
        page => page.page_number == app.session_player.current_instruction
    );

    return instruction && instruction.script ? instruction.script.trim() : "";
},

/**
 * Check whether read-aloud controls are enabled for this session.
 */
is_instruction_read_aloud_enabled: function is_instruction_read_aloud_enabled(){
    return !!(app.session
        && app.session.parameter_set
        && app.session.parameter_set.instruction_read_aloud_mode
        && app.session.parameter_set.instruction_read_aloud_mode !== "Off");
},

/**
 * Read or stop the current instruction script using the browser's speech engine.
 */
toggle_instruction_speech: function toggle_instruction_speech(){
    if(app.instruction_speech_playing)
    {
        app.stop_instruction_speech();
        return;
    }

    const script = app.get_current_instruction_script();
    if(!script) return;

    app.instruction_speech_error = "";
    if(!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined")
    {
        app.instruction_speech_error = "Read-aloud playback is not supported in this browser.";
        return;
    }

    window.speechSynthesis.cancel();
    app.instruction_speech_request_id += 1;
    const requestId = app.instruction_speech_request_id;
    const utterance = new SpeechSynthesisUtterance(script);
    utterance.onstart = function(){
        if(app.instruction_speech_request_id === requestId)
            app.instruction_speech_playing = true;
    };
    utterance.onend = function(){
        if(app.instruction_speech_request_id === requestId)
        {
            app.instruction_speech_playing = false;
            app.instruction_speech_completed = true;
        }
    };
    utterance.onerror = function(){
        if(app.instruction_speech_request_id === requestId)
        {
            app.instruction_speech_playing = false;
            app.instruction_speech_error = "Read-aloud playback could not be completed.";
        }
    };

    app.instruction_speech_playing = true;
    window.speechSynthesis.speak(utterance);
},

/**
 * Stop any read-aloud playback started from the instructions card.
 */
stop_instruction_speech: function stop_instruction_speech(){
    app.instruction_speech_request_id += 1;
    if("speechSynthesis" in window)
        window.speechSynthesis.cancel();
    app.instruction_speech_playing = false;
},

/**
 * get the completetion status of the read-aloud script for the current instruction page.
 */
is_instruction_speech_completed: function is_instruction_speech_completed(){
    if(app.session.parameter_set.instruction_read_aloud_mode != "Private") return true;
    if(app.session_player.current_instruction_complete> app.session_player.current_instruction) return true;

    const script = app.get_current_instruction_script();
    if(!script) return true;


    return app.instruction_speech_completed;
},

/**
 */

/**
 * advance to next instruction page
 */
send_next_instruction: function send_next_instruction(direction){

    if(app.working) return;

    app.stop_instruction_speech();
    
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
        app.instruction_speech_completed = false;
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

    app.stop_instruction_speech();
    
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
    app.send_message("current_instruction_complete", 
                     {"page_number" : app.session_player.current_instruction_complete,
                      "quiz_answers" : app.session_player.quiz_answers
                     });
},

/**
 * process instruction page
 */
process_instruction_page: function process_instruction_page(){

    //check for quiz question that needs to be answered
    //check if current instructions is in quiz_answers and if it is not complete
    if(app.session_player.current_instruction in app.session_player.quiz_answers && 
       !app.session_player.quiz_answers[app.session_player.current_instruction].complete)
    {
        let instruction_page = app.instructions.instruction_pages[app.session_player.current_instruction-1];
        let quiz_state = instruction_page.quiz_state;
        let parameter_set_period = app.get_current_parameter_set_period();

        if(quiz_state)
        {
            //check if quiz_state has keys "group" and "parameter_set_period"
            if("group" in quiz_state)
            {
                //use keys from quiz_state["group"] to upate keys in group
                for (const [key, value] of Object.entries(quiz_state["group"])) {

                    if(value == "me")
                    {
                        group[key] = app.session_player.id;
                    }
                    else if(value == "counterpart")
                    {
                        group[key] = app.session_player.id+1;
                    }
                    else
                    {
                        group[key] = value;
                    }
                }
            }
            
            if("parameter_set_period" in quiz_state)
            {
                //use keys from quiz_state["parameter_set_period"] to update keys in parameter_set_period
                for (const [key, value] of Object.entries(quiz_state["parameter_set_period"])) {
                    parameter_set_period[key] = value;
                }
            }
        }

        return;
    }

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

/**
 * show quiz question answer box
 */
show_quiz_question_answer_box: function show_quiz_question_answer_box()
{
    if(app.session_player.current_instruction in app.session_player.quiz_answers && 
       !app.session_player.quiz_answers[app.session_player.current_instruction].complete)
    {
        return true;
    }
    else
    {
        return false;
    }
},

/**
 * show quiz question is answered correctly
 */
show_quiz_question_correct_answer: function show_quiz_question_correct_answer()
{
    if(app.session_player.current_instruction in app.session_player.quiz_answers && 
       app.session_player.quiz_answers[app.session_player.current_instruction].complete)
    {
        return true;
    }
    else
    {
        return false;
    }
},

/**
 * check if quiz question is answered correctly
 */
check_quiz_question_answer: function check_quiz_question_answer()
{
    let instruction = app.instructions.instruction_pages[app.session_player.current_instruction-1];

    app.show_quiz_error = false;

    if(instruction.quiz_question)
    {
        let quiz_answers = instruction.quiz_answer.split(",");

        app.session_player.quiz_answers[app.session_player.current_instruction].answers.push(app.quiz_answer);

        if(quiz_answers.includes(app.quiz_answer.trim().toLowerCase()))
        {
            app.session_player.quiz_answers[app.session_player.current_instruction].complete = true;
        
            app.session_player.current_instruction_complete = app.session_player.current_instruction;
            app.send_current_instruction_complete();
            app.quiz_answer = "";
        }
        else
        {
            app.show_quiz_error = true;
        }
    }
},

//return a string that says quiz answer correct and what the correct answer
get_quiz_answer_correct_label_text: function get_quiz_answer_correct_label_text()
{
    //check if current instruction is in quiz_answers and if it is complete
    if(!(app.session_player.current_instruction in app.session_player.quiz_answers) || 
       !app.session_player.quiz_answers[app.session_player.current_instruction].complete)
    {
        return "";
    }
    
    //last answer in the array of answers for the current instruction
    let answers_length = app.session_player.quiz_answers[app.session_player.current_instruction].answers.length;
    let answer = app.session_player.quiz_answers[app.session_player.current_instruction].answers[answers_length-1];
    let text = `Quiz answer correct (${answer}). Click Next to continue.`;
    return text;
},