// @ts-check
require('dotenv').config();
const {chromium} = require('playwright');

(async () => {
  // Setup
  const browser = await chromium.launch({ headless: true ,
  timeout: 90000});
  const context = await browser.newContext({httpCredentials: {
    username: process.env.USER,
    password: process.env.PASSWORD,
  }
  });
  const page = await context.newPage();
  page.setDefaultTimeout(180000);

  // Run
  console.log('N1N@: Iniciando processo...');
  console.log('URL: ' + process.env.URL);
  await page.goto(process.env.URL);
  await page.getByText('CRM').click();
  await page.getByText('MONITOR DE PROCESSOS').click();
  await page.locator('#ctl00_NetSiuCPH_ddl_Ele_For_Rpt_Nome_Report').selectOption('mRI6FhR9fdAv92Nv');
  await page.getByRole('link', { name: 'Dados processo' }).click();
  await page.getByRole('button', { name: 'Mostrar Pesquisa Estendida' }).click();
  await page.getByRole('button', { name: 'Configurar pesquisa' }).click();
  const span_elaboracao = page.getByRole('cell', { name: 'Elaboração em andamento' });
    await span_elaboracao.waitFor({ state: 'visible' });
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
    await campo_data_fim.fill(data_fim, { timeout: 70000 });
    await campo_data_fim.press('Enter');
  }
  catch (error) {
    console.log(error);
  }

  // Confirmar
  await page.getByRole('button', { name: 'Impressão' }).click({timeout: 90000});
  await page.frameLocator('#NETAModalDialogiFrame_1').locator('#ctl00_NetSiuCPH_txt_rpt_desclancio').click({timeout: 90000});
  let nome_arquivo = `N1N@_${data_ini}_${data_fim}`;
  await page.frameLocator('#NETAModalDialogiFrame_1').locator('#ctl00_NetSiuCPH_txt_rpt_desclancio').fill(nome_arquivo);
  await page.frameLocator('#NETAModalDialogiFrame_1').getByRole('button', { name: 'Impressão' }).click({timeout: 90000});
  await page.frameLocator('#NETAModalDialogiFrame_1').getByRole('button', { name: 'Sim' }).click({timeout: 90000});
  await page.frameLocator('#NETAModalDialogiFrame_2').getByRole('button', { name: 'CONFIRMAR' }).click({timeout: 90000});
  await page.frameLocator('#NETAModalDialogiFrame_2').getByRole('button', { name: 'OK' }).click({timeout: 90000});
  console.log('N1N@: Processo concluído...')
  // Teardown
  await context.close();
    await browser.close();
})();