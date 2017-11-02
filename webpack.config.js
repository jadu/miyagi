const path = require('path');
const Html = require('webpack-html-plugin');

module.exports = (env = {}) => {
    const config = {
        'web': {
            entry: path.join(__dirname, 'src/index.js'),
            output: {
                path: path.join(__dirname, 'dist/www'),
                filename: 'client.bundle.js',
                publicPath: '/'
            },
            module: {
                rules: [
                    { test: /\.js?$/, loader: 'babel-loader', exclude: /node_modules/ },
                    {
                        test: /\.scss$/,
                        use: [
                            { loader: 'style-loader' },
                            { loader: 'css-loader' },
                            { loader: 'postcss-loader', options: {
                                ident: 'postcss',
                                plugins: (loader) => [ require('autoprefixer')() ]
                            } },
                            { loader: 'sass-loader' }
                        ]
                    },
                    { test: /\.png?$/, loader: 'file-loader' }
                ]
            },
            plugins: [
                new Html({
                    template: path.join(__dirname, 'src/index.html'),
                    filename: 'index.html',
                    inject: 'body'
                })
            ],
            devtool: 'source-map',
            devServer: {
                historyApiFallback: true,
                proxy: {
                    '/miyapi': 'http://localhost:4567'
                }
            }
        },
        'node': {
            entry: path.join(__dirname, 'src/server/server.ts'),
            output: {
                path: path.join(__dirname, 'dist'),
                filename: 'server.bundle.js',
            },
            target: 'node',
            module: {
                rules: [
                    { test: /\.ts?$/, use: 'ts-loader', exclude: /(node_modules|tests)/ },
                    { test: /\.js?$/, loader: 'babel-loader', exclude: /node_modules/ },
                    { test: /\.js?$/, use: 'source-map-loader', enforce: 'pre' }
                ]
            }
        }
    }

    if (!config[env.platform]) {
        console.log(`Please specify a platform (--env.platform={}) from the following: [${Object.keys(config).join(', ')}]`);
        process.exit(0);
    } else {
        return config[env.platform];
    }
}
