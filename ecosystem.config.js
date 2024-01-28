// import path from "node:path";
const path = require("node:path");

module.exports = {
  apps: [
    {
      name: "Hiantzz-bot",
      scripts: path.resolve(process.cwd(), "build", "client.js"),
      watch: true,
      exec_mode: "cluster",
      instances: 4
    }
  ]
}