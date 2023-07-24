let commands;

let hintElem = document.getElementById("hint");
let cli = document.getElementById("commandLineInterface")

async function main() {
    commands = await window.api.invoke("commandList", null);
    let show = [];
    for (let x = 0; x < commands.length; x++) {
        let command = commands[x][0].toLowerCase();
        try {
            if (command.substring(0, cli.value.length) == cli.value.toLowerCase().split(" ")[0]) {
                let p = document.createElement("p");
                p.textContent = command;
                let args = commands[x][3].join("\t")
                p.textContent = `${command} ${args}`;
                show.push(p);
            }
        } catch (e) {
            console.error(e);
            if (command.substring(0, cli.value.length - 1) == cli.value.toLowerCase().split(" ")[0]) {
                let p = document.createElement("p");
                p.textContent = command;
                let args = commands[x][3].join("\t")
                p.textContent = `${command} ${args}`;
                show.push(p);
            }
        }
        console.log(command.substring(0, cli.value.length), cli.value.toLowerCase());
    }
    hintElem.innerHTML = "";
    for (let elem of show) {
        hintElem.appendChild(elem);
    }
}

async function wait(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    })
}

cli.addEventListener("beforeinput", async () => {
    await wait(100);
    let show = [];
    for (let x = 0; x < commands.length; x++) {
        let command = commands[x][0].toLowerCase();
        try {
            if (command.substring(0, cli.value.length) == cli.value.toLowerCase().split(" ")[0]) {
                let p = document.createElement("p");
                p.textContent = command;
                let args = commands[x][3].join("\t")
                p.textContent = `${command} ${args}`;
                show.push(p);
            }
        } catch (e) {
            console.error(e);
            if (command.substring(0, cli.value.length - 1) == cli.value.toLowerCase().split(" ")[0]) {
                let p = document.createElement("p");
                p.textContent = command;
                let args = commands[x][3].join("\t")
                p.textContent = `${command} ${args}`;
                show.push(p);
            }
        }
        console.log(command.substring(0, cli.value.length), cli.value.toLowerCase());
    }
    hintElem.innerHTML = "";
    for (let elem of show) {
        hintElem.appendChild(elem);
    }
})

cli.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        window.api.send("executeCommand", cli.value);
        cli.value = "";
    }
})

main();