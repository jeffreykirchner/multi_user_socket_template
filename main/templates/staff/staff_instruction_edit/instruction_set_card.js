/**
 * send request to update instruction set
 */
function send_update_instruction_set(){
    app.working = true;
    app.send_message("update_instruction_set", {form_data:app.instruction_set});
}

/**show edit instruction set model
 */
function show_edit_instruction_set_modal(){
    app.clear_main_form_errors();
    app.cancel_modal = true;

    app.paramterset_before_edit = Object.assign({}, app.instruction_set);
    app.edit_instruction_set_modal.show();
}

/** hide edit instruction set modal
*/
function hide_edit_instruction_set_modal(){

    if(app.cancel_modal) Object.assign(app.instruction_set, app.paramterset_before_edit);
    app.paramterset_before_edit=null;
    app.cancel_modal = false;
    
}

/**
 * send request to import instruction set
 */
function send_import_instruction_set(){
    app.working = true;
    app.send_message("import_instruction_set", {form_data:app.instruction_set_import,
                                                instruction_set_id:app.instruction_set.id});
}

/**
 * show import instruction set modal
 */
function show_import_instruction_set_modal(){
    app.clear_main_form_errors();
    app.import_instruction_set_modal.show();
}

/**
 * hide import instruction set modal
 */
function hide_import_instruction_set_modal(){
    app.cancel_modal = false;
    app.clear_main_form_errors();
}

/** send request to download instructions to a file 
*/
function send_download_instruction_set(){
    
    app.working = true;
    app.send_message("download_instruction_set", {instruction_set_id:app.instruction_set.id});
}

/** download parameter set into a file 
 @param message_data {json} result of file request, either sucess or fail with errors
*/
function take_download_instruction_set(message_data){

    if(message_data.value == "success")
    {                  
        console.log(message_data.instruction_set);

        let download_link = document.createElement("a");
        let jsonse = JSON.stringify(message_data.instruction_set);
        let blob = new Blob([jsonse], {type: "application/json"});
        let url = URL.createObjectURL(blob);
        download_link.href = url;
        download_link.download = "Instruction_Set_" + app.instruction_set.id + ".json";

        document.body.appendChild(download_link);
        download_link.click();
        document.body.removeChild(download_link);                     
    } 

    app.working = false;
}

/**upload a parameter set file
*/
// upload_instruction_set:function upload_instruction_set(){  

//     let form_data = new FormData();
//     form_data.append('file', app.upload_file);

//     axios.post('/staff-instruction-edit/{{id}}/', form_data,
//             {
//                 headers: {
//                     'Content-Type': 'multipart/form-data'
//                     }
//                 } 
//             )
//             .then(function (response) {     

//                 // app.upload_instruction_set_message = response.data.message.message;
//                 // app.session = response.data.session;
//                 // app.upload_instruction_set_button_text= 'Upload <i class="fas fa-upload"></i>';
//                 location.reload();

//             })
//             .catch(function (error) {
//                 console.log(error);
//                 app.searching=false;
//             });                        
// }

//direct upload button click
function send_upload_instruction_set(){
    app.working = true;

    app.send_message("upload_instruction_set", {id:app.instruction_set.id,
                                                instruction_set_text: app.upload_file_text});
}

//file upload
function handle_file_upload(){
    app.upload_file = app.$refs.file.files[0];
    app.upload_file_name = app.upload_file.name;

    let reader = new FileReader();
    reader.onload = e => app.upload_file_text = e.target.result;
    reader.readAsText(app.upload_file);
}

/** show upload instruction_set modal
*/
function show_upload_instruction_set(upload_mode){
    app.upload_mode = upload_mode;
    app.upload_instruction_set_message = "";

    app.upload_instruction_set_modal.toggle();
}