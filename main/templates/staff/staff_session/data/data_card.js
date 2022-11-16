/**send download summary data
*/
downloadSummaryData(){
    app.working = true;
    app.data_downloading = true;
    app.sendMessage("download_summary_data", {});
},

/** take download summary data
 * @param messageData {json}
*/
takeDownloadSummaryData(messageData){

    var downloadLink = document.createElement("a");
    var blob = new Blob(["\ufeff", messageData.status.result]);
    var url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = "Template_Data_Session_" + app.session.id +".csv";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    app.data_downloading = false;
},

/**send download summary data
*/
downloadActionsData(){
    app.working = true;
    app.data_downloading = true;
    app.sendMessage("download_action_data", {});
},

/** take download summary data
 * @param messageData {json}
*/
takeDownloadActionData(messageData){

    var downloadLink = document.createElement("a");
    var blob = new Blob(["\ufeff", messageData.status.result]);
    var url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = "Template_Action_Data_Session_" + app.session.id +".csv";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    app.data_downloading = false;
},

/**send download recruiter data
*/
downloadRecruiterData(){
    app.working = true;
    app.data_downloading = true;
    app.sendMessage("download_recruiter_data", {});
},

/** take download recruiter data
 * @param messageData {json}
*/
takeDownloadRecruiterData(messageData){

    var downloadLink = document.createElement("a");
    var blob = new Blob(["\ufeff", messageData.status.result]);
    var url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = "Template_Recruiter_Data_Session_" + app.session.id +".csv";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    app.data_downloading = false;
},

/**send download payment data
*/
downloadPaymentData(){
    app.working = true;
    app.data_downloading = true;
    app.sendMessage("download_payment_data", {});
},

/** take download payment data
 * @param messageData {json}
*/
takeDownloadPaymentData(messageData){

    var downloadLink = document.createElement("a");
    var blob = new Blob(["\ufeff", messageData.status.result]);
    var url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = "Template_Payment_Data_Session_" + app.session.id +".csv";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    app.data_downloading = false;
},

