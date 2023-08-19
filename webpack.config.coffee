path = require 'path'
HtmlWebpackPlugin = require 'html-webpack-plugin'
{VueLoaderPlugin} = require 'vue-loader'

ASSETSPATH     = path.resolve __dirname, 'assets'
VIEWPATH       = path.resolve __dirname, 'views'
LIBPATH        = path.resolve __dirname, 'lib'
COMPONENTSPATH = path.resolve __dirname, 'components'

module.exports =
  entry:
    index: path.resolve ASSETSPATH, 'app.coffee'
  resolve:
    extensions: [
      '.coffee', '.js', '.pug', '.sass', '.scss', '.vue',
      '.png', '.svg', '.jpg', '.gif',
    ]
    alias:
      vue: 'vue/dist/vue.cjs.js'
      '@/assets': ASSETSPATH
      '@/style': path.resolve ASSETSPATH, 'styles'
      '@/lib': LIBPATH
      '@/view': VIEWPATH
      '@/comp': COMPONENTSPATH
      '@/store': path.resolve __dirname, 'stores'
  output:
    path: path.resolve __dirname, 'public'
    filename: '[name].js'
  module:
    rules: [
      test: /\.coffee$/
      use: 'coffee-loader'
    ,
      test: /\.sass$/
      use: [
        'vue-style-loader',
        'css-loader',
          loader: 'sass-loader'
          options:
            sassOptions:
              indentedSyntax: true
      ]
    ,
      test: /\.pug$/
      oneOf: [
        resourceQuery: /^\?vue/
        use: 'vue-pug-loader'
      ,
        use: ['raw-loader', 'pug-html-loader']
      ]
    ,
      test: /\.vue$/
      use: 'vue-loader'
    ,
      test: /\.(png|svg|jpg|gif)$/
      use: 'file-loader'
    ]
  plugins: [
    new VueLoaderPlugin()
    new HtmlWebpackPlugin
      template: path.resolve ASSETSPATH, 'app.pug'
      filename: '[name].html'
  ]
