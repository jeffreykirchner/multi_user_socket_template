/**send download summary data
*/
download_summary_data: function download_summary_data(){
    app.working = true;
    app.data_downloading = true;
    app.send_message("download_summary_data", {});
},

/** take download summary data
 * @param message_data {json}
*/
take_download_summary_data: function take_download_summary_data(message_data){

    let download_link = document.createElement("a");
    let blob = new Blob(["\ufeff", message_data.result]);
    let url = URL.createObjectURL(blob);
    download_link.href = url;
    download_link.download = "Template_Data_Session_" + app.session.id +".csv";

    document.body.appendChild(download_link);
    download_link.click();
    document.body.removeChild(download_link);

    app.data_downloading = false;
},

/**send download actions data
*/
download_actions_data: function download_actions_data(){
    app.working = true;
    app.data_downloading = true;
    app.send_message("download_action_data", {});
},

/** take download action data
 * @param message_data {json}
*/
take_download_action_data: function take_download_action_data(message_data){

    let download_link = document.createElement("a");
    let blob = new Blob(["\ufeff", message_data.result]);
    let url = URL.createObjectURL(blob);
    download_link.href = url;
    download_link.download = "Template_Action_Data_Session_" + app.session.id +".csv";

    document.body.appendChild(download_link);
    download_link.click();
    document.body.removeChild(download_link);

    app.data_downloading = false;
},

/**send download recruiter data
*/
download_recruiter_data: function download_recruiter_data(){
    app.working = true;
    app.data_downloading = true;
    app.send_message("download_recruiter_data", {});
},

/** take download recruiter data
 * @param message_data {json}
*/
take_download_recruiter_data: function take_download_recruiter_data(message_data){

    let download_link = document.createElement("a");
    let blob = new Blob(["\ufeff", message_data.result]);
    let url = URL.createObjectURL(blob);
    download_link.href = url;
    download_link.download = "Template_Recruiter_Data_Session_" + app.session.id +".csv";

    document.body.appendChild(download_link);
    download_link.click();
    document.body.removeChild(download_link);

    app.data_downloading = false;
},

/**send download payment data
*/
download_payment_data: function download_payment_data(){
    app.working = true;
    app.data_downloading = true;
    app.send_message("download_payment_data", {});
},

/** take download payment data
 * @param message_data {json}
*/
take_download_payment_data: function take_download_payment_data(message_data){

    let download_link = document.createElement("a");
    let blob = new Blob(["\ufeff", message_data.result]);
    let url = URL.createObjectURL(blob);
    download_link.href = url;
    download_link.download = "Template_Payment_Data_Session_" + app.session.id +".csv";

    document.body.appendChild(download_link);
    download_link.click();
    document.body.removeChild(download_link);

    app.data_downloading = false;
},

