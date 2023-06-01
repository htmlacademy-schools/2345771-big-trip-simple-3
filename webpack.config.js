// path — встроенный в Node.js модуль
const path = require('path')
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  // Указываем путь до входной точки:
  entry: './src/main.js',
  // Описываем, куда следует поместить результат работы:
  output: {
    // Путь до директории (важно использовать path.resolve):
    path: path.resolve(__dirname, 'build'),
    // Имя файла со сборкой:
    filename: 'bundle.js',
    // очистка директории перед повторной сборкой
    clean: true
  },
  //генерация source-maps
  devtool: 'source-map',
  //плагин копирования файлов
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'public' }],
    }),
  ],
  //лоадер
  module: {
    rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: ['babel-loader']
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader']
        }
    ]
  }
}
