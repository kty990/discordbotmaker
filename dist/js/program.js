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
    } catch (e) { }
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