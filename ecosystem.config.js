module.exports = {
  apps: [
    {
      name: "hiantzz",
      script: "./build/client.js",
      exec_mode: "cluster",
      max_memory_restart: "250M",
      instances: "max"
    }
  ]
}