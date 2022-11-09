// Override create-react-app's webpack configs for lucafabbian's Firepad to work
// This is used by react-app-rewired, see https://www.npmjs.com/package/react-app-rewired
// Without this package, we will run into this error:
// https://stackoverflow.com/questions/69427025/programmatic-webpack-jest-esm-cant-resolve-module-without-js-file-exten
module.exports = function override(config, env) {
  config.module.rules = [
    ...config.module.rules,
    {
      test: /\.m?js/,
      type: "javascript/auto",
    },
    {
      test: /\.m?js/,
      resolve: {
        fullySpecified: false,
      },
    },
  ];
  return config;
};
