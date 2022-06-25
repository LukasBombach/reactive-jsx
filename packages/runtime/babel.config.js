module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    [
      "@babel/preset-react",
      {
        pragma: "rjsx.el",
        pragmaFrag: "rjsx.frag",
      },
    ],
    "@babel/preset-typescript",
  ],
};
