
onmessage = async function (e, sleep_length) {
    //console.log('Message received from main script');
    // app.send_message("continue_timer", {});
    let go=true;
    while(go){
        await sleep(sleep_length);
        postMessage("");
    }
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}