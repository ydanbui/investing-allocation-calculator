const path = require('path')

module.exports = {
    entry: {
        index: './src/scripts/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'public/scripts') ,
        filename: '[name]-bundle.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }]
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'public'),
        publicPath: '/scripts/',
        watchContentBase: true,
        port: 9090
    },
    devtool: 'source-map'
}