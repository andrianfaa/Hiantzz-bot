module.exports = {
  apps: [
    {
      name: "Hiantzz-bot",
      script: "./build/client.js",
      watch: true,
      exec_mode: "cluster",
      instances: 1
    }
  ]
}