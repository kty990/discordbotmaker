window.api.recieve("createGuildSelect-servernick", (guilds) => {
    console.log(guilds);
    alert(guilds);
});

alert(window.api != null && window.api != undefined);