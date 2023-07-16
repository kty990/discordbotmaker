try {
    let iscommand = document.getElementById("iscommandToggle");
    let iscommandP = iscommand.querySelector("p");
    let argsDiv = document.getElementById("argContainer");
    let argsDiv2 = document.getElementById("args");

    let newPlugin = document.getElementById("newPlugin");
    let savePlugin = document.getElementById("savePlugin");
    let pluginList = document.getElementById("pluginList");

    let codeArea = document.getElementById("codeBox");
    let pluginNameInput = document.getElementById("pluginName");
    let pluginDescInput = document.getElementById("description");

    var plugins = [];
    var currentPlugin = null;

    function adjustBrightness(color, brightness) {
        // Check if the color is in RGB format (e.g., "rgb(255, 0, 0)")
        if (color.startsWith("rgb")) {
            // Parse the color string into its RGB components
            const rgb = color.match(/\d+/g);
            const red = parseInt(rgb[0]);
            const green = parseInt(rgb[1]);
            const blue = parseInt(rgb[2]);

            // Calculate the adjusted brightness
            const adjustedRed = Math.max(0, Math.min(255, red * brightness));
            const adjustedGreen = Math.max(0, Math.min(255, green * brightness));
            const adjustedBlue = Math.max(0, Math.min(255, blue * brightness));

            // Construct the adjusted color string
            const adjustedColor = `rgb(${adjustedRed}, ${adjustedGreen}, ${adjustedBlue})`;

            return adjustedColor;
        } else if (color.startsWith("#")) {
            // Check if the color is in hexadecimal format (e.g., "#FF0000")
            const hex = color.replace("#", "");
            const num = parseInt(hex, 16);

            // Extract the RGB components from the hexadecimal value
            const red = (num >> 16) & 255;
            const green = (num >> 8) & 255;
            const blue = num & 255;

            // Calculate the adjusted brightness
            const adjustedRed = Math.max(0, Math.min(255, red * brightness));
            const adjustedGreen = Math.max(0, Math.min(255, green * brightness));
            const adjustedBlue = Math.max(0, Math.min(255, blue * brightness));

            // Convert the adjusted RGB components back to hexadecimal format
            const adjustedHex = `#${(adjustedRed << 16 | adjustedGreen << 8 | adjustedBlue).toString(16).padStart(6, "0")}`;

            return adjustedHex;
        } else {
            // Invalid color format
            return null;
        }
    }

    class MyPlugin {
        constructor(name, author, description, div, isCommand = true, code = "<TEST CODE>", executeFunction = () => { }, status = "Warning") {
            this.name = name;
            this.default_name = name;
            this.author = author;
            this.description = description;
            this.div = div;
            this.isCommand = isCommand;
            this.code = code;
            this.status = status;
            this.executeFunction = executeFunction;
        }

        send() {
            return {
                name: this.name,
                author: this.author,
                description: this.description,
                isCommand: this.isCommand,
                code: this.code,
                executeFunction: null,
                div: this.div.innerHTML,
                status: this.status
            }
        }
    }

    let enabled = true;
    iscommand.addEventListener("click", () => {
        enabled = !enabled;
        if (enabled) {
            iscommand.style.backgroundColor = "var(--interaction)";
            iscommandP.textContent = "✓";
            argsDiv.style.display = "flex";
            argsDiv2.style.display = "flex";
        } else {
            let color = getComputedStyle(iscommand).getPropertyValue('--interaction');
            iscommand.style.backgroundColor = adjustBrightness(color, 0.5);
            iscommandP.textContent = "X";
            argsDiv.style.display = "none";
            argsDiv2.style.display = "none";
        }
    })

    newPlugin.addEventListener("mouseenter", () => {
        let color = getComputedStyle(newPlugin).getPropertyValue('--interaction');
        newPlugin.style.backgroundColor = adjustBrightness(color, 0.5);
    })
    newPlugin.addEventListener("mouseleave", () => {
        newPlugin.style.backgroundColor = "var(--interaction)";
    })

    savePlugin.addEventListener("mouseenter", () => {
        let color = getComputedStyle(savePlugin).getPropertyValue('--interaction');
        savePlugin.style.backgroundColor = adjustBrightness(color, 0.5);
    })
    savePlugin.addEventListener("mouseleave", () => {
        savePlugin.style.backgroundColor = "var(--interaction)";
    })
    savePlugin.addEventListener("click", () => {
        currentPlugin.name = pluginNameInput.value;
        currentPlugin.description = pluginDescInput.value;
        currentPlugin.isCommand = !(iscommandP.textContent == "X");
        currentPlugin.code = codeArea.textContent;
        window.api.send("pluginChange", currentPlugin.send());
    })

    newPlugin.addEventListener("click", async () => {
        let n = await window.api.invoke("newPlugin");
        addPlugin(n);
    })

    function addPlugin(data) {
        let name = data.name;
        let author = data.author;
        let description = "";
        let isCommand = true;
        let code = "";
        let executeFunction = () => {

        }
        let status = data.status;
        let plugin = new MyPlugin(name, author, description, null, isCommand, code, executeFunction);
        let div = document.createElement("div");
        div.classList.add("plugin");
        plugin.div = div;
        /**
         * <p id="name">PLUGIN NAME</p>
                <p id="author">PLUGIN AUTHOR</p>
                <div id="status">Running</div>
         */
        let p0 = document.createElement("p");
        let p1 = document.createElement("p");
        let p2 = document.createElement("p");
        p0.id = "name";
        p1.id = "author";
        p2.id = "status";

        p0.textContent = name;
        p1.textContent = author;
        p2.textContent = status;

        div.appendChild(p0);
        div.appendChild(p1);
        div.appendChild(p2);

        div.addEventListener("click", () => {
            OnPluginSelect(plugin);
        })

        pluginList.appendChild(div);

        plugins.push(plugin);

        OnPluginChange(plugin);
    }

    function GetColorForStatus(status) {
        switch (status.toLowerCase()) {
            case "running":
                return "#10ad12"
            case "warning":
                return "#d9ae21"
            case "error":
                return "#910000"
            case "disabled":
                return "#360000"
            case "info":
                return "#002336"
            default:
                return "#cccccc"
        }
    }

    function OnPluginChange(data) {
        console.log(`OnPluginChange\n\n${Object.entries(data)}\t${Object.values(data).length}`);
        let name = data.name;
        let author = data.author;
        // let div = plugin.div;
        let div;
        if (Object.values(data).length == 8) {

            for (let plugin of plugins) {
                console.log(`${plugin.default_name}, ${data.default_name}`);
                if (plugin.default_name == data.default_name) {
                    div = plugin.div;
                    console.log("FOUND!");
                    break;
                } else {
                    console.log("next");
                }
            }

        } else {
            for (let plugin of plugins) {
                if (plugin.default_name == data.default_name) {
                    div = plugin.div;
                    console.log("FOUND!");
                    break;
                }
            }
        }

        console.log("DIV: ", div);

        div.querySelector("#status").textContent = data.status || "Warning";
        div.querySelector("#status").style.color = GetColorForStatus(div.querySelector("#status").textContent);

        div.querySelector("#name").textContent = name;
        div.querySelector("#author").textContent = author;
    }

    function OnPluginError(plugin, error) {

    }

    function OnPluginSelect(plugin) {
        let name = plugin.name;
        let author = plugin.author;
        let div = plugin.div;
        let description = plugin.description;
        let code = plugin.code;
        let isCommand = plugin.isCommand;
        codeArea.value = code;
        pluginNameInput.value = name;
        pluginDescInput.value = description;

        if (currentPlugin) {
            currentPlugin.div.style.backgroundColor = null;
        }
        currentPlugin = plugin;
        let color = getComputedStyle(div).getPropertyValue('--interaction');
        currentPlugin.div.style.backgroundColor = adjustBrightness(color, 1.5);

        if (isCommand) {
            iscommand.style.backgroundColor = "var(--interaction)";
            iscommandP.textContent = "✓";
            argsDiv.style.display = "flex";
            argsDiv2.style.display = "flex";
        } else {
            let color = getComputedStyle(iscommand).getPropertyValue('--interaction');
            iscommand.style.backgroundColor = adjustBrightness(color, 0.5);
            iscommandP.textContent = "X";
            argsDiv.style.display = "none";
            argsDiv2.style.display = "none";
        }
    }

    window.api.on("pluginChange", (data) => {
        OnPluginChange(data);
    })

    window.api.on("pluginError", (data) => {
        OnPluginError(data);
    })

    window.api.on("set-plugins", (plugins) => {
        console.log("set--plugins--called");
        for (let plugin of plugins) {
            addPlugin(plugin);
        }
    })
} catch (e) {
    console.error(e);
}