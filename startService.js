const { spawn } = require('child_process');
const spawnAsync = require('@expo/spawn-async');


const SERVICE_NAME = './services/mgeth';
const MGETH_DATADIR = `--datadir=${process.cwd()}/services/ETC`;
const SERVICE_FLAGS = ['--rpccorsdomain=*', '--classic', '--rpcport=8545', '--rpc', MGETH_DATADIR]

function start(serviceName, args) {
  return spawnAsync(serviceName, args, { stdio: 'inherit' });
}

async function startService(name, env){
  const {pid} = await start(SERVICE_NAME, SERVICE_FLAGS);
  return {pid, port: 8545, host:'localhost'};
}

module.exports = { startService };

