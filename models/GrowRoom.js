class HeatController {
    constructor() {

    }
    timer;
    interval = 1000;
    status = "Stopped";
    MonitorLoop() {
        if (this.status === "Running") {
            // do work here
            let t = this;
            setTimeout(() => t.MonitorLoop(), t.interval);
        } else {
            let d = new Date();
            console.log(`${this.status}@${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`);
        }
    }
    Run() {
        console.log("Run Started");
        this.status = "Running";
        this.MonitorLoop();
    }
    Stop() {
        this.status = "Stopped";
    }
    IncreaseInterval() {
        this.interval = 2000;
    }
}

class GrowRoom {
    HeatController;
    constructor() {
        this.HeatController = new HeatController();
    }
}

exports.GrowRoom = new GrowRoom();