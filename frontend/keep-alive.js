import http from 'http';
import { spawn } from 'child_process';

const PORT = 5173;
const CHECK_INTERVAL = 3000; // Verificar cada 3 segundos
let isRestarting = false;

function checkServer() {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: PORT,
      path: '/',
      method: 'HEAD',
      timeout: 2000
    }, (res) => {
      resolve(res.statusCode === 200 || res.statusCode === 304);
    });
    
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    
    req.end();
  });
}

function startServer() {
  if (isRestarting) return;
  isRestarting = true;
  
  console.log('🚀 Iniciando servidor de desarrollo...');
  
  const child = spawn('npm', ['run', 'dev'], {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: true
  });
  
  child.on('exit', (code) => {
    console.log(`❌ Servidor cerrado con código: ${code}`);
    isRestarting = false;
    
    if (code !== 0) {
      console.log('🔄 Reintentando en 5 segundos...');
      setTimeout(startServer, 5000);
    }
  });
  
  return child;
}

// Monitoreo continuo
setInterval(async () => {
  const isRunning = await checkServer();
  
  if (!isRunning && !isRestarting) {
    console.log('⚠️ Servidor no responde, reiniciando...');
    startServer();
  }
}, CHECK_INTERVAL);

// Iniciar servidor inicial
startServer();

// Manejar cierre limpio
process.on('SIGINT', () => {
  console.log('\n👋 Cerrando servidor...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Cerrando servidor...');
  process.exit(0);
});