const path = require('path');

module.exports = {
    entry: path.join(__dirname, 'src/server/server.ts'),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'server.bundle.js',
    },
    target: 'node',
    module: {
        rules: [
            { test: /\.ts?$/, use: 'ts-loader', exclude: /(node_modules|tests)/ },
            { test: /\.js?$/, use: 'source-map-loader', enforce: 'pre' }
        ]
    }
}
