const { Console } = require('console');
const events = require('events');
const EventEmitter = new events.EventEmitter();

// data logger
EventEmitter.on('temp', (temp) => {
    console.log(`Temp is ${temp} degrees F`);
});
EventEmitter.on('humidity', (humidity) => {
    console.log(`Humidity is ${humidity}%`);
});

class HumidityController {
    constructor() {
    }
    status = 'Stopped';
    interval = 60; // in seconds
    target;
    tolerance;
    RunLoop() {
        if(this.status == 'Running') {
            console.log('Monitoring humidity ...');
            // do work here
            EventEmitter.emit('humidity', 50);
            // log event
            setTimeout(() => this.RunLoop(), (this.interval * 1000));
        } else {
            console.log('Stopped');
        }
    }
    Run() {
        console.log('Starting humidity controller ...');
        this.status = "Running";
        this.RunLoop();
    }
    Stop() {
        console.log("Stopping ...");
        this.status = 'Stopped';
    }
    Update(humidityController) {
        this.status = 'Stopped';
        this.interval = humidityController.interval;
        this.target = humidityController.target;
        this.tolerance = humidityController.tolerance;
    }
}

class LightController {
    duration;
    status;
    timeOn;
    timeOff;
    lightPin;
    constructor(){
        this.status = 'Stopped';
        this.timeOn = 13;
        this.timeOff = 21;
    }
    RunLoop() {
        if(this.status == 'Running') {
            let date = new Date();
            if(date.getHours()>=this.timeOff){
                // turn light off;
                console.log('Turning light off');
            } else if(date.getHours()>=this.timeOn){
                // turn light on
                console.log('Turning light on');
            } else {
                // turn light off
                console.log('Turning light off');
            }
            setTimeout(() => this.RunLoop(), 60000);
        } else {
            console.log("Light run loop stopped")
        }
    }
    Run() {
        this.status = "Running";
        this.RunLoop();
    }
    Stop() {
        this.status = "Stopped";
    }
    Update(lightController) {
        this.status = 'Stopped';
        this.timeOn = lightController.timeOn;
        this.timeOff = lightController.timeOff;
        this.lightPin = lightController.lightPin;
    }
}

class HeatController {
    constructor() {
        // set heater pin
        this.state = 'off';
    }
    interval = 60; // in seconds
    status = "Stopped";
    state;
    currentTemp;
    targetTemp = 72;
    tolerance = 1;
    RunLoop() {
        if (this.status === "Running") {
            // do work here
            // get current temp
            this.currentTemp = 70;
            if(this.state && this.state == 'on') {
                if(this.currentTemp >= this.targetTemp){
                    // turn pin off
                    this.state = 'off';
                    console.log('Turning off heater');
                }
            } else {
                console.log(`Current Temp = ${this.currentTemp}, Target Temp = ${this.targetTemp}, Tolerance = ${this.tolerance}`);
                if(this.currentTemp < this.targetTemp - this.tolerance) {
                    // turn pin on
                    this.state = 'on';
                    console.log('Turning on heater');
                }
            }
            EventEmitter.emit('temp', this.currentTemp);
            let t = this;
            setTimeout(() => t.RunLoop(), t.interval*1000);
        } else {
            console.log('Stopping heat controller ...');
        }
    }
    Run() {
        console.log("Run Started");
        this.status = "Running";
        this.RunLoop();
    }
    Stop() {
        this.status = "Stopped";
    }
    Update(heatcontroller) {
        this.interval = heatcontroller.interval;
        this.status = heatcontroller.status;
    }
}

class GrowRoom {
    HeatController;
    LightController;
    HumidityController;
    constructor() {
        this.HeatController = new HeatController();
        this.LightController = new LightController();
        this.HumidityController = new HumidityController();
    }
    Update(growroom){
        this.HeatController.Update(growroom.HeatController);
        this.LightController.Update(growroom.LightController);
        this.HumidityController.Update(growroom.HumidityController);
    }
    GetSensors() {
        
    }
}

module.exports = new GrowRoom();