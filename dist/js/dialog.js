let messageBox = document.getElementById("message");
let okayButton = document.getElementById("okay");

window.api.receive("message", (...data) => {
    messageBox.textContent = data.join("\n");
})

okayButton.addEventListener("click", () => {
    window.opener.postMessage("dialogClosed", "*");
    window.close();
})