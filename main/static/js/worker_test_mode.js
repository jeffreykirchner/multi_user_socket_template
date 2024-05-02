
onmessage = async function (e) {
    //console.log('Message received from main script');
    // app.send_message("continue_timer", {});
    let go=true;
    while(go){
        await sleep(random_number(500,1500));
        postMessage("");
    }
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * do random self test actions
 */
function random_number(min, max){
    //return a random number between min and max
    min = Math.ceil(min);
    max = Math.floor(max+1);
    return Math.floor(Math.random() * (max - min) + min);
}
