const { MongoClient, ObjectId } = require('mongodb');
const winston = require('winston');
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/sentiment';

MongoClient.connect(DB_URL, async (error, db) => {
    if (error) {
        winston.error(error.message);
        process.exit(0);
    }

    const collection = db.collection('extracts');
    const extractsWithSuggestions = await collection.find().toArray();
    const newExtractDocs = extractsWithSuggestions.map(suggestion => {
        const newSuggestion = Object.assign({}, suggestion);

        newSuggestion.has_suggestion = newSuggestion.suggestions.length > 0;
        return newSuggestion;
    });

    for (const extract of newExtractDocs) {
        await collection.update({ _id: ObjectId(extract._id) }, extract);
    }

    process.exit(0);
});
