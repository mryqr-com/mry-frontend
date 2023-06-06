const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    entry: {
        'console': './src/console/console-index.js',
        'client': './src/client/client-index.js'
    },

    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': path.resolve(__dirname, 'src')
        }
    },

    module: {
        rules: [
            {
                test: /\.(js)$/,
                loader: "eslint-loader",
                enforce: "pre",
                include: [path.resolve(__dirname, 'src')],
                exclude: [path.resolve(__dirname, 'node_modules')]
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [path.resolve(__dirname, 'src')],
                exclude: [path.resolve(__dirname, 'node_modules')]
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 20000,
                    name: '[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 20000,
                    name: '[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 20000,
                    name: '[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.md$/i,
                use: 'raw-loader',
            },
            {
                test: /\.(xlsx|xls|doc|docx)(\?.*)?$/,
                use: 'file-loader',
            },
        ]
    },
    plugins: [
        // new BundleAnalyzerPlugin(),
        new CleanWebpackPlugin(),
        new VueLoaderPlugin(),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, 'src/common/static'),
                to: path.resolve(__dirname, 'dist')
            }
        ]),
        new HtmlWebpackPlugin({
            chunks: ['console'],
            template: './src/console/console-index.html',
            filename: 'console-index.html'
        }),
        new HtmlWebpackPlugin({
            chunks: ['client'],
            template: './src/client/client-index.html',
            filename: 'client-index.html'
        })
    ]

};
