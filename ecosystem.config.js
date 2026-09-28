module.exports = {
  apps: [{
    name: 'nextjs-app',
    script: 'server.js',
    instances: 1,
    exec_mode: 'fork',
    cwd: '/home/checkk/domains/checkkub.com/public_html',
    env_file: '/home/checkk/domains/checkkub.com/public_html/.env.local',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOSTNAME: '0.0.0.0',
    }
  }]
};
