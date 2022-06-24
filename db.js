// getting-started.js
const mongoose = require('mongoose');
const mongoUri = 'mongodb://0.0.0.0:27017/demoApps?readPreference=primary&directConnection=true&ssl=false'
mongoose.set('debug', true);
const connectToMongo = async () => {
    await mongoose.connect(mongoUri, { useUnifiedTopology: true, useNewUrlParser: true}, () => {
        console.log("connected to mongodb successfully");
    });
}

module.exports = connectToMongo;