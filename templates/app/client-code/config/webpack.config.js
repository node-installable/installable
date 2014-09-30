// webpack.config.js
var webpack = require('webpack');

module.exports = {
    cache: true,
    entry: __dirname + '/../src/main.js',
    output: {
        filename: 'build.js',
        path: __dirname + '/../dist'
    },
    module: {
        loaders:[
            {test: /\.less$/, loader: 'style-loader!css-loader!autoprefixer-loader!less-loader'},
            {test: /\.css$/, loader: 'style-loader!css-loader!autoprefixer-loader!'},
            {test: /\.(jpg|png|gif)$/, loader: 'file-loader'}
        ]
    },
    plugins:[
        new webpack.optimize.DedupePlugin()
    ]
};
