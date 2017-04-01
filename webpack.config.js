var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var cssnext = require('postcss-cssnext'),
    lost = require('lost'),
    fontmagician = require('postcss-font-magician');

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
    root: __dirname + '/source/javascripts'
  },
  output: {
    path: __dirname + '/.tmp/dist',
    filename: 'javascripts/[name].js'
  },
  module: {
    loaders: [
      {
        test: /source\/javascripts\/.*\.js$/,
        exclude: /(node_modules|\.tmp|vendor|bower_components)/,
        loader: 'babel',
        query: {
          presets: [
            'es2015',
            'stage-0'
          ]
        }
      },
      {
        test: /.*\.scss$/,
        loader: ExtractTextPlugin.extract(
          "style",
          "css!postcss!sass?sourceMaps&includePaths[]=" + __dirname + "/node_modules/normalize.css&includePaths[]=" + __dirname + "/node_modules/sass-mq"
        )
      },
      {
        test: /\.css$/,
        loader: "style!css"
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'url-loader?limit=30000&name=fonts/[name]-[hash].[ext]'
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader?limit=30000&name=images/[name]-[hash].[ext]'
      }
    ]
  },
  postcss: function() {
    return [
      cssnext,
      lost,
      fontmagician
    ];
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
