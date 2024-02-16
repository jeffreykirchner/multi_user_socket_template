
onmessage = async function (e) {
    //console.log('Message received from main script');
    // app.send_message("continue_timer", {});
    let go=true;
    while(go){
        await sleep(333);
        postMessage("");
    }
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}