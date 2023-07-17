class MyEvent {
    constructor() {
        this.handlers = [];
    }

    add_handler(handler) {
        this.handlers.push(handler)
        console.log("ADDING HANDLER", this.handlers.length);
    }

    remove_handler(handler) {
        this.handlers.remove(handler);
    }

    fire(...args) {
        for (const handler of this.handlers) {
            console.log("Running handler");
            handler(args);
        }
    }
}


const Action = new MyEvent();

module.exports = { Action };