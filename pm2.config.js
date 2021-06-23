module.exports = {
  apps: [
    {
      name: 'kova',
      script: 'dist/main.js',
      exec_mode: 'cluster',
      max_memory_restart: '800M',
      instances: Number(process.argv[2] || require('os').cpus().length),
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}
