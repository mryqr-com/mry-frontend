const merge = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ManifestPlugin = require('webpack-manifest-plugin');
const baseWebpackConfig = require('./webpack.base.conf');

const webpackConfig = merge(baseWebpackConfig, {
    mode: 'development',

    output: {
        filename: '[name].js',
        chunkFilename: '[name].js',
        publicPath: '/'
    },

    devtool: 'inline-source-map',
    devServer: {
        disableHostCheck: true,
        historyApiFallback: true,
        inline: true,//do not use iframe for the page, true is default
        open: 'google chrome',//open browser after dev server starts
        openPage: '',
        port: 80,//80 endpoint
        proxy: {
            '/': {
                target: 'http://localhost:8080',
                bypass: function (req, res, proxyOptions) {
                    if (req.headers.host === 'console.local.mryqr.com') {
                        return '/console-index.html';
                    }

                    if (req.headers.host === 'm.local.mryqr.com') {
                        return '/client-index.html';
                    }
                },
            },
        },
        hot: true,
        host: 'console.local.mryqr.com'
    },
    module: {
        rules: [
            {
                test: /\.(s*)css$/,
                use: [
                    'vue-style-loader',
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

    plugins: [
        new ManifestPlugin(),
        new BundleAnalyzerPlugin({
            openAnalyzer: false,
            analyzerMode: 'static',
            reportFilename: 'bundle-analyzer-report.html'
        })
    ]
});

//View the merged webpack config:
// console.log(JSON.stringify(webpackConfig));

module.exports = webpackConfig;

