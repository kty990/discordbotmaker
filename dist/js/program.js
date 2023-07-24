console.log = (function (old) {
    return (text) => {
        old(text);
        window.api.send("output", null);
    }
}(console.log.bind(console)));


let sbElement = document.getElementById("replacewithsidebar");

window.api.send("redirect", null);

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

main();

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
    } else {
        window.api.send("console-action-home", { set: true, value: `${data}` });
    }
})