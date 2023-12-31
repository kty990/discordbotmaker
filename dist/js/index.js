/**
 * 
 * <div id="login">
        <span>
            <p class="label">Username</p>
            <input>
        </span>
        <span>
            <p class="label">Password</p>
            <input type="password">
            <p id="pw-warning-inactive">Username or password is incorrect. Please try again.</p>
        </span>
        <span id="submit">
            <p>Submit</p>
        </span>
    </div>
 */

let username = document.getElementsByTagName("input")[0];
let password = document.getElementsByTagName("input")[1];
let warning = document.getElementById("pw-warning-inactive");
let submit = document.getElementById("submit");
let reset = document.getElementById("reset");

let form = document.getElementsByTagName("form")[0];

async function wait(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    })
}

form.addEventListener("submit", event => {
    window.api.send("loginAttempt", { "username": username.value, "pw": password.value });
    event.preventDefault();
})

reset.addEventListener("click", () => {
    window.api.send("reset", null);
    alert("Your token, username, and password were reset to default settings.");
})

window.api.receive("loginAttempt", (...args) => {
    if (args[0] === true) {
        warning.id = "pw-warning-inactive";
    } else {
        warning.id = "pw-warning";
    }
})