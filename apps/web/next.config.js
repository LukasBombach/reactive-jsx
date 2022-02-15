const withTM = require("next-transpile-modules")(["compiler", "bundler"]);

module.exports = withTM({
  reactStrictMode: true,
});
