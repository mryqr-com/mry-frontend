const path = require('path');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const baseWebpackConfig = require('./webpack.base.conf');

const webpackConfig = merge(baseWebpackConfig, {
    mode: 'production',
    devtool: 'source-map',
    output: {
        filename: '[name].[contenthash].js',
        chunkFilename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },

    module: {
        rules: [
            {
                test: /\.(s*)css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                ]
            },

            {
                test: /\.(s*)css$/,
                oneOf: [
                    {
                        resourceQuery: /module/,
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: true,
                                    importLoaders: 2,
                                    modules: {
                                        localIdentName: "[name]---[local]---[hash:base64:5]",
                                    },
                                }
                            }]
                    }, {
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: true,
                                    importLoaders: 2,
                                }
                            }]
                    }
                ]

            },
            {
                test: /\.(s*)css$/,
                use: [
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [require("autoprefixer")],
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            prependData: '@import "./src/common/styles/_variables.scss";'
                        }
                    }
                ]
            }
        ]
    },
    optimization: {
        moduleIds: 'hashed',
        runtimeChunk: 'multiple',
        splitChunks: {
            chunks: 'all'
        },
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css",
            chunkFilename: "[name].[contenthash].css"
        })
    ]
});

//View the merged webpack config:
// console.log(JSON.stringify(webpackConfig));

module.exports = webpackConfig;

