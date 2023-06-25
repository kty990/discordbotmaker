const { app, BrowserWindow, Menu, dialog, ipcMain, autoUpdater } = require('electron');
const path = require('path');
const config = require("./dist/config.json");
const fs = require('fs');
const commands = require('./dist/js/commands.js');
const auth = require("./dist/auth.json");

const discord = require('./dist/discord/main.js');

const EXTENSION = "dbm"

let active_theme = null;

let DEFAULT_FILE_DATA = {
    "commands": [
        commands.help,
        commands.info,
        commands.kick,
        commands.ban,
        commands.play,
        commands.pause,
        commands.resume,
        commands.stop,
        commands.join,
        commands.leave,
        commands.cmds,
        commands.about
    ],
    "guilds": [],
    "author": "default_author"
}

let commandList = [
    commands.help,
    commands.info,
    commands.kick,
    commands.ban,
    commands.play,
    commands.pause,
    commands.resume,
    commands.stop,
    commands.join,
    commands.leave,
    commands.cmds,
    commands.about
];

let themeList = [];
let themesMenu = [];

function getThemeByName(name) {
    return new Promise((resolve, reject) => {
        for (let theme in themeList) {
            if (theme.name == name) {
                resolve(theme);
            }
        }
        reject(`No theme found matching the name ${name}`);
    })
}

function alertWindow(data) {
    let window = new BrowserWindow({
        maxWidth: 250,
        maxHeight: 200,
        minWidth: 250,   // Set the minimum width
        minHeight: 200,  // Set the minimum height
        width: 250,
        height: 200,
        webPreferences: {
            nodeIntegration: true,
            spellcheck: false,
            preload: path.join(__dirname, './dist/js/preload.js')
        },
    });

    window.loadFile('./dist/html/dialog.html');

    window.webContents.on('did-finish-load', () => {
        window.webContents.send('message', `${data}`);
    });

    // Set the window icon
    const iconPath = path.join(__dirname, './dist/images/icon.png');
    window.setIcon(iconPath);
}

const directoryPath = './dist/themes'; // Replace with your actual directory path

const populateThemes = (window) => {
    themeList = [];
    themesMenu = [];
    return new Promise(async (resolve, reject) => {
        const dir = await fs.promises.opendir(directoryPath);
        for await (const file of dir) {
            const filePath = path.join(directoryPath, file.name);
            const data = require(".\\" + filePath);
            let applyTheme = (d) => {
                console.log(d);
                window.webContents.send("apply-theme", d);
                active_theme = d;
            }
            themesMenu.push({
                label: data.name, click: () => {
                    applyTheme(data);
                }
            });
            themeList.push(data);
        }
        resolve();
    })
}

class GraphicsWindow {
    constructor() {
        this.window = null;
        this.current_z_index = 0;
        this.layers = []; // List to store layers
        this.active_layer = null; // Currently active layer

        this.currentProject = null;

        app.on('ready', () => {
            this.createWindow();
        });
    }

    async createWindow() {
        this.window = new BrowserWindow({
            width: 800,
            height: 600,
            minWidth: 800,   // Set the minimum width
            minHeight: 600,  // Set the minimum height
            webPreferences: {
                nodeIntegration: true,
                spellcheck: false,
                preload: path.join(__dirname, './dist/js/preload.js')
            },
        });

        // Set the window icon
        const iconPath = path.join(__dirname, './dist/images/icon.png');
        this.window.setIcon(iconPath);

        const placeholder = (prompt) => {
            let func = () => {
                console.log(prompt);
            }
            return func;
        }

        const toggleDevTools = () => {
            this.window.webContents.toggleDevTools();
        }

        const newFile = async () => {
            console.log("new")
        }

        const open = async () => {
            console.log("open")
        }

        const save = () => {
            if (true) {
                console.log("Save")
            }
        }

        const saveas = () => {
            if (true) {
                console.log("save as")
            }
        }

        await populateThemes(this.window).catch(console.error);

        const menuTemplate = [
            {
                label: 'File',
                submenu: [
                    { label: 'New', click: newFile },
                    { label: 'Open', click: open },
                    { label: 'Refresh', role: 'reload' },
                    { type: 'separator' },
                    { label: 'Save', click: save },
                    { label: 'Save As', click: saveas },
                    { type: 'separator' },
                    { label: 'Exit', click: app.quit }
                ]
            },
            {
                label: 'View',
                submenu: [
                    { label: 'Themes', submenu: themesMenu },
                    { label: 'Toggle Developer Tools', accelerator: 'CmdOrCtrl+Shift+I', click: toggleDevTools }
                ]
            }
            // Add more menu items as needed
        ];

        const menu = Menu.buildFromTemplate(menuTemplate);
        Menu.setApplicationMenu(menu);

        this.window.setMenu(menu);

        this.window.loadFile('./dist/html/index.html');

        this.window.on('closed', () => {
            this.window = null;
        });

    }
}

const graphicsWindow = new GraphicsWindow();

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        graphicsWindow.createWindow();
    }
});

ipcMain.on("redirect", async (event, data) => {
    themeList = [];
    themesMenu = [];
    await populateThemes(graphicsWindow.window);
    graphicsWindow.window.webContents.send("list-of-themes", themeList);
    graphicsWindow.window.webContents.send("apply-theme", active_theme || null);
})


ipcMain.on("loginAttempt", (event, data) => {
    console.log(data);
    console.log(auth);
    let canLogin = (auth['username'] == data['username'] && auth['password'] == data['pw']);
    if (!canLogin) {
        if (auth['username'] == null && auth['password'] == null) {
            if (data['username'].length >= 3 && 15 >= data['pw'].length && data['pw'].length >= 7) {
                canLogin = true;
                auth['username'] = data['username'];
                auth['password'] = data['pw'];
                fs.writeFileSync('./dist/auth.json', JSON.stringify(auth, null, 2));
            } else {
                canLogin = "Invalid username or password length. Usernames must be 3+ characters, and passwords must be between 7 and 15 characters.";
            }
        }
    }
    console.log(`Can Login: ${canLogin}`);
    graphicsWindow.window.webContents.send('loginAttempt', canLogin);

    if (canLogin == true) {
        graphicsWindow.window.loadFile("./dist/html/home.html");
    }
});

ipcMain.on("reset", (event, data) => {
    auth['username'] = null;
    auth['password'] = null;
    auth['authToken'] = null;
    fs.writeFileSync('./dist/auth.json', JSON.stringify(auth, null, 2));
});

discord.Action.add_handler(function (...args) {
    console.log("SENDING");
    graphicsWindow.window.webContents.send("action", args);
})

ipcMain.on("modTheme", async (event, data) => {
    let themeName = await getThemeByName(data[0])
    let theme = require(`./dist/themes/${themeName}.json`);
    theme.body = data[1];
    theme.menu = data[2];
    theme.interaction = data[3];
    theme.text = data[4];
    theme['text-hover'] = data[5];
    theme.active = data[6];
    theme.border = data[7];
    fs.writeFileSync(`./dist/themes/${themeName}.json`, JSON.stringify(theme, null, 2));
    graphicsWindow.window.webContents.send("apply-theme", theme);
    active_theme = theme;
});

ipcMain.on("newTheme", async (event, data) => {
    const themeTemplate = {
        "name": `New_Theme_${themeList.length + 1}`,
        "body": "#ffffff",
        "menu": "#000000",
        "interaction": "#cccccc",
        "text": "#7d7d7d",
        "text-hover": "#7d7d7d",
        "active": "#444444",
        "border": "#ff00ff",
        "notes": [
            "Custom Theme"
        ]
    }
    fs.writeFileSync(`./dist/themes/${`New_Theme_${themeList.length + 1}`}.json`, JSON.stringify(themeTemplate, null, 2));
    await populateThemes(graphicsWindow.window);
    graphicsWindow.window.webContents.send("newTheme", null);
});

ipcMain.on("saveToken", (event, data) => {
    auth.authToken = `${data}`;
    fs.writeFileSync(`./dist/auth.json`, JSON.stringify(auth, null, 2));
    graphicsWindow.window.webContents.send("saveToken", null);
})

ipcMain.on("setToken", (event, data) => {
    graphicsWindow.window.webContents.send("setToken", auth.authToken);
})

ipcMain.on("alert", (event, data) => {
    alertWindow(data);
})

ipcMain.on("action", (event, data) => {
    if (data == "start") {
        console.log("STARTING...");
        discord.setCommands(commandList);
        discord.Start(auth.authToken);
    } else if (data == "stop") {
        discord.Stop();
        discord.Action.fire("Successfully terminated bot execution.");
    }
})

ipcMain.on("commandList", (event, data) => {
    console.log("COMMANDS << ", commands.commands);
    graphicsWindow.window.webContents.send("commandList", commands.commands);
})

if (process.platform === 'win32') {
    app.setAppUserModelId(config['project-name']);
}

autoUpdater.setFeedURL({
    provider: 'github',
    repo: 'kty990/discordbotmaker',
    owner: 'your-repo-owner',
    private: false // set to true if your repository is private
});