const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    index: path.resolve(__dirname, '../src/page/index.tsx'),
    login: path.resolve(__dirname, '../src/page/login.tsx'),
    error: path.resolve(__dirname, '../src/page/error.tsx')
  },
  mode: 'development',
  resolve: { extensions: ['.tsx', '.js', '.ts'] },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.s(a|c)ss/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.jsx$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    node: '10'
                  }
                }
              ],
              '@babel/preset-react'
            ]
          }
        }
      }
    ]
  },
  plugins: [new CleanWebpackPlugin()],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../../server/static/js')
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
};
