const withTM = require("next-transpile-modules")(["babel-plugin", "transpiler", "bundler"]);

module.exports = withTM({
  reactStrictMode: true,
});
