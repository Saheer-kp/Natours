const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('./../../models/tourModel');
const User = require('../../models/userModal');
const Review = require('../../models/reviewModel');

dotenv.config({
    path: './config.env'
})


const db = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);

mongoose.connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(con => console.log('connection success'));


const importData = async () => {
    try {
        const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
        const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
        const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));
        await Tour.create(tours);
        await User.create(users, { validateBeforeSave: false });
        await Review.create(reviews);
    console.log('successfully imported');
    } catch (error) {
        console.log(error); 
    }
    process.exit();
    
}

const deleteData = async () => {
    try {
      await Tour.deleteMany();
      await User.deleteMany();
      await Review.deleteMany();
      console.log('successfully truncated');
    } catch (error) {
        console.log(error);
    }
    process.exit();
    
}

if(process.argv[2] == '--import')
    importData();

if(process.argv[2] == '--delete')
    deleteData();
