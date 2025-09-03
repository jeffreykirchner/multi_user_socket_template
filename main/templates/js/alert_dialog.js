//show alert dialog
function show_alert_dialog(message) {
    const dialog = document.createElement('dialog');
    dialog.style.borderRadius = '8px';
    dialog.style.border = '2px solid #ccc';
    dialog.innerHTML = `
        <div style="padding: 5px; font-family: Arial, sans-serif; text-align: center;">
            <h5 style="margin-bottom: 20px;">${message}</h5>

            <button onclick="this.closest('dialog').close()" class="btn btn-primary">OK</button>
        </div>
    `;
    document.body.appendChild(dialog);
    dialog.showModal();
    dialog.addEventListener('close', () => dialog.remove());
};

//show confirm dialog
function show_confirm_dialog(message) {
    return new Promise((resolve) => {
        const dialog = document.createElement('dialog');
        dialog.style.borderRadius = '8px';
        dialog.style.border = '2px solid #ccc';
        dialog.innerHTML = `
            <div style="padding: 10px; font-family: Arial, sans-serif; text-align: center;">
                <h5 style="margin-bottom: 5px;">${message}</h5>
                <div style="margin-top: 20px;">
                    <button id="confirmYes" type="button" class="btn btn-success">Yes</button>
                    <button id="confirmNo" type="button" class="btn btn-danger">No</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
        dialog.showModal();
        
        const yesBtn = dialog.querySelector('#confirmYes');
        const noBtn = dialog.querySelector('#confirmNo');
        
        yesBtn.addEventListener('click', () => {
            dialog.close();
            dialog.remove();
            resolve(true);
        });
        
        noBtn.addEventListener('click', () => {
            dialog.close();
            dialog.remove();
            resolve(false);
        });
        
        dialog.addEventListener('close', () => {
            dialog.remove();
            resolve(false);
        });
    });
};