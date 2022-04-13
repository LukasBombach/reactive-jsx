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

module.exports = withTM(["@reactive-jsx/playground"])(nextConfig);
