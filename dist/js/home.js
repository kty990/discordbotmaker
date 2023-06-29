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

function addAction(data) {
    let p = document.createElement("p");
    p.textContent = `${data}`;
    information.appendChild(p);
}

window.api.receive("action", (data) => {
    addAction(data);
    window.api.send("console-action-home", { set: true, value: `${data}` });
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

async function main() {
    let output = await window.api.invoke("console-action-home", { set: false });
    // output.reverse();
    for (let value of output) {
        addAction(value);
    }
}

main();