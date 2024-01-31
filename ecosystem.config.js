module.exports = {
  apps: [
    {
      name: "hiantzz",
      script: "./build/client.js",
      watch: true,
      max_memory_restart: "150M",
      instance: 1 
    }
  ]
}