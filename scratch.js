const winston = require('winston');

const logger = new (winston.Logger({
    level: 'info',
    transports: [
        
    ]
});

winston.log('info', 'WOLO')
logger.log('info', 'YOLO');