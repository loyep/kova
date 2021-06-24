module.exports = {
  apps: [
    {
      name: 'kova',
      script: 'dist/main.js',
      exec_mode: 'cluster',
      max_memory_restart: '800M',
      instances: 0,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}
