const express = require('express');
const growroom = require('./models/GrowRoom');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

const growRouter = require('./routes/grow');
const configRouter = require('./routes/roomConfig');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/api/grow', growRouter);
app.use('/api/config', configRouter);

app.get('/', (req, res) => {
    res.send('Welcome to Scooby Grew!');
  });

app.listen(port, () => {
    console.log(`Running on port ${port}`);
  });