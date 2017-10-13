const { MongoClient } = require('mongodb');
const winston = require('winston');
const makeSource = require('stream-json');
const fs = require('fs');
const path = require('path');
const ms = require('ms');
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/sentiment';
const source = makeSource();

/**
 * Get process arguments
 * @param {Array<string>} args
 */
function options (args) {
    return args.reduce((options, arg) => {
        const test = arg.match(/--([\w\d-_]+)=([\w\d\W]+)/);

        if (test && test[1] && test[2]) {
            options[test[1]] = test[2];
        }

        return options;
    }, {});
}

const { file } = options(process.argv.slice(2));

if (!file) {
    console.log('You must provide a "--file" argument');
    process.exit(0);
}

let extracts = 0;
const START = new Date();

winston.info(`Started at ${START.toString()}`);

MongoClient.connect(DB_URL, (error, db) => {
    if (error) {
        winston.error(error.message);
        process.exit(1);
    } else {
        winston.info(`Connected to database "${DB_URL}"`);

        const collection = db.collection('extracts');

        // drop current collection
        winston.info('Removing existing documents from collection');
        collection.deleteMany();

        fs.createReadStream(path.join(process.cwd(), file)).pipe(source.input);

        source.on('stringValue', (value) => {
            extracts++
            collection.insertOne({ text: value, suggestions: [] });
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            process.stdout.write(`Inserted ${extracts} extracts to the database`);
        });

        source.on('end', () => {
            process.stdout.write('\n');
            winston.info(`${extracts} extracts successfully inserted to the database in ${ms(new Date() - START, { long: true })}`);
            db.close();
        });
    }
});

