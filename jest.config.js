// jest.config.js
module.exports = {
    transformIgnorePatterns: [
      "/node_modules/(?!axios|other-module-to-transform)/"
    ],
  };
  