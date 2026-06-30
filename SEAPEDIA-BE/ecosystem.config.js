// PM2 process manager untuk SEAPEDIA backend.
// Jalankan: pm2 start ecosystem.config.js && pm2 save && pm2 startup
module.exports = {
  apps: [
    {
      name: "seapedia-be",
      script: "src/server.js",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
      },
      // PM2 baca .env via dotenv di server.js, jadi var sensitif tetap di .env (bukan di sini)
      max_memory_restart: "300M",
      autorestart: true,
    },
  ],
};
