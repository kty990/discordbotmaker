class MyEvent {
    constructor(name) {
        this.handlers = [];
        this.name = name;
    }

    add_handler(handler) {
        this.handlers.push(handler)
    }

    on(handler) {
        this.add_handler(handler);
    }

    remove_handler(handler) {
        this.handlers.remove(handler);
    }

    off(handler) {
        this.remove_handler(handler);
    }

    fire(...args) {
        try {
            for (const handler of this.handlers) {
                handler(args);
            }
        } catch (e) {
            console.error(e);
        }
    }
}


const Action = new MyEvent("Action");
const Server2Server = new MyEvent("Server2Server");

module.exports = { Action, Server2Server };