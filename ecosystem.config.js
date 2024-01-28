module.exports = {
  apps: [
    {
      name: "Hiantzz-bot",
      scripts: "./build/client.js",
      watch: true,
      exec_mode: "cluster",
      instances: 4
    }
  ]
}