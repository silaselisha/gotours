const fs = require('fs');
const path = require('path');

const dotenv = require('dotenv');
dotenv.config({path: path.join(__dirname, '../', '.env')});

const mongoose = require('mongoose');

const Tour = require('../models/tour-model');

const password = process.env.DATABASE_PASSWORD;
const database = process.env.DATABASE_URI.replace('<password>', password);

const seed = async () => {
    try {
        const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../', 'dev-data', 'tours.json'), 'utf-8'));

        await Tour.create(data); 
        console.log('Data successfully uploaded...')
    } catch (err) {
        console.log(err.message)
    }
    process.exit(1);
}

const unseed = async () => {
    try {
        await Tour.deleteMany({});
        console.log('Data successfully deleted...')
    } catch (err) {
        console.log(err.message);
    }
    process.exit(1);
}

if(process.argv[2] === '--seed' || process.argv[2] === '-s') {
    seed();
} else if (process.argv[2] === '--delete' || process.argv[2] === '-d') {
    unseed();
}

mongoose.connect(database).then((connect) => {
    console.log('Database connection succesfully established...');
}).catch(() => {
    console.log('Database connection unsuccessfully established..!');
});
