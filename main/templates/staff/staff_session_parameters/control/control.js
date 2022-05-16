/** copy parameters from another period
*/
sendImportParameters(){
    
    app.working = true;
    app.sendMessage("import_parameters", {"sessionID" : app.sessionID,
                                          "formData" : {session:app.session_import} });
},

/** show parameters copied from another period 
*/
takeImportParameters(){
    //app.cancelModal=false;
    //app.clearMainFormErrors();

    if(messageData.status.status == "success")
    {
        app.takeGetSession(messageData);       
        app.import_parameters_message = messageData.status.message;
        location.reload();    
    } 
    else
    {
        app.import_parameters_message = messageData.status.message;
    } 
},

/** show edit session modal
*/
showImportParameters:function(){
    
    app.importParametersModal.toggle();
},

/** hide edit session modal
*/
hideImportParameters:function(){
    
},

/** send request to download parameters to a file 
*/
sendDownloadParameters(){
    
    app.working = true;
    app.sendMessage("download_parameters", {"sessionID" : app.sessionID,});
},

/** download parameter set into a file 
 @param messageData {json} result of file request, either sucess or fail with errors
*/
takeDownloadParameters(messageData){

    if(messageData.status == "success")
    {                  
        console.log(messageData.parameter_set);

        var downloadLink = document.createElement("a");
        var jsonse = JSON.stringify(messageData.parameter_set);
        var blob = new Blob([jsonse], {type: "application/json"});
        var url = URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = "Session_" + app.session.id + "_Parameter_Set.json";

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);                     
    } 

    app.working = false;
},

/**upload a parameter set file
*/
uploadParameterset:function(){  

    let formData = new FormData();
    formData.append('file', app.upload_file);

    axios.post('/staff-session/{{id}}/parameters', formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                    }
                } 
            )
            .then(function (response) {     

                app.uploadParametersetMessaage = response.data.message.message;
                app.session = response.data.session;
                app.uploadParametersetButtonText= 'Upload <i class="fas fa-upload"></i>';
                location.reload();

            })
            .catch(function (error) {
                console.log(error);
                app.searching=false;
            });                        
},

//direct upload button click
uploadAction:function(){
    if(app.upload_file == null)
        return;

    app.uploadParametersetMessaage = "";
    app.uploadParametersetButtonText = '<i class="fas fa-spinner fa-spin"></i>';

    if(app.upload_mode == "parameters")
    {
        this.uploadParameterset();
    }
    else
    {
        
    }

},

//file upload
handleFileUpload:function(){
    app.upload_file = this.$refs.file.files[0];
    app.upload_file_name = app.upload_file.name;
},

/** show upload parameters modal
*/
showUploadParameters:function(upload_mode){
    app.upload_mode = upload_mode;
    app.uploadParametersetMessaage = "";

    var myModal = new bootstrap.Modal(document.getElementById('parameterSetModal'), {
        keyboard: false
        })

    myModal.toggle();
},

/**hide upload parameters modal
*/
hideUploadParameters:function(){
},