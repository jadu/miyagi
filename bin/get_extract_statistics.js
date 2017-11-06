const { MongoClient, ObjectId } = require('mongodb');
const winston = require('winston');
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/sentiment';

MongoClient.connect(DB_URL, async (error, db) => {
    if (error) {
        winston.error(error.message);
        process.exit(0);
    }

    const collection = db.collection('extracts');
    const extractsWithSuggestions = await collection.find({ has_suggestion: true }).toArray();
    const extractsWithoutSuggestions = await collection.find({ has_suggestion: false }).toArray();
    const users = extractsWithSuggestions.reduce((userObj, extract) => {
        extract.suggestions.forEach(suggestion => {
            if (!userObj.hasOwnProperty(suggestion.user_id)) {
                userObj[suggestion.user_id] = 0;
            } else {
                userObj[suggestion.user_id] += 1;
            }
        })
        return userObj;
    }, {});
    const sortableUsers = Object.keys(users).map(user => {
        return [ user, users[user] ];
    }).sort((a, b) => b[1] - a[1]);

    const totalUserSuggestions = sortableUsers.reduce((suggestions, user) => {
        return suggestions += user[1];
    }, 0);

    console.log(`${extractsWithSuggestions.length}/${extractsWithSuggestions.length + extractsWithoutSuggestions.length} extracts completed`);
    console.log(`${totalUserSuggestions} user suggestions`);
    console.log(`Top 3 users: ${sortableUsers.slice(0, 3).join(' ')}`);
    db.close();
    process.exit(0);
});
