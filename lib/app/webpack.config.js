// webpack.config.js
module.exports = {
    entry: __dirname + '/src/main.jsx',
    output: {
        filename: 'build.js',
        path: __dirname + '/build',
    },
    module: {
        loaders: [
          { test: /\.css$/, loader: 'style-loader!css-loader' },
          { test: /\.(jpg|png|gif)$/, loader: 'file-loader' },
          { test: /\.jsx$/, loader: 'jsx-loader' }
        ],
    }
};
