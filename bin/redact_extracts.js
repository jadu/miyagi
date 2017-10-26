const mongo = require('mongodb');
const redactor = require('redact-pii')({
    salutation: false,
    replace: function () {
        return value => value.replace(/./g, '*');
    }
});

function options (args) {
    return args.reduce((options, arg) => {
        if (arg.indexOf('--') === 0) {
            options[arg.split('--').pop()] = [];
        } else {
            options[Object.keys(options).pop()].push(arg);
        }

        return options;
    }, {});
}

const { db } = options(process.argv.splice(2));

if (!db) {
    process.stdout.write('The --db argument is required, this is the URL to the mongo database instance\n');
    process.exit(0);
}

mongo.connect(db[0], async (error, database) => {
    if (error) {
        process.stdout.write(`Could not connect to "${db[0]}"\n`);
        process.exit(0);
    }

    const collection = await database.collection('extracts');
    const extracts = await collection.find().toArray();
    let redactions = 0;

    for (const extract of extracts) {
        await collection.findOneAndUpdate(
            { _id: extract._id },
            Object.assign(extract, {
                text: redactor.redact(extract.text)
            })
        );
        redactions++;
    }

    process.stdout.write(`Passed ${redactions} through the redactor\n`);
    database.close();
    process.exit(0);
});

