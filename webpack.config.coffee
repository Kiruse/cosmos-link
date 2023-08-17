path = require 'path'
HtmlWebpackPlugin = require 'html-webpack-plugin'

module.exports =
  entry:
    index: './src/index.coffee'
  output:
    path: path.resolve __dirname, 'public'
    filename: '[name].js'
  module:
    rules: [
      test: /\.coffee$/
      use: 'coffee-loader'
    ,
      test: /\.s[ac]ss$/
      use: [
        'style-loader'
        'css-loader'
        'sass-loader'
      ]
    ,
      test: /\.pug$/
      use: 'pug-loader'
    ]
  plugins: [
    new HtmlWebpackPlugin
      template: './assets/index.pug'
      filename: '[name].html'
  ]
  devServer:
    static:
      directory: path.resolve __dirname, 'assets/public'
    port: 8080
