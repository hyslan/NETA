// @ts-check
require('dotenv').config()
const {chromium} = require('playwright');
const decompress = require("decompress");
const callPython = require('./call_me_python.js');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function extractZip(zipFile, outputDir) {
    return decompress(zipFile, outputDir)
        .then(files => {
            console.log('N1N@: Extração concluída...');
        })
        .catch(err => {
            console.error(err);
            console.log('N1N@: Extração falhou...');
        });
}

(async () => {
    // Setup
    const browser = await chromium.launch({ headless: true ,
        timeout: 180000});
    const context = await browser.newContext({httpCredentials: {
            username: process.env.USER,
            password: process.env.PASSWORD
        }
    });
    const page = await context.newPage();
    page.setDefaultTimeout(180000);

    console.log('N1N@: Iniciando download...');
    let data = new Date();
    // Get the date of the last week minus one
    data.setDate(data.getDate() - 8);

    let data_ini = `${String(data.getDate()).padStart(2, '0')}/${String(data.getMonth() + 1).padStart(2, '0')}/${data.getFullYear()}`;
    // Yesterday's date
    data.setDate(data.getDate() + 7);

    let data_fim = `${String(data.getDate()).padStart(2, '0')}/${String(data.getMonth() + 1).padStart(2, '0')}/${data.getFullYear()}`;

    let nome_arquivo = `N1N@_${data_ini}_${data_fim}`;
    await page.goto(process.env.URL);
    await page.getByText('Tarefas agendadas').click();
    await page.getByRole('button', { name: 'OK' }).click();
    await page.getByTitle('Executados').click();
    const spanLocator = await page.getByText(nome_arquivo);
    const id = await spanLocator.getAttribute('id');
    let id_download = id.replaceAll('_', '$')
        .replace('gv$', 'gv_')
        .replace('lbl$esct$descrizione', 'btnDownload');
    console.log("ID Concatenado: " + id_download);
    await page.locator(`[name="${id_download}"]`).click();

    try {
        const downloadPromise = page.waitForEvent('download', {timeout: 180000});
        console.log('N1N@: Download iniciado...');
        const download = await downloadPromise;
        // Wait for the download process to complete and save to the sheets path
        nome_arquivo = nome_arquivo.replaceAll('/', '_');
        console.log('Nome arquivo: ' + nome_arquivo);
        await download.saveAs(`./zip/${nome_arquivo}.ZIP`);
        console.log('N1N@: Download concluído...');
        await sleep(2000);
        await extractZip(`./zip/${nome_arquivo}.ZIP`, `./data`);
        await sleep(2000);
        console.log("WD: " + process.cwd())
        // Calling call_me_python.js
        console.log("Starting Python call...");
        callPython(); // Isso vai executar o script Python
        console.log("Python call has been initiated.");

    }
    catch (error) {
        console.log(error);
        console.log('N1N@: Download falhou...');
    }
    // Teardown
    await context.close();
    await browser.close();

})();