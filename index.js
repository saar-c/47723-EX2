const API_BASE = 'https://api.open-meteo.com/v1/forecast';
const JERUSALEM_LAT = 31.7857;
const JERUSALEM_LONG = 35.2007;
const DEFAULT_SEARCH_PARAMS = {
  'latitude': JERUSALEM_LAT,
  'longitude': JERUSALEM_LONG,
  'daily': [
    'temperature_2m_max',
    'temperature_2m_min',
    'sunrise',
    'sunset',
    'rain_sum',
    'snowfall_sum',
    'windspeed_10m_max'
  ],
  'timezone': 'auto',
};
const APP = document.getElementById('app');
const UNITS_BTN = document.getElementById('units_btn');
const TODAY_WEEKLY_VIEW_BTN = document.getElementById('today_weekly_view_btn');

let gSearchParams = DEFAULT_SEARCH_PARAMS;

UNITS_BTN.addEventListener('click', async function() {
  if (UNITS_BTN.innerText === 'Imperial') {
    UNITS_BTN.innerText = 'Metric';
    gSearchParams['temperature_unit'] = 'fahrenheit';
    gSearchParams['windspeed_unit'] = 'mph';
    gSearchParams['precipitation_unit'] = 'inch';
    const data = await getData(gSearchParams);
    await renderUI(data);
  } 
  else {
    UNITS_BTN.innerText = 'Imperial';
    delete gSearchParams['temperature_unit'];
    delete gSearchParams['windspeed_unit'];
    delete gSearchParams['precipitation_unit'];
    const data = await getData(gSearchParams);
    await renderUI(data);
  }
});

TODAY_WEEKLY_VIEW_BTN.addEventListener('click', async function() {
  if (TODAY_WEEKLY_VIEW_BTN.innerText === 'Forecast for Today') {
    TODAY_WEEKLY_VIEW_BTN.innerText = '7 Days Forecast';
    const currentDate = await getCurrentDate();
    gSearchParams['start_date'] = currentDate;
    gSearchParams['end_date'] = currentDate;
    const data = await getData(gSearchParams);
    await renderUI(data);
  }
  else {
    TODAY_WEEKLY_VIEW_BTN.innerText = 'Forecast for Today';
    delete gSearchParams['start_date'];
    delete gSearchParams['end_date'];
    const data = await getData(gSearchParams);
    await renderUI(data);
  }
});

async function queryEndpoint(endpoint) {
  let data = null;
  try {
    const response = await fetch(endpoint);
    console.log(response);
    if (response.status === 200) {
      data = await response.json();
    }
  } 
  catch (error) {
    console.log('api error');
    console.error(error);
  }
  return data;
}

async function getCurrentDate() {
  const date = new Date().toISOString();
  return date.split('T')[0];
}

async function getData(searchParams) {
  const url = new URL(API_BASE);
  for (const key in searchParams) {
    url.searchParams.append(key, searchParams[key]);
  }
  const urlString = url.toString().replaceAll("%2C", ',');
  const data = await queryEndpoint(urlString);
  console.log(urlString);
  return data;
}

function clearUI() {
  while (APP.firstChild) {
    APP.removeChild(APP.firstChild);
  }
}

async function renderUI(data) {
  clearUI();
  
  // notice in the HTML file we call render();
  const table = Object.assign(document.createElement('table'), { className: 'table' });
  for (const weatherParam in data.daily)
  {
    const tr = Object.assign(document.createElement('tr'), { className: 'tr' });
    const trHead = Object.assign(document.createElement('h1'), {className: 'tr_head'});
    trHead.innerText = weatherParam;
    tr.appendChild(trHead);

    for (const dayIndex in data.daily[weatherParam]) {
      const td = Object.assign(document.createElement('td'), { className: 'td' });
      td.innerText = data.daily[weatherParam][dayIndex]
      tr.append(td);
    }
    
    table.append(tr);
    APP.appendChild(table);
  }

}

const data = await getData(DEFAULT_SEARCH_PARAMS);

await renderUI(data);
