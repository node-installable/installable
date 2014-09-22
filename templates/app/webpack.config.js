// webpack.config.js
var webpack = require('webpack');

module.exports = {
    entry: __dirname + '/browser/main.js',
    output: {
        filename: 'build.js',
        path: __dirname + '/browser/build',
    },
    module: {
        loaders: [
          { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },
          { test: /\.(jpg|png|gif)$/, loader: 'file-loader' }
        ],
    },
    plugins: [
        new webpack.optimize.DedupePlugin()
    ]
};
