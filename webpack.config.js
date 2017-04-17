const path = require('path');

module.exports = {
  entry: path.join(__dirname, "src/main"),
  output: {
    filename: "./bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.glsl$/,
        loader: "webpack-glsl"
      },
      {
        test: /\.json$/,
        loader: "json"
      }
    ]
  },
  devtool: 'source-map',
  devServer: {
    port: 7000
  },
  resolve : {
    root : __dirname,
    moduleDirectories : ["node_modules/tonal"]
  }
}