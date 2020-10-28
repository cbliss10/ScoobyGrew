const express = require('express');
const growroom = require('./models/GrowRoom');

const app = express();
const growRouter = express.Router();
const port = process.env.PORT || 3000;
const myGrowRoom = growroom.GrowRoom;

growRouter.route('/run')
    .get((req, res) => {
        myGrowRoom.HeatController.Run();
        return res.send(`Starting ...`);
    });

growRouter.route('/status')
    .get((req, res) => {
      return res.send(`Status: ${myGrowRoom.HeatController.status}`);
    })

growRouter.route('/stop')
    .get((req, res) => {
      myGrowRoom.HeatController.Stop();
      return res.send('Stopping...');
    })

app.use('/api', growRouter);

app.get('/', (req, res) => {
    res.send(`Status is: ${myGrowRoom.HeatController.status}`);
  });

app.listen(port, () => {
    console.log(`Running on port ${port}`);
  });