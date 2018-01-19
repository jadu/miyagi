[![Build Status](https://travis-ci.org/jadu/miyagi.svg?branch=master)](https://travis-ci.org/jadu/miyagi)

# Miyagi

A sentiment analysis application for generating crowd sourced training material.

![Miyagi](assets/gif/miyagi.gif)

## Development

Start database service.

```
mongod --dbpath data/db
```

Start web application.

```
npm run start:client
```

Start API server.

```
npm run start:server
```

Build for production.

```
npm run build
```

Backup datatbase

```
npm run backup
```
