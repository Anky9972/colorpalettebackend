
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const fileUpload = require('express-fileupload');
const app = express();


app.use(bodyParser.json());
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'converted' directory
app.use('/converted', express.static(path.join(__dirname, 'converted')));

// Middleware for handling file uploads (use multer if you need more control)
app.use(fileUpload());
connectDB();


const user = require('./routes/user')
app.use('/api/v1', user);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
app.get('/', (req, res) => {
    res.send('This is HOME page');
  });