const { spawn } = require('child_process');

function callPython() {
  console.log("Calling Python");

  // Use o caminho absoluto diretamente
  let scriptPath = 'C:\\Users\\irgpapais\\Documents\\Meus Projetos\\Neta\\nina\\main.py';
  console.log(`Script path: ${scriptPath}`); // Logging adicional

  // Chamar o script Python como um novo processo
  const pythonProcess = spawn('python', [scriptPath]);

  // Capturar a saída do script Python
  pythonProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  // Capturar erros do script Python
  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  // Confirmar a finalização do script Python
  pythonProcess.on('close', (code) => {
    console.log(`Python script finished with code ${code}`);
  });
}

module.exports = callPython;