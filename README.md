[![Build Status](https://travis-ci.org/jadu/miyagi.svg?branch=master)](https://travis-ci.org/jadu/miyagi)

# Miyagi

A sentiment analysis application for generating crowd sourced training material.

![Miyagi](assets/gif/miyagi.gif)

# Development

[Install Monogdb](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/).

```
brew install mongodb
```

Install dependencies.

```
npm install
```

Start database service.

```
mongod --dbpath data/db
```

Start web application.

```
npm run watch:client
```

Start API server.

```
npm run watch:server
```

Build for production.

```
npm run build
```

Backup datatbase

```
npm run backup
```

# Commands

In order to use the Miyagi commands, they first need to be built from source. Run the following command prior to use:

```
npm run build:commands
```

---

__Create Fixtures__

Insert a JSON export file into a MongoDB database collection. The schema for the export file should be:

```
[
    "foo",
    "bar",
    "baz"
]
```

Pre-made export files useful for development environments are available in `./fixtures`.

_Arguments_

* `file` (required) - Path to JSON file
* `database_host` (optional, default: `mongodb://localhost:27017`) - database host URL
* `database` (optional, default: `sentiment`) - database name
* `collection` (optional, default: `extracts`) - the collection name

_Example_

```
node bin/create_fixtures.js --file fixtures/dev_extracts.json --collection dev_extracts
```

---

__Redact Collection__

Redact extracts saved in a MongoDB database. Redaction is taken care of by the [redact-pii](https://github.com/solvvy/redact-pii) package.

_Arguments_

* `database_host` (optional, default: `mongodb://localhost:27017`) - database host URL
* `database` (optional, default: `sentiment`) - database name
* `collection` (optional, default: `extracts`) - the collection name

_Example_

```
node bin/redact_extracts.js --collection dev_extracts
```


