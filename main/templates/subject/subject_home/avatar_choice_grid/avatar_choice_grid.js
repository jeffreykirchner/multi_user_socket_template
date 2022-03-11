/**
 * get image html
 */
get_grid_image_html(r, c){

    let parameter_set_avatars = this.session.parameter_set.parameter_set_avatars;

    image_id="blank.png";

    for(let i=0; i<parameter_set_avatars.length;i++)
    {
        if(parameter_set_avatars[i].grid_location_row == r && parameter_set_avatars[i].grid_location_col == c)
        {
            if( parameter_set_avatars[i].avatar)
                image_id = parameter_set_avatars[i].avatar.file_name;
            break;
        }
    }

    if(image_id == "blank.png")
        return `<img id="` + image_id + `" class="" src="/static/avatars/` + image_id + `">`;

    return `        
        <img class="image_choice_grid img-thumbnail" id="` + image_id + `" src="/static/avatars/` + image_id + `">
    `;
},

/**
 * handle choice grid click
 */
take_choice_grid_click(r, c){

    if(this.working) return;
    if(this.session_player.avatar != null) return;

    let parameter_set_avatars = this.session.parameter_set.parameter_set_avatars;

    //check for blank
    for(let i=0; i<parameter_set_avatars.length;i++)
    {
        if(parameter_set_avatars[i].grid_location_row == r && 
           parameter_set_avatars[i].grid_location_col == c &&
           parameter_set_avatars[i].avatar == null
           )
        {
            return
        }
    }


    this.avatar_choice_grid_selected_row = r;
    this.avatar_choice_grid_selected_col = c;
},

/**
 * handle choice grid click
 */
 take_choice_grid_label(label){

    let parameter_set_avatars = this.session.parameter_set.parameter_set_avatars;

    //check for blank
    for(let i=0; i<parameter_set_avatars.length;i++)
    {

        if(parameter_set_avatars[i].avatar && parameter_set_avatars[i].avatar.label == label)
        {
            this.avatar_choice_grid_selected_row = parameter_set_avatars[i].grid_location_row;
            this.avatar_choice_grid_selected_col = parameter_set_avatars[i].grid_location_col;

            return
        }
    }
},

/**
 * send avatar choice
 */
sendAvatar(){

    if(this.working) return;

    if(this.avatar_choice_grid_selected_row == 0) return;
    if(this.avatar_choice_grid_selected_col == 0) return;

    if(this.session_player.avatar != null) return;
    
    app.$data.working = true;
    app.sendMessage("avatar", {"row" : this.avatar_choice_grid_selected_row,
                               "col" : this.avatar_choice_grid_selected_col,
                            });             
},

/** take result of moving goods
*/
takeAvatar(messageData){
    //app.$data.cancelModal=false;
    //app.clearMainFormErrors();

    if(messageData.status.value == "success")
    {
        this.session_player.avatar = messageData.status.result.avatar;         
    } 
    else
    {
        
    }
},

