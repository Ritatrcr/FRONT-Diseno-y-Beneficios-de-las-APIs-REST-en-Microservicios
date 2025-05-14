const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'jaead2',
  component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
    },
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
