let showToken = document.getElementById("showToken");
let showTokenLabel = document.getElementById("showTokenLabel");
let tokenField = document.getElementById("token");
let saveToken = document.getElementById("saveToken");

let information = document.getElementById("information");

let start = document.getElementById("start");
let stp = document.getElementById("stop");

start.addEventListener("click", () => {
    window.api.send("action", "start");
})

stp.addEventListener("click", () => {
    window.api.send("action", "stop");
})

window.api.send("setToken", null);
window.api.once("setToken", (token) => {
    tokenField.value = `${token}`;
})

window.api.receive("action", (data) => {
    let p = document.createElement("p");
    p.textContent = `${data}`;
    information.appendChild(p);
})

showToken.addEventListener("change", (event) => {
    let checked = event.target.checked;
    if (checked) {
        tokenField.setAttribute("type", "text");
    } else {
        tokenField.setAttribute("type", "password");
    }
})

saveToken.addEventListener("click", () => {
    if (tokenField.value.length > 0) {
        window.api.send("saveToken", tokenField.value);
    }
})

window.api.receive("saveToken", () => {
    tokenField.value = "";
    window.api.send("alert", "Saved!");
})