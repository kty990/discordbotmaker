const container = document.getElementById("container");

async function main() {
    let commands = await window.api.invoke("commandList", null);
    console.log("COMMANDS >> ", commands);
    commands.forEach((command) => {
        let name = command[0];
        let adminLevel = command[1];
        console.log(`Name: ${name}\nAdmin Level: ${adminLevel}`);
        let div = document.createElement("div");
        div.classList.add("command");
        div.textContent = name;
        container.appendChild(div);
    })
}

main();