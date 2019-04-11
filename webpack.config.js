require('@babel/polyfill');

const path = require('path');

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
    plugins: [ ],
    output: {
        filename: `[name]-${process.env.VERSION || '0.0.0'}.js`,
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
