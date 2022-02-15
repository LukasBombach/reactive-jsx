const withTM = require("next-transpile-modules")(["transpiler", "bundler"]);

module.exports = withTM({
  reactStrictMode: true,
});
