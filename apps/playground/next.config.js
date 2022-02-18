const withTM = require("next-transpile-modules")(["@reactive-jsx/babel-plugin", "@reactive-jsx/transpiler", "@reactive-jsx/bundler"]);

module.exports = withTM({
  reactStrictMode: true,
});
