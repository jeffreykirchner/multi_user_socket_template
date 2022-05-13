sendGetSessionsAdmin(){
    //get list of sessions
    app.working = true;
    app.sessions_full_admin_visible = true;
    app.sendMessage("get_sessions_admin",{});
},

takeGetSessionsAdmin(messageData){
    //process list of all sessions
    app.working = false;
    app.sessions_full_admin = messageData.sessions_admin;
},

//sort by title
sortByTitleAllSessions:function(){

    app.working = true;

    app.sessions_full_admin.sort(function(a, b) {
        a=a.title.trim().toLowerCase();
        b=b.title.trim().toLowerCase();
        return a < b ? -1 : a > b ? 1 : 0;
    });

    app.working = false;
},

sortByDateAllSessions:function(){

    app.working = true;

    app.sessions_full_admin.sort(function(a, b) {
        return new Date(b.start_date) - new Date(a.start_date);

    });

    app.working = false;
},

sortByOwnerAllSessions:function(){

    app.working = true;

    app.sessions_full_admin.sort(function(a, b) {
        a=a.creator__last_name.trim().toLowerCase() + a.creator__first_name.trim().toLowerCase();
        b=b.creator__last_name.trim().toLowerCase() + b.creator__first_name.trim().toLowerCase();
        return a < b ? -1 : a > b ? 1 : 0;
    });

    app.working = false;
},