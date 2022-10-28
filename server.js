process.on('uncaughtException', (err) => {
    console.log('Uncaught exception', err);
    process.exit(1);
});

const path = require('path');
const dotenv = require('dotenv');
dotenv.config({path: path.join(__dirname, '.env')});

const app = require('./app');

const databaseConnector = require('./database');

const localhost = '127.0.0.1';
const port = process.env.PORT || 3000;


const server = app.listen(port, () => {
    console.log(`Listening http://${localhost}:${port}`);
    databaseConnector()
});

process.on('unhandledRejection', (err) => {
    console.log('Unhandled rejection', err);
    server.close(() => {
        process.exit(1);
    });
});
