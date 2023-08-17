path = require 'path'
PugPlugin = require 'pug-plugin'

ASSETSPATH = path.resolve __dirname, 'assets'
VIEWPATH   = path.resolve __dirname, 'views'
JSPATH     = path.resolve __dirname, 'src'

module.exports =
  entry:
    index: path.resolve VIEWPATH, 'index.pug'
  resolve:
    extensions: ['.coffee', '.js', '.pug', '.sass', '.scss']
    alias:
      '~assets': ASSETSPATH
      '~style': path.resolve ASSETSPATH, 'styles'
      '~js': JSPATH
      '~view': VIEWPATH
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
        'css-loader'
        'sass-loader'
      ]
    ,
      test: /\.pug$/
      use: PugPlugin.loader
    ,
      test: /\.(png|svg|jpg|gif)$/
      use: 'file-loader'
    ]
  plugins: [
    new PugPlugin
      js:
        filename: 'assets/js/[name].js'
      css:
        filename: 'assets/styles/[name].css'
  ]
