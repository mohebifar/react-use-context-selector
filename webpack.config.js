const path = require('path');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          // disable ts checker - will run it in fork plugin leater
          transpileOnly: true
        }
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'index.js',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'build/main')
  },
  externals: {
    react: 'commonjs react'
  }
};
