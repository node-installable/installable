// webpack.config.js
var webpack = require('webpack');

module.exports = {
    entry: __dirname + '/src/main.jsx',
    output: {
        filename: 'build.js',
        path: __dirname + '/dist',
    },
    module: {
        loaders: [
          { test: /\.css$/, loader: 'style-loader!css-loader!autoprefixer-loader' },
          { test: /\.(jpg|png|gif)$/, loader: 'file-loader' },
          { test: /\.jsx$/, loader: 'jsx-loader' }
        ],
    },
    plugins: [
        new webpack.optimize.DedupePlugin()
    ]
};
