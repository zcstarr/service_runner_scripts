const { spawn } = require('child_process');

const SERVICE_NAME = './services/mgeth';
const MGETH_DATADIR = `--datadir=${process.cwd()}/services/ETC`;
const SERVICE_FLAGS = ['--rpccorsdomain=*', '--classic', '--rpcport=8545', '--rpc', MGETH_DATADIR]

function start(serviceName, args) {
  spawn(serviceName, args, { stdio: 'inherit' });
}

function startService(name, env){
  start(SERVICE_NAME, SERVICE_FLAGS);
  return {port: 8545, host:'localhost'};
}

module.exports = { startService };

