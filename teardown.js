const { existsSync, rm } = require('node:fs');

module.exports = async () => {
    const dirPath = `${__dirname}/jestTestDb`;

    if (existsSync(dirPath)) {
      rm(dirPath, { recursive: true, force: false }, (err) => {
        if (err) {
          console.error(`Failed to delete directory: ${err}`);
        } else {
          console.log(`Deleted directory: ${dirPath}`);
        }
      });
    }
};
