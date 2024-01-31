module.exports = {
  apps: [
    {
      name: "hiantzz",
      script: "./build/client.js",
      watch: true,
      max_memory_restart: "250M",
      instance: 1
    }
  ]
}