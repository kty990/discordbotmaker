// console.log = (function (old) {
//     return (text) => {
//         old(text);
//         window.api.send("output", null);
//     }
// }(console.log.bind(console)));

let sbElement = document.getElementById("replacewithsidebar");

window.api.send("redirect", null);

window.api.on("add-to-body", (data) => {
    let element = new DOMParser().parseFromString(data, 'text/html').body.firstChild;
    document.body.appendChild(element);
})

window.api.on("add-to-notifs", (data) => {
    console.log('Debug', data, ' end debug');
    console.log("Adding notification", data);
    let d = new DOMParser().parseFromString(data, 'text/html');
    console.log(`Parsed: ${d}`);
    let element = d.body.firstChild;
    d.getElementById("close-notif").addEventListener("click", () => {
        element.remove();
    })
    if (!document.getElementById("notifications")) {
        let e = document.createElement("div");
        e.id = "notifications";
        document.body.appendChild(e);
    }
    document.getElementById("notifications").appendChild(element);
    setTimeout(() => {
        try {
            if (element.parentElement) {
                element.remove();
            }
        } catch (e) { }
    }, 5000);
})

function createNotification(t = "Notification", description = "Something went wrong! Error Code: 500", type) {
    const notif = `<div class="notification">
    <div id="topbar"${(type !== null) ? `style="background-color:${type};"` : ''}>
        <p id="title">${t}</p>
        <p id="close-notif">X</p>
    </div>
    <p id="description-notif">${description}</p>
</div>`;
    return notif;
}

async function main() {
    if (sbElement) {
        await fetch("../html/sidebar.html")
            .then((res) => res.text())
            .then((text) => {
                let div = document.createElement("div");
                div.innerHTML = text;
                document.body.appendChild(div);
                sbElement.remove();
            })
            .catch((e) => console.error(e));
    } else {
        let txt = `<div id="drag"></div>
        <div class="title-bar">
            <div class="title-bar-content">
                <img src="../images/icon.png">
                <p>Discord Bot Maker</p>
            </div>
            <div class="title-bar-buttons">
                <div class="title-bar-button" id="minimize">_</div>
                <div class="title-bar-button" id="close">X</div>
            </div>
        </div>`;
        let div = document.createElement("div");
        div.innerHTML = txt;
        document.body.appendChild(div);
    }


    try {
        var path = window.location.pathname;
        var page = path.split("/").pop().split(".")[0];

        let element = document.getElementById(page.toLowerCase());
        element.id = "active";
    } catch (e) {
        console.error(e);
    }

    try {
        let e = document.head.getElementsByTagName("link");
        let found = false;
        for (let link in e) {
            if (e.href == "../css/program.css") {
                found = true;
                break;
            }
        }
        if (!found && sbElement) {
            let link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "../css/program.css";
            document.head.appendChild(link);
        }
    } catch (e) {
        console.error(e);
    }
}



window.api.on("apply-theme", (data) => {
    if (data == null || data == undefined) return;
    Object.entries(data).forEach(([variable, color]) => {
        document.documentElement.style.setProperty(`--${variable.toLowerCase()}`, color);
        if (variable.toLowerCase() == "menu") {
            document.documentElement.style.setProperty(`--tut-${variable.toLowerCase()}`, `${color}cc`);
        }
    });
});



window.api.on("action", (d) => {
    let data = d[0];
    console.log("Recording action from program.js (...)");
    //              TYPE          ARGS..............................
    //Action.fire("command", `${message.user}`, cmd.name, message.content);

    if (data[0] == "command") {
        window.api.send("command-action-home", { set: true, value: `${data}` });
    } else if (data[0] == "mod") {
        window.api.send("mod-action-home", { set: true, value: `${data}` });
    } else if (data[0] == "err") {
        window.api.send("err-action-home", { set: true, value: `${data}` });

        try {
            let notification = createNotification("Error", data[1], "#cc0000");
            let d = new DOMParser().parseFromString(notification, 'text/html');
            let element = d.body.firstChild;
            d.getElementById("close-notif").addEventListener("click", () => {
                element.remove();
            })
            if (!document.getElementById("notifications")) {
                let div = document.createElement("div");
                div.id = "notifications";
                document.body.appendChild(div);
            }
            document.getElementById("notifications").appendChild(element);

        } catch (e) {
            console.error(e);
        }

    } else {
        window.api.send("console-action-home", { set: true, value: `${data}` });
    }
})

main().then(() => {
    let x = document.getElementById("close");
    let mm = document.getElementById("minimize");

    console.log(`x:${x}\n_: ${mm}`);

    x.addEventListener("click", () => {
        window.api.send("close");
    })

    mm.addEventListener("click", () => {
        window.api.send("minimize");
    })
}).catch((e) => {
    console.error(e);
    alert(e);
});

document.addEventListener("keydown", (ev) => {
    if (ev.ctrlKey && ev.key.toLowerCase() === "r") {
        window.api.send("dev-refresh");
    } else if (ev.ctrlKey && ev.key.toLowerCase() == "t") {
        window.api.send("toggle-dev-tools");
    }
});