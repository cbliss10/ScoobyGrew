const express = require('express')
const growroom = require('../models/GrowRoom')
const router = express.Router();

router.route('/run')
    .get((req, res) => {
        growroom.HeatController.Run();
        growroom.LightController.Run();
        growroom.HumidityController.Run();
        return res.send(`Starting ...`);
    });

router.route('/status')
    .get((req, res) => {
      return res.json({
        temp: growroom.HeatController.currentTemp,
        tempData: growroom.HeatController.GetData(),
        humidity: growroom.HumidityController.currentHumidity,
        humidityData: growroom.HumidityController.GetData(),
        time: new Date(),
        timeData: growroom.GetTimeData()
      });
    })

router.route('/stop')
    .get((req, res) => {
      growroom.HeatController.Stop();
      growroom.LightController.Stop();
      growroom.HumidityController.Stop();
      return res.send('Stopping...');
    })

router.route('/data')
    .get((req, res) => {
      const chartData = {
        labels: growroom.GetTimeData(),
        datasets: [{
          label: 'Temp Data',
          data: growroom.HeatController.GetData(),
          yAxisID: 'tempAxis',
          borderColor: 'rgba(245, 66, 66)'
        },{
          label: 'Humidity Data',
          data: growroom.HumidityController.GetData(),
          yAxisID: 'humidityAxis',
          borderColor: 'rgba(66, 135, 245, 0.8)'
        }]
      };
      console.log(chartData);
      return res.json(chartData);
    })
module.exports = router;