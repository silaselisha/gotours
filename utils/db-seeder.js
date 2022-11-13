const fs = require('fs');
const path = require('path');

const dotenv = require('dotenv');
dotenv.config({path: path.join(__dirname, '../', '.env')});

const mongoose = require('mongoose');

const Tour = require('../models/tour-model');
const User = require('../models/user-modle');
const Review = require('../models/review-model');

const password = process.env.DATABASE_PASSWORD;
const database = process.env.DATABASE_URI.replace('<password>', password);

const seed = async () => {
    try {
        const tours_data = JSON.parse(fs.readFileSync(path.join(__dirname, '../', 'dev-data', 'tours.json'), 'utf-8'));

        const users_data = JSON.parse(fs.readFileSync(path.join(__dirname, '../', 'dev-data', 'users.json'), 'utf-8'));

        const reviews_data = JSON.parse(fs.readFileSync(path.join(__dirname, '../', 'dev-data', 'reviews.json'), 'utf-8'));

        await Tour.create(tours_data); 
        await User.create(users_data);
        await Review.create(reviews_data);
        console.log('Data successfully uploaded...')
    } catch (err) {
        console.log(err.message)
    }
    process.exit(1);
}

const unseed = async () => {
    try {
        await Tour.deleteMany({});
        await User.deleteMany({});
        await Review.deleteMany({});
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

mongoose.connect(database).then(() => {
    console.log('Database connection succesfully established...');
}).catch(() => {
    console.log('Database connection unsuccessfully established..!');
});

