const { spawn } = require('child_process');

const SERVICE_NAME = './services/mgeth';
const MGETH_DATADIR = `--datadir=${process.cwd()}/services/ETC`;
const SERVICE_FLAGS = ['--classic', '--rpc', MGETH_DATADIR]

function startService(serviceName, args) {
  spawn(serviceName, args, { stdio: 'inherit' });
}

if (require.main === module) {
  startService(SERVICE_NAME, SERVICE_FLAGS);
} else {
  moodule.exports = startService;
}

