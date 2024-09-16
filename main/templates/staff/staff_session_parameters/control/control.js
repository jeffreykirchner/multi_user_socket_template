/** copy parameters from another period
*/
send_import_parameters: function send_import_parameters(){
    
    app.working = true;
    app.send_message("import_parameters", {"session_id" : app.session.id,
                                           "form_data" : {session:app.session_import} });
},

/** show parameters copied from another period 
*/
take_import_parameters: function take_import_parameters(message_data){

    if(message_data.status.status == "success")
    {
        app.take_get_parameter_set(message_data);       
        app.import_parameters_message = message_data.status.message;
        location.reload();    
    } 
    else
    {
        app.import_parameters_message = message_data.message;
    } 
},

/** show edit session modal
*/
show_import_parameters: function show_import_parameters(){
    
    app.import_parameters_modal.toggle();
},

/** hide edit session modal
*/
hide_import_parameters: function hide_import_parameters(){
    
},

/** send request to download parameters to a file 
*/
send_download_parameters: function send_download_parameters(){
    
    app.working = true;
    app.send_message("download_parameters", {"session_id" : app.session.id,});
},

/** download parameter set into a file 
 @param message_data {json} result of file request, either sucess or fail with errors
*/
take_download_parameters: function take_download_parameters(message_data){

    if(message_data.status == "success")
    {                  
        console.log(message_data.parameter_set);

        let download_link = document.createElement("a");
        let jsonse = JSON.stringify(message_data.parameter_set);
        let blob = new Blob([jsonse], {type: "application/json"});
        let url = URL.createObjectURL(blob);
        download_link.href = url;
        download_link.download = "Session_" + app.session.id + "_Parameter_Set.json";

        document.body.appendChild(download_link);
        download_link.click();
        document.body.removeChild(download_link);                     
    } 

    app.working = false;
},

/**upload a parameter set file
*/
upload_parameter_set:function upload_parameter_set(){  

    let form_data = new FormData();
    form_data.append('file', app.upload_file);

    axios.post('/staff-session/{{id}}/parameters', form_data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                    }
                } 
            )
            .then(function (response) {     

                app.upload_parameter_set_message = response.data.message.message;
                app.session = response.data.session;
                app.upload_parameter_set_button_text= 'Upload <i class="fas fa-upload"></i>';
                location.reload();

            })
            .catch(function (error) {
                console.log(error);
                app.searching=false;
            });                        
},

//direct upload button click
upload_action:function upload_action(){
    if(app.upload_file == null)
        return;

    app.upload_parameter_set_message = "";
    app.upload_parameter_set_button_text = '<i class="fas fa-spinner fa-spin"></i>';

    if(app.upload_mode == "parameters")
    {
        app.upload_parameter_set();
    }
    else
    {
        
    }

},

//file upload
handle_file_upload:function handle_file_upload(){
    app.upload_file = app.$refs.file.files[0];
    app.upload_file_name = app.upload_file.name;
},

/** show upload parameters modal
*/
show_upload_parameters:function show_upload_parameters(upload_mode){
    app.upload_mode = upload_mode;
    app.upload_parameter_set_message = "";

    app.upload_parameter_set_modal.toggle();
},

/**hide upload parameters modal
*/
hide_upload_parameters:function hide_upload_parameters(){

},