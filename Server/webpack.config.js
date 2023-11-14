// webpack.config.js
const webpack = require("webpack");
const path = require("path");
const dotEnv = require("dotenv-webpack");
module.exports = {
  mode: "production",
  target: "node",
  entry: "./app.ts", // 入口文件
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    alias: {
      "@": path.resolve("./src"),
    },
    extensions: [".tsx", ".ts", ".js"],
    fallback: {
      path: require.resolve("path-browserify"),
      "mongodb-client-encryption": false,
      aws4: false,
    },
  },
  plugins: [
    new dotEnv(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
  ],
};
