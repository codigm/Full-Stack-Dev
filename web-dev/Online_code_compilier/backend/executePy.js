const { exec } = require("child_process");
const path = require("path");

const executePy = (filepath) => {
  return new Promise((resolve, reject) => {
    exec(`python "${filepath}"`, (error, stdout, stderr) => {
      if (error) {
        reject({ error: error.message, stderr: stderr || "" });
        return;
      }
      if (stderr.trim()) {
        reject({ stderr });
        return;
      }
      resolve(stdout);
    });
  });
};

module.exports = { executePy };
