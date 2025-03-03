const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('./../../models/tourModel');

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
        const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));
        await Tour.create(tours);
    console.log('successfully imported');
    } catch (error) {
        console.log(error); 
    }
    process.exit();
    
}

const deleteData = async () => {
    try {
      await Tour.deleteMany();
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
