// webpack.config.js
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
    }
};
