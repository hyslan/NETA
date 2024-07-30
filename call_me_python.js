const { spawn } = require('child_process');

function callPython() {
  console.log("Calling Python");

  // absolute path
  let scriptPath = 'C:\\rpa\\NETA\\main.py';
  console.log(`Script path: ${scriptPath}`); // Logging

  // Newborn Process
  const pythonProcess = spawn('python', [scriptPath]);

  // Out Python
  pythonProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  // Catch Python errors
  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  // Confirm script Python
  pythonProcess.on('close', (code) => {
    console.log(`Python script finished with code ${code}`);
  });
}

module.exports = callPython;