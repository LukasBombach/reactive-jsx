const withTM = require("next-transpile-modules")(["compiler"]);

module.exports = withTM({
  reactStrictMode: true,
});
