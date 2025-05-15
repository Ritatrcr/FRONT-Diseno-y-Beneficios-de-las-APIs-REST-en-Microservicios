const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js', // Archivo de entrada principal
  output: {
    filename: 'bundle.js', // Nombre del archivo de salida
    path: path.resolve(__dirname, 'dist'), // Carpeta de salida
    clean: true, // Limpia /dist antes de cada build
    publicPath: '/', // Para que funcione bien con react-router-dom
  },
  mode: 'development', // Cambia a 'production' para producción
  resolve: {
    extensions: ['.js', '.jsx'], // Para importar sin extensiones
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Transpilar JS y JSX
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/, // Soporte para CSS
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i, // Carga de imágenes
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // Tu HTML base
      filename: 'index.html',
    }),
  ],
  devtool: 'inline-source-map', // Para debugging
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    historyApiFallback: true, // Necesario para React Router
    port: 3000, // Cambia si lo necesitas
    open: true, // Abre el navegador automáticamente
    hot: true, // HMR
  },
};
