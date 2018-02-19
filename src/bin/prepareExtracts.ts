import MongoClient = require('mongodb');
import { createTimer } from '../utilities/timer';
import ms from 'ms';
import { getArguments } from '../cli/arguments';
import { SentimentExtract, PreparedSentimentExtract, SuggestionWeightMap } from '../interfaces/SentimentExtract';
import { createRemoveRedactedCharacters, normalizeSpaces, createTagExtractWithWeight, filterExtractsWithoutSuggestions } from '../utilities/extracts';
import { WriteStream } from 'fs';
import fs = require('fs');
import mkdirp = require('mkdirp');
import path = require('path');

// Setup timers
const timer = createTimer(Date.now, ms);
const cleanTimer = timer({ long: true });

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

// Remove characters that are not usefull,
// This should be experimented with when training,
// for now we will remove the redaction character '*'

MongoClient.connect(databasePath, async (error, db) => {
    if (error) {
        throw new Error(error.message);
    }

    // Start timer
    cleanTimer.start();

    // Get collection
    const col = await db.collection(collection);
    // Get all extracts
    const extracts: SentimentExtract[] = await col.find({}).toArray();
    // Create redaction removal function
    const removeRedactedChars = createRemoveRedactedCharacters();
    // Create tag function with weight map
    const tagExtract = createTagExtractWithWeight({
        'positive': 4,
        'neutral': 2,
        'negative': 3,
        'not_sure': 1,
        'impossible': 0
    });

    const prepared: PreparedSentimentExtract[] = extracts
        .filter(filterExtractsWithoutSuggestions)
        .map(removeRedactedChars)
        .map(normalizeSpaces)
        .map(tagExtract);

    // A place to report on suggestion tag stats
    const tagStatistics: SuggestionWeightMap = {
        'positive': 0,
        'neutral': 0,
        'negative': 0,
        'not_sure': 0,
        'impossible': 0
    };

    let writeCount: number = 0;
    const preparedTotal: number = prepared.length;

    prepared.forEach((e: PreparedSentimentExtract, i: number) => {
        const extractPath: string = `./tmp/${e.tag}`;

        // update stats
        tagStatistics[e.tag]++;

        mkdirp(extractPath, (err) => {
            if (err) {
                throw new Error(err.message);
            }

            fs.writeFile(path.join(extractPath, `${i}.txt`), e.text, (err) => {
                if (err) {
                    throw new Error(err.message);
                }

                writeCount++;

                if (writeCount === preparedTotal) {
                    console.log(`Wrote ${writeCount} extracts`);
                }
            });
        });
    });

    // Print stats
    process.stdout.write(
        JSON.stringify(tagStatistics, null, 2) + '\n'
    );

    // write tag files for each batch
    db.close();
});

