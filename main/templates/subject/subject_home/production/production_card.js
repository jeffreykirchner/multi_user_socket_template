/**
 * update producton slider values when slider is moved
 */
update_production_slider(){

    // production_slider : 0,
    // production_slider_one : 50,
    // production_slider_two : 50,

    if(app.$data.production_slider < 0){

        app.$data.production_slider_one = Math.abs(app.$data.production_slider) + 50;
        app.$data.production_slider_two = 100 - app.$data.production_slider_one;

    }else if(app.$data.production_slider > 0){

        app.$data.production_slider_two = Math.abs(app.$data.production_slider) + 50;
        app.$data.production_slider_one = 100 - app.$data.production_slider_two;

    }else{
        app.$data.production_slider = 0;
        app.$data.production_slider_one = 50;
        app.$data.production_slider_two = 50;
    }

},

/**
 * send prouduction rate updates
 */
sendProdution(){

    if(app.$data.working) return;
    
    app.$data.working = true;
    app.sendMessage("production_time", {"production_slider_one" : app.$data.production_slider_one,
                                        "production_slider_two" : app.$data.production_slider_two,
                            });                   
},

/** take result of production rate updates
*/
takeProduction(messageData){

    if(messageData.status.value == "success")
    {
        result = messageData.status.result;       
        
        app.$data.session_player.good_one_production_rate = result.good_one_production_rate;
        app.$data.session_player.good_two_production_rate = result.good_two_production_rate;
    } 
    else
    {
        
    }
},