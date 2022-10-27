const path = require('path');
const dotenv = require('dotenv');
dotenv.config({path: path.join(__dirname, '.env')});

const app = require('./app');

const localhost = '127.0.0.1';
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening http://${localhost}:${port}`);
});