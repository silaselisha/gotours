const mongoose = require('mongoose');

const password = process.env.DATABASE_PASSWORD;
const database = process.env.DATABASE_URI.replace('<password>', password);

const databaseConnector = () => {

    mongoose.connect(database).then((connect) => {
        console.log('Database connection succesfully established...');
    }).catch(() => {
        console.log('Database connection unsuccessfully established..!');
    });  
}

module.exports = databaseConnector;