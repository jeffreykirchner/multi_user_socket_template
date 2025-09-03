/**
 * send request to create new session
 */
function send_create_session(){
    app.working = true;
    app.create_session_button_text ='<i class="fas fa-spinner fa-spin"></i>';
    app.send_message("create_session",{});
}

/**
 * take crate a new session
 */
function take_create_session(message_data){    
    app.create_session_button_text ='Create Session <i class="fas fa-plus"></i>';
    app.take_get_sessions(message_data);
}

/**
 * send request to delete session
 * @param id : int
 */
async function send_delete_session(id){
    if (!await show_confirm_dialog('Delete Session?')) {
        return;
    }
    app.working = true;
    app.send_message("delete_session",{"id" : id});
}

/**
 * sort by title
 */
function sort_by_title(){

    app.working = true;

    app.sessions.sort(function(a, b) {
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

    app.sessions.sort(function(a, b) {
        return new Date(b.start_date) - new Date(a.start_date);

    });

    app.working = false;
}