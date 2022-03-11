/**send download summary data
*/
downloadSummaryData(){
    app.$data.working = true;
    this.data_downloading = true;
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
    downloadLink.download = "Trade_Steal_Summary_Data_Session_" + app.$data.session.id +".csv";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    this.data_downloading = false;
},

/**send download summary data
*/
downloadActionsData(){
    app.$data.working = true;
    this.data_downloading = true;
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
    downloadLink.download = "Trade_Steal_Action_Data_Session_" + app.$data.session.id +".csv";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    this.data_downloading = false;
},

/**send download recruiter data
*/
downloadRecruiterData(){
    app.$data.working = true;
    this.data_downloading = true;
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
    downloadLink.download = "Trade_Steal_Recruiter_Data_Session_" + app.$data.session.id +".csv";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    this.data_downloading = false;
},

/**send download payment data
*/
downloadPaymentData(){
    app.$data.working = true;
    this.data_downloading = true;
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
    downloadLink.download = "Trade_Steal_Payment_Data_Session_" + app.$data.session.id +".csv";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    this.data_downloading = false;
},

