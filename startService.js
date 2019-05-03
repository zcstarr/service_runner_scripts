const { spawn } = require('child_process');


const SERVICE_NAME = './services/mgeth';
const MGETH_DATADIR = `--datadir=${process.cwd()}/services/ETC`;
const SERVICE_FLAGS = ['--rpccorsdomain=*', '--classic', '--rpcport=8545', '--rpc', MGETH_DATADIR]

function start(serviceName, args) {
  const child = spawn(serviceName, args)
  child.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  
  child.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });
  
  child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
  child.on("error",(err)=>{
    console.log(`child process exited with err ${err}`);
  })
}

async function startService(name, env){
  console.log(`${SERVICE_NAME} ${SERVICE_FLAGS}`)
  start(SERVICE_NAME, SERVICE_FLAGS);
  return {pid, port: 8545, host:'localhost'};
}

module.exports = { startService };
