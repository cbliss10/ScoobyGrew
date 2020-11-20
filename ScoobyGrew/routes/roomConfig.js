const express = require('express');
const growroom = require('../models/GrowRoom');

const router = express.Router();

router.route('/')
    .get((req, res) => {
        return res.json(growroom);
    })
    .put((req, res) => {
        console.log(req.body);
        growroom.Update(req.body);
        return res.send("Success");
    });

router.route('/sensors')
    .get((req, res) => {
        return res.json(growroom.GetSensors());
    })

module.exports = router;