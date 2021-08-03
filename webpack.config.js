const path = require('path');
const ForkTsCheckerWebpackPlugin = require( 'fork-ts-checker-webpack-plugin' );


module.exports = {
    devtool: 'source-map',
    //mode: 'production',
    mode: 'development',
    entry: './src/app.ts',
    // output bundles (location)
    output: {
        path: path.resolve( __dirname, 'dist' ),
        filename: 'bundle.js',
    },
    // file resolutions
    resolve: {
        extensions: [ '.ts', '.js' ],
    },
    // loaders
    module: {
        rules: [
            {
                test: /\.tsx?/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                    }
                },
                exclude: /node_modules/,
            }
        ]
    },
    // plugins
    plugins: [
        new ForkTsCheckerWebpackPlugin(), // run TSC on a separate thread
    ],
    // set watch mode to `true`
    watch: true
};