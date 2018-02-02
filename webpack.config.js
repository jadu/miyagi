const path = require('path');
const Html = require('webpack-html-plugin');
const webpack = require('webpack');
const glob = require('glob');
const commands = glob.sync('./src/bin/**/*.ts');

/**
 * Convert camelCase to snake_case
 * @param {*} str
 */
function camelToSnake (str) {
    return str.replace(/[A-Z]/g, (hump) => {
        return `_${hump.toLowerCase()}`;
    });
}

module.exports = (env = {}) => {
    const config = {
        'web': {
            entry: path.join(__dirname, 'src/index.tsx'),
            output: {
                path: path.join(__dirname, 'dist/www'),
                filename: 'client.bundle.js',
                publicPath: '/'
            },
            resolve: {
                extensions: [".ts", ".tsx", ".js", ".json"]
            },
            module: {
                rules: [
                    { test: /\.tsx?$/, use: 'awesome-typescript-loader', exclude: /(node_modules|tests)/ },
                    { test: /\.js?$/, use: 'source-map-loader', enforce: 'pre' },
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
            entry: path.join(__dirname, 'src/server/api.ts'),
            output: {
                path: path.join(__dirname, 'dist'),
                filename: 'api.bundle.js',
            },
            resolve: {
                extensions: [".ts", ".tsx", ".js", ".json"]
            },
            target: 'node',
            module: {
                rules: [
                    { test: /\.ts?$/, use: 'awesome-typescript-loader', exclude: /(node_modules|tests)/ },
                    { test: /\.js?$/, use: 'source-map-loader', enforce: 'pre' },
                    { test: /\.js?$/, use: 'source-map-loader', enforce: 'pre' }
                ]
            }
        },
        'bin': {
            entry: () => {
                return commands.reduce((entries, command) => {
                    const commandFileName = path.basename(command, path.extname(command));

                    entries[camelToSnake(commandFileName)] = command;
                    return entries;
                }, {});
            },
            output: {
                path: path.join(__dirname, 'bin'),
                filename: '[name].js'
            },
            resolve: {
                extensions: [".ts", ".tsx", ".js", ".json"]
            },
            target: 'node',
            stats: 'errors-only',
            module: {
                rules: [
                    { test: /\.ts?$/, use: 'awesome-typescript-loader', exclude: /(node_modules|tests)/ },
                    { test: /\.js?$/, use: 'source-map-loader', enforce: 'pre' },
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
