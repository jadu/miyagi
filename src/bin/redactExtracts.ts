import MongoClient = require('mongodb');
import redactorPii = require('redact-pii');
import { validateArguments, getArguments } from '../cli/arguments';
import { error } from 'util';
import { createTimer } from '../utilities/timer';
import ms = require('ms');
import { SentimentExtract } from '../interfaces/SentimentExtract';
import { question } from '../cli/readline';
import readline = require('readline');

// Setup timers
const timer = createTimer(Date.now, ms);
const recordTimer = timer({ long: true });

// Create rl interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Create redactor
const redactor = redactorPii({
    salutation: false,
    replace: function () {
        return value => value.replace(/./g, '*');
    }
});

// Default arguments
const defaultArguments = {
    database_host: 'mongodb://localhost:27017',
    database: 'sentiment',
    collection: 'extracts'
};

// Build arguments
const { database_host, database, collection } = Object.assign(
    {},
    defaultArguments,
    getArguments(process.argv)
);

const databasePath = `${database_host}/${database}`;

MongoClient.connect(databasePath, async (error, db) => {
    if (error) {
        throw new Error(error.message);
    }

    // Start timer
    recordTimer.start();

    const col = await db.collection(collection);
    const extracts = await col.find({}).toArray();
    const redactions: Promise<any>[] = [];
    const sure = await question(rl, `Are you sure you want to redact the contents of "${collection}" (${extracts.length}) in the database "${databasePath}"? (y/n): `);

    switch (sure) {
        case 'y':
            extracts.forEach((extract: SentimentExtract) => {
                redactions.push(col.findOneAndUpdate(
                    { _id: extract._id },
                    Object.assign({}, extract, {
                        text: redactor.redact(extract.text)
                    })
                ));
            });
            break;
        case 'n':
        default:
            readline.cursorTo(process.stdout, 0);
            process.stdout.write('Collection not redacted. Exiting process.\n');
            process.exit(0);
    }

    // Wait for redaction updates
    await Promise.all(redactions).catch((error) => {
        throw new Error(error.message);
    });

    // Close database
    await db.close();

    // Stop timer
    recordTimer.end();

    // Print summary
    process.stdout.write(`${extracts.length} extracts successfully redacted in "${databasePath}" from the "${collection}" collection (${recordTimer.print()})\n`);

    // Exit
    process.exit(0);
});
