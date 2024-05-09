

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');


const app = express();


app.use(bodyParser.json());
app.use(cors())

connectDB();


const user = require('./routes/user')
app.use('/api/v1', user);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
app.get('/', (req, res) => {
    res.send('This is HOME page');
  });