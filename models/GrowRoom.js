const { Console } = require('console');
const events = require('events');
const EventEmitter = new events.EventEmitter();
const sensor  = require("node-dht-sensor");
const fs = require('fs');
let tempData = [];
let humidityData = [];
let timeData = [];

// data logger
EventEmitter.on('temp', (temp) => {
    console.log(`Temp is ${temp.toFixed(1)} degrees F`);
    if(tempData.length > 60) tempData.shift();
    tempData.push(temp);
    if(timeData.length > 60) timeData.shift();
    timeData.push(new Date());
    let stream = fs.createWriteStream("logs/tempLog.csv", {flags: 'a'});
    stream.write(`${new Date()}, ${temp.toFixed(1)}\n`);
    stream.close();
});
EventEmitter.on('humidity', (humidity) => {
    console.log(`Humidity is ${humidity.toFixed(1)}%`);
    if(humidityData.length > 60) humidityData.shift();
    humidityData.push(humidity);
    let stream = fs.createWriteStream("logs/humidityLog.csv", {flags: 'a'});
    stream.write(`${new Date()}, ${humidity.toFixed(1)}%\n`);
    stream.close();
});

class HumidityController {
    constructor() {
    }
    status = 'Stopped';
    interval = 60; // in seconds
    target = 82;
    tolerance = 1;
    currentHumidity;
    RunLoop() {
        if(this.status == 'Running') {
            // do work here
            let readout = sensor.read(22, 4);
            this.currentHumidity = readout.humidity;
            //console.log(`Temp = ${this.currentTemp}C`)
            if(this.state && this.state == 'on') {
                if(this.currentHumidity >= this.target){
                    // turn pin off
                    this.state = 'off';
                    console.log('Turning off humidifier');
                }
            } else {
                //console.log(`Current Humidity = ${this.currentHumidity}, Target Humidity = ${this.target}, Tolerance = ${this.tolerance}`);
                if(this.currentHumidity < this.target - this.tolerance) {
                    // turn pin on
                    this.state = 'on';
                    console.log('Turning on humidifier');
                }
            }
            EventEmitter.emit('humidity', this.currentHumidity);
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
    GetData() {
        return humidityData;
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
            let readout = sensor.read(22, 4);
            this.currentTemp = (readout.temperature*9/5)+32;
            //console.log(`Temp = ${this.currentTemp}C`)
            if(this.state && this.state == 'on') {
                if(this.currentTemp >= this.targetTemp){
                    // turn pin off
                    this.state = 'off';
                    console.log('Turning off heater');
                }
            } else {
                //console.log(`Current Temp = ${this.currentTemp}, Target Temp = ${this.targetTemp}, Tolerance = ${this.tolerance}`);
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
    GetData() {
        return tempData;
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
        sensor.read(22, 4, function(err, temperature, humidity) {
            if (!err) {
              console.log(`temp: ${(temperature * 9/5) + 32}°F, humidity: ${humidity}%`);
            }
          });
    }
    GetTimeData() {
        return timeData;
    }
}

module.exports = new GrowRoom();