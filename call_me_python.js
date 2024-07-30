const path = require('path');
const { PythonShell } = require('python-shell');

console.log("Calling Python")

let scriptPath = path.join(process.cwd(), 'main.py');
  let shell = new PythonShell(
    scriptPath, {
    pythonOptions: ['-u']
  }
  );
  shell.on('message', function (message) {
    console.log('message', message);
    console.log(new Date());
  });

  // Trata os erros
  shell.on('error', function (error) {
    console.error('Error:', error);
  });

  // Confirma a finalização do script Python
  shell.on('close', function () {
    console.log('Python script finished.');
  });