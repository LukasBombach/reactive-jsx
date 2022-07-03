module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    [
      "@babel/preset-react",
      {
        pragma: "rjsx.createElement",
        pragmaFrag: "rjsx.Fragment",
      },
    ],
    "@babel/preset-typescript",
  ],
  plugins: ["../babel"],
};
