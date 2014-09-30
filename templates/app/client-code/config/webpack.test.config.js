// webpack.config.js
var webpack = require('webpack');

module.exports = {
    cache: true,
    module: {
        loaders: [
            {test: /\.less$/, loader: 'style-loader!css-loader!autoprefixer-loader!less-loader'},
            {test: /\.css$/, loader: 'style-loader!css-loader!autoprefixer-loader!'},
            {test: /\.(jpg|png|gif)$/, loader: 'file-loader'}
        ],
        postLoaders: [{
            test: /\.js$/,
            exclude: /(spec|node_modules|bower_components)\//,
            loader: 'istanbul-instrumenter'
        }]
    },
    plugins: [
        new webpack.optimize.DedupePlugin()
    ]
};
