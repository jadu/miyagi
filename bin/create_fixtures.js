const { MongoClient } = require('mongodb');
const winston = require('winston');
const { fixtures } = require('../dist/fixtures/fixtures');

const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/sentiment';

MongoClient.connect(DB_URL, (error, db) => {
    if (error) {
        winston.error(error.message);
        process.exit(1);
    } else {
        const collection = db.collection('extracts');
        winston.info(`Connected to database "${DB_URL}"`);
        collection.deleteMany();
        collection.insertMany(fixtures);
        winston.info(`Inserted ${fixtures.length} fixtures into "extracts"`);
        db.close();
    }   
});

