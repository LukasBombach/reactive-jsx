const withTM = require("next-transpile-modules");

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { webpack }) => {
    config.plugins.push(new webpack.ContextReplacementPlugin(/@babel\/standalone/));
    return config;
  },
};

module.exports = withTM(["@reactive-jsx/babel-plugin", "@reactive-jsx/transpiler", "@reactive-jsx/bundler"])(
  nextConfig
);
