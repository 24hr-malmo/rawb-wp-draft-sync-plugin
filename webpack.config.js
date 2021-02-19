require('@babel/polyfill');
const fs = require('fs');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const pluginFileContent = fs.readFileSync('./index.php', 'utf8');
const versionRe = /Version: ([\w\.]+)(\r|\n)/im;
const versionMatch = versionRe.exec(pluginFileContent);

if (!versionMatch) {
    console.error('Version number not found in index.php. Please check webpack.config.js and index.php!');
    process.exit(1);
}

const VERSION = versionMatch[1];

console.log('');
console.log('CREATING VERSION', VERSION);
console.log('');

module.exports = {
    mode: 'development',
    context: path.join(__dirname, './js'),
    entry: {
        'dls-entry' : ['@babel/polyfill', './index.js'],
    },
    resolve: {
        extensions: ['.js']
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                include: [
                    path.resolve(__dirname, './js'),
                ],
                loader: 'babel-loader',
                query: {
                    babelrc: false,
                    presets: [['@babel/preset-env', {
                        'modules': false,
                        'targets': {
                            'browsers': 'last 2 versions, not ie 10'
                        }
                    }]],
                    plugins: [
                        '@babel/plugin-proposal-class-properties', 
                    ]
                }
            },
            {
                test: /\.styl$/,
                loader: 'style-loader!css-loader!postcss-loader!stylus-loader'
            },
            {
                test: /\.css/,
                loader: 'style-loader!css-loader',
            },
        ]
    },
    plugins: [ 
        new CleanWebpackPlugin(),
    ],
    output: {
        filename: `[name]-${VERSION || '0.0.0'}.js`,
        chunkFilename: '[name].bundle.js',
        sourceMapFilename: '[file].map',
        path: path.join(__dirname, './js-dist')
    },
    devtool: 'source-map',
    node: {
        'process': 'mock'
    },
    externals: { },
};
