function send_get_sessionsAdmin(){
    //get list of sessions
    app.working = true;
    app.sessions_full_admin_visible = true;
    app.send_message("get_sessions_admin",{});
}

function take_get_sessionsAdmin(message_data){
    //process list of all sessions
    app.working = false;
    app.sessions_full_admin = message_data.sessions_admin;
}

//sort by title
function sort_by_title_all_sessions(){

    app.working = true;

    app.sessions_full_admin.sort(function(a, b) {
        a=a.title.trim().toLowerCase();
        b=b.title.trim().toLowerCase();
        return a < b ? -1 : a > b ? 1 : 0;
    });

    app.working = false;
}

function sort_by_date_all_sessions(){

    app.working = true;

    app.sessions_full_admin.sort(function(a, b) {
        return new Date(b.start_date) - new Date(a.start_date);

    });

    app.working = false;
}

function sort_by_owner_all_sessions(){

    app.working = true;

    app.sessions_full_admin.sort(function(a, b) {
        a=a.creator__last_name.trim().toLowerCase() + a.creator__first_name.trim().toLowerCase();
        b=b.creator__last_name.trim().toLowerCase() + b.creator__first_name.trim().toLowerCase();
        return a < b ? -1 : a > b ? 1 : 0;
    });

    app.working = false;
}