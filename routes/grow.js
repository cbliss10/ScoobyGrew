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
      return res.send(`Status: ${growroom.HeatController.status}`);
    })

router.route('/stop')
    .get((req, res) => {
      growroom.HeatController.Stop();
      growroom.LightController.Stop();
      growroom.HumidityController.Stop();
      return res.send('Stopping...');
    })

module.exports = router;