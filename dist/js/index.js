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

const username = document.getElementsByTagName("input")[0];
const password = document.getElementsByTagName("input")[1];
const warning = document.getElementById("pw-warning-inactive");
const submit = document.getElementById("submit");
const form = document.getElementsByTagName("form")[0];

async function wait(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    })
}

async function init() {
    try {
        let value = await window.api.invoke("checkFirstUse");
        console.log(`Value: ${value}`);
        if (value) {
            submit.value = "Create";
        }
    } catch (e) {
        console.debug(e);
    }
}

init();

form.addEventListener("submit", event => {
    window.api.send("loginAttempt", { "username": username.value, "pw": password.value });
    event.preventDefault();
})

window.api.receive("loginAttempt", (...args) => {
    if (args[0] === true) {
        warning.id = "pw-warning-inactive";
    } else {
        warning.id = "pw-warning";
    }
})