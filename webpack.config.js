const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const Autoprefixer = require('autoprefixer');
const SpritesmithPlugin = require('webpack-spritesmith');
var templateFunction = function (data) {
    var shared = '.ico { background-image: url(I) }'
        .replace('I', data.sprites[0].image);

    var perSprite = data.sprites.map(function (sprite) {
        return '.ico-N { width: Wpx; height: Hpx; background-position: Xpx Ypx; }'
            .replace('N', sprite.name)
            .replace('W', sprite.width)
            .replace('H', sprite.height)
            .replace('X', sprite.offset_x)
            .replace('Y', sprite.offset_y);
    }).join('\n');

    return shared + '\n' + perSprite;
};


module.exports = {
    entry: {main: './src/index.js'},
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: ['style-loader',
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {url: false}
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                Autoprefixer({
                                    browsers: ['ie >= 8', 'last 5 version']
                                })
                            ],
                            sourceMap: true
                        }
                    },
                    'less-loader']
            }
        ]
    },
    resolve: {
        modules: ["node_modules", "spritesmith-generated"]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: '/css/style.css',
        }),
        new HtmlWebpackPlugin({
            inject: false,
            hash: true,
            template: './src/index.html',
            filename: 'index.html'
        }),
        new CopyWebpackPlugin([{
            //     from: './src/fonts',
            //     to: './fonts'
            //   },
            //   {
            //     from: './src/favicon',
            //     to: './favicon'

            //   },
            //   {
            from: './src/img',
            to: './img'
        }
        ]),
        new BrowserSyncPlugin(
            {
                host: 'localhost',
                port: 3000,
                files: ['dist/css/*.css, *.html'],
                server: {baseDir: ['dist']},
                // proxy the Webpack Dev Server endpoint
                // (which should be serving on http://localhost:3100/)
                // through BrowserSync
                // proxy: 'http://localhost:3100/'
            },
            {
                // reload: false
            }
        ),
        new SpritesmithPlugin({
            src: {
                cwd: path.resolve(__dirname, 'src/img/icons'),
                glob: '*.png'
            },
            target: {
                image: path.resolve(__dirname, 'src/img/spritesmith-generated/sprite.png'),
                css: path.resolve(__dirname, 'src/less/spritesmith-generated/sprite.styl')
            },
            apiOptions: {
                cssImageRef: "~sprite.png"
            }
        })
    ]
};
