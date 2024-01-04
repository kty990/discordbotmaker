export class Notification {
    static types = {
        info: null,
        error: "#7d0000",
        warning: "#e0982b",
        fatal: "#ff0000"
    }

    constructor(type = info) {
        this.type = type;
    }

    create(t = "Notification", description = "Something went wrong! Error Code: 500") {
        const notif = `<div class="notification">
    <div id="topbar"${(this.type !== Notification.types.info) ? `style="background-color:${this.type};"` : ''}>
        <p id="title">${t}</p>
        <p id="close-notif">X</p>
    </div>
    <p id="description-notif">${description}</p>
</div>`;
        return notif;
    }


}