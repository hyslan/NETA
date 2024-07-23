// @ts-check
require('dotenv').config()
const { test, expect } = require('@playwright/test');
const decompress = require("decompress");
const { PythonShell } = require('python-shell');
const path = require('path');

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

test('neta_downloads', async ({ page }) => {
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

  test.setTimeout(180000);
  try {
    const downloadPromise = page.waitForEvent('download');
    const download = await downloadPromise;
    // Wait for the download process to complete and save to the sheets path
    nome_arquivo = nome_arquivo.replaceAll('/', '_');
    console.log('Nome arquivo: ' + nome_arquivo);
    await download.saveAs(`./zip/${nome_arquivo}.ZIP`);
    console.log('N1N@: Download concluído...');
    await sleep(2000);
    await extractZip(`./zip/${nome_arquivo}.ZIP`, `./data`);
    await sleep(2000);
    // Exec Python
    let scriptPath = path.join(process.cwd(), 'main.py');
    let shell = new PythonShell(
      scriptPath, {
      pythonOptions: ['-u']
    }
    );
    shell.on('message', function (message) {
      window.console.log('message', message);
      window.console.log(new Date());
    });

    // Trata os erros
    shell.on('error', function (error) {
      console.error('Error:', error);
    });

    // Confirma a finalização do script Python
    shell.on('close', function () {
      console.log('Python script finished.');
    });

  }
  catch (error) {
    console.log(error);
    console.log('N1N@: Download falhou...');
  }

});

test('neta_processos', async ({ page }) => {
  test.setTimeout(60000);
  console.log('N1N@: Iniciando processo...');
  await page.goto(process.env.URL);
  await page.getByText('CRM').click();
  await page.getByText('MONITOR DE PROCESSOS').click();
  await page.locator('#ctl00_NetSiuCPH_ddl_Ele_For_Rpt_Nome_Report').selectOption('mRI6FhR9fdAv92Nv');
  await page.getByRole('link', { name: 'Dados processo' }).click();
  await page.getByRole('button', { name: 'Mostrar Pesquisa Estendida' }).click();
  await page.getByRole('button', { name: 'Configurar pesquisa' }).click();
  await expect(page.getByRole('cell', { name: 'Elaboração em andamento' })).toBeVisible({ timeout: 60000 });
  console.log('Elaboração em andamento...')

  // Data criação início
  let data = new Date();
  data.setDate(data.getDate() - 7);
  let data_ini = `${String(data.getDate()).padStart(2, '0')}/${String(data.getMonth() + 1).padStart(2, '0')}/${data.getFullYear()}`;
  const campo_data_ini = await page.locator('#ctl00_NetSiuCPH_dbx_crm_mp_datacreaz_dal_txtIt');
  await campo_data_ini.waitFor({ state: 'visible' });
  console.log('Data criação início visível...')
  await campo_data_ini.isEnabled();
  console.log('Data criação início habilitado...')
  await campo_data_ini.isEditable({ timeout: 60000 });
  console.log('Data criação início editável...')
  try {
    await campo_data_ini.click();
    await campo_data_ini.fill(data_ini, { timeout: 60000 });
    await campo_data_ini.press('Enter');
  }
  catch (error) {
    console.log(error);
  }

  // Data criação fim
  data.setDate(data.getDate() + 7);
  let data_fim = `${String(data.getDate()).padStart(2, '0')}/${String(data.getMonth() + 1).padStart(2, '0')}/${data.getFullYear()}`;
  const campo_data_fim_span = await page.getByTitle('Data criação Em');
  const campo_data_fim = await campo_data_fim_span.locator('input').nth(0);
  await campo_data_fim.waitFor({ state: 'visible' });
  console.log('Data criação fim visível...')
  await campo_data_fim.isEnabled();
  console.log('Data criação fim habilitado...')
  await campo_data_fim.isEditable({ timeout: 60000 });
  console.log('Data criação fim editável...')
  try {
    await campo_data_fim.click();
    await campo_data_fim.fill(data_fim, { timeout: 60000 });
    await campo_data_fim.press('Enter');
  }
  catch (error) {
    console.log(error);
  }

  // Confirmar
  await page.getByRole('button', { name: 'Impressão' }).click();
  await page.frameLocator('#NETAModalDialogiFrame_1').locator('#ctl00_NetSiuCPH_txt_rpt_desclancio').click();
  let nome_arquivo = `N1N@_${data_ini}_${data_fim}`;
  await page.frameLocator('#NETAModalDialogiFrame_1').locator('#ctl00_NetSiuCPH_txt_rpt_desclancio').fill(nome_arquivo);
  await page.frameLocator('#NETAModalDialogiFrame_1').getByRole('button', { name: 'Impressão' }).click();
  await page.frameLocator('#NETAModalDialogiFrame_1').getByRole('button', { name: 'Sim' }).click();
  await page.frameLocator('#NETAModalDialogiFrame_2').getByRole('button', { name: 'CONFIRMAR' }).click();
  await page.frameLocator('#NETAModalDialogiFrame_2').getByRole('button', { name: 'OK' }).click();
  console.log('N1N@: Processo concluído...')
});