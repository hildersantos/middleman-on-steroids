var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require("path");

var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEVELOPMENT || false)),
  __PROD__: JSON.stringify(JSON.parse(process.env.BUILD_PRODUCTION || false))
});

module.exports = {
  entry: {
    all: [
      './source/javascripts/all.js',
      './source/stylesheets/all.scss'
    ]
  },
  resolve: {
    modules: [
      path.join(__dirname, 'source/javascripts'),
      "node_modules"
    ]
  },
  output: {
    path: __dirname + '/.tmp/dist',
    filename: 'javascripts/[name].js'
  },
  module: {
    rules: [
      {
        test: /source\/javascripts\/.*\.js$/,
        exclude: /(node_modules|\.tmp|vendor|bower_components)/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                'env',
                'stage-0'
              ]
            }
          }
        ]
      },
      {
        test: /.*\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            "css-loader",
            "postcss-loader",
            {
              loader: "sass-loader",
              options: {
                sourceMaps: true,
                includePaths: [
                  path.join(__dirname, "/node_modules/normalize.css"),
                  path.join(__dirname, "/node_modules/sass-mq")
                ]
              }
            }
            
          ]
        })
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader"
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 30000,
              name: "fonts/[name]-[hash].[ext]"
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 30000,
              name: "images/[name]-[hash].[ext]"
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new ExtractTextPlugin('stylesheets/[name].css', {
      publicPath: "/stylesheets/",
      allChunks: true
    })
  ]
}
