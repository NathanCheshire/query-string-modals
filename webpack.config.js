import { resolve as _resolve } from "path";

export const entry = "./src/index.js";
export const output = {
  path: _resolve(__dirname, "dist"),
  filename: "index.ts",
  libraryTarget: "umd",
  globalObject: "this",
};
export const module = {
  rules: [
    {
      test: /\.(ts|tsx)$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader",
      },
    },
    {
      test: /\.css$/,
      use: ["style-loader", "css-loader"],
    },
  ],
};
export const resolve = {
  extensions: [".js", ".jsx", ".ts", ".tsx"],
};
export const externals = {
  react: "react",
  "react-dom": "react-dom",
};
