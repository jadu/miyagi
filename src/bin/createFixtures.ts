import ms = require('ms');
import { createTimer } from '../utilities/timer';
import { getArguments, validateArguments } from '../cli/arguments';
import Arguments from '../interfaces/Arguments';
import MongoClient = require('mongodb');
import path = require('path');
import readline = require('readline');
import { question } from '../cli/readline';
import makeSource = require('stream-json');
import fs = require('fs');

// Setup timers
const timer = createTimer(Date.now, ms);
const recordTimer = timer({ long: true });

// Create rl interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Default arguments
const defaultArgs: Arguments = {
    database_host: 'mongodb://localhost:27017',
    database: 'sentiment',
    collection: 'extracts'
};

// Get arguments
const { file, database_host, database, collection }: Arguments = Object.assign(
    {},
    defaultArgs,
    validateArguments('file', getArguments(process.argv))
);

// Build connection string for Mongo
const databasePath = `${database_host}/${database}`;

MongoClient.connect(databasePath, async (error, db) => {
    if (error) {
        throw new Error(error.message);
    }

    // Start timer
    recordTimer.start();

    // Get / Set collection
    const col = await db.collection(collection);

    // Drop collection
    const sure = await question(rl, `Are you sure you want to delete the contents of "${collection}" in the database "${databasePath}"? (y/n): `);

    switch (sure) {
        case 'y':
            await col.deleteMany({});
            process.stdout.write(`Removed documents from "${collection}"`);
            break;
        case 'n':
        default:
            readline.cursorTo(process.stdout, 0);
            process.stdout.write('Collection not deleted. Exiting process.\n');
            process.exit(0);
    }

    // Setup streaming
    const JSONStream = makeSource() as any;
    // Store insertion promises
    const insertions: Promise<any>[] = [];
    // Pipe read stream to JSONStreamer
    fs.createReadStream(file).pipe(JSONStream.input);

    JSONStream.on('error', (error) => {
        throw new Error(error.message);
    });

    JSONStream.on('stringValue', async (value: string) => {
        // Add value to collection
        insertions.push(col.insertOne({
            text: value,
            suggestions: [],
            has_suggestion: false
        }));
    });

    // Stream ended
    JSONStream.on('end', async () => {
        // Wait for db insertions to finish
        await Promise.all(insertions);
        // Close db connection
        await db.close();
        // End timer
        recordTimer.end();
        // Print summary
        process.stdout.write('\n');
        process.stdout.write(`${insertions.length} extracts successfully inserted into "${databasePath}" in the "${collection}" collection (${recordTimer.print()})\n`);
        // Exit
        process.exit(0);
    });
});




