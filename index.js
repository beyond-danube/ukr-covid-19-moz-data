const express = require('express')
const PORT = process.env.PORT || 5000
const colors = require('colors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

colors.setTheme({
  info: 'bgGreen',
  help: 'cyan',
  warn: 'yellow',
  success: 'bgBlue',
  error: 'red'
});

let app = express();
app.get('/', (req, res) => res.send());
app.get('/agata', (req, res) => res.send('❤️'));
app.get('/mozdata', (req, res) => getdata(function(data){
  res.set('Access-Control-Allow-Origin', '*')
  res.send(data);
}, req))
app.get('/mozdatabyregion', (req, res) => getRegionData(function(data){
  res.set('Access-Control-Allow-Origin', '*')
  res.send(data);
}, req))

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

function getdata(callback, req){
  let papa = require('papaparse')
  let request = require("request");
  
  let options = { header: true, dynamicTyping: true};
  let parseStream = papa.parse(papa.NODE_STREAM_INPUT, options);

  let csvUrl = 'https://covid19.gov.ua/csv/assets_' + req.query.day + '_' + req.query.month + '_' + req.query.year + '.csv';

  console.log(('Fetching data from ' + csvUrl).info);

  request.get(csvUrl).pipe(parseStream);

  let retData = { data: []}

  parseStream.on('data', function (chunk) {
    retData.data.push(chunk);
    }).on('finish', function () {
      console.log('Fetched data from MOZ'.info)
      callback(retData)
  });
}

function getRegionData(callback, req)
{

  getdata(function(rawData){
    
    let fieldToGet = req.query.csvfield

    let regionData = { data: [
      {ADM1_PCODE:"UA07", DATA:0, OBL: "Вінницька"},
      {ADM1_PCODE:"UA05", DATA:0, OBL: "Волинська"},
      {ADM1_PCODE:"UA12", DATA:0, OBL: 'Дніпропетровська'},
      {ADM1_PCODE:"UA14", DATA:0, OBL: 'Донецька' },
      {ADM1_PCODE:"UA18", DATA:0, OBL: 'Житомирська' },
      {ADM1_PCODE:"UA21", DATA:0, OBL: 'Закарпатська' },
      {ADM1_PCODE:"UA23", DATA:0, OBL: 'Запорізька' },
      {ADM1_PCODE:"UA26", DATA:0, OBL: 'Івано-Франківська'  },
      {ADM1_PCODE:"UA32", DATA:0, OBL: 'Київська' },
      {ADM1_PCODE:"UA35", DATA:0, OBL: 'Кіровоградська' },
      {ADM1_PCODE:"UA44", DATA:0, OBL: 'Луганська' },
      {ADM1_PCODE:"UA46", DATA:0, OBL: 'Львівська' },
      {ADM1_PCODE:"UA80", DATA:0, OBL: 'м.Київ' },
      {ADM1_PCODE:"UA48", DATA:0, OBL: 'Миколаївська' },
      {ADM1_PCODE:"UA51", DATA:0, OBL: 'Одеська' },
      {ADM1_PCODE:"UA53", DATA:0, OBL: 'Полтавська' },
      {ADM1_PCODE:"UA56", DATA:0, OBL: 'Рівненська' },
      {ADM1_PCODE:"UA59", DATA:0, OBL: 'Сумська' },
      {ADM1_PCODE:"UA61", DATA:0, OBL: 'Тернопільська' },
      {ADM1_PCODE:"UA63", DATA:0, OBL: 'Харківська' },
      {ADM1_PCODE:"UA65", DATA:0, OBL: 'Херсонська' },
      {ADM1_PCODE:"UA68", DATA:0, OBL: 'Хмельницька' },
      {ADM1_PCODE:"UA71", DATA:0, OBL: 'Черкаська' },
      {ADM1_PCODE:"UA73", DATA:0, OBL: 'Чернівецька' },
      {ADM1_PCODE:"UA74", DATA:0, OBL: 'Чернігівська' }
    ],
    errors: [],
    resolvedErrors: [] }

    rawData.data.forEach(element => { trasfromRawDataToRegion(element, fieldToGet.split('|')[0], regionData) });
    errorsResolver(regionData);

    if(fieldToGet.split('|').length === 2)
    {
      let regionDataOtherField = { data: [
        {ADM1_PCODE:"UA07", DATA:0, OBL: "Вінницька"},
        {ADM1_PCODE:"UA05", DATA:0, OBL: "Волинська"},
        {ADM1_PCODE:"UA12", DATA:0, OBL: 'Дніпропетровська'},
        {ADM1_PCODE:"UA14", DATA:0, OBL: 'Донецька' },
        {ADM1_PCODE:"UA18", DATA:0, OBL: 'Житомирська' },
        {ADM1_PCODE:"UA21", DATA:0, OBL: 'Закарпатська' },
        {ADM1_PCODE:"UA23", DATA:0, OBL: 'Запорізька' },
        {ADM1_PCODE:"UA26", DATA:0, OBL: 'Івано-Франківська'  },
        {ADM1_PCODE:"UA32", DATA:0, OBL: 'Київська' },
        {ADM1_PCODE:"UA35", DATA:0, OBL: 'Кіровоградська' },
        {ADM1_PCODE:"UA44", DATA:0, OBL: 'Луганська' },
        {ADM1_PCODE:"UA46", DATA:0, OBL: 'Львівська' },
        {ADM1_PCODE:"UA80", DATA:0, OBL: 'м.Київ' },
        {ADM1_PCODE:"UA48", DATA:0, OBL: 'Миколаївська' },
        {ADM1_PCODE:"UA51", DATA:0, OBL: 'Одеська' },
        {ADM1_PCODE:"UA53", DATA:0, OBL: 'Полтавська' },
        {ADM1_PCODE:"UA56", DATA:0, OBL: 'Рівненська' },
        {ADM1_PCODE:"UA59", DATA:0, OBL: 'Сумська' },
        {ADM1_PCODE:"UA61", DATA:0, OBL: 'Тернопільська' },
        {ADM1_PCODE:"UA63", DATA:0, OBL: 'Харківська' },
        {ADM1_PCODE:"UA65", DATA:0, OBL: 'Херсонська' },
        {ADM1_PCODE:"UA68", DATA:0, OBL: 'Хмельницька' },
        {ADM1_PCODE:"UA71", DATA:0, OBL: 'Черкаська' },
        {ADM1_PCODE:"UA73", DATA:0, OBL: 'Чернівецька' },
        {ADM1_PCODE:"UA74", DATA:0, OBL: 'Чернігівська' }
      ],
      errors: [],
      resolvedErrors: [] }

      rawData.data.forEach(element => { trasfromRawDataToRegion(element, fieldToGet.split('|')[1], regionDataOtherField) });
      errorsResolver(regionDataOtherField);

      regionData.data.forEach(element => {
        let index = regionDataOtherField.data.findIndex(x => x.ADM1_PCODE === element.ADM1_PCODE);
        let division = element.DATA / regionDataOtherField.data[index].DATA
        element.DATA = division > 10 ? Math.round(division) : (parseInt(division * 100) / 100);
      });

      regionDataOtherField.errors.forEach(element => {
        regionData.errors.push(element);
      });
    }

    console.log('Data processed'.info)
    callback(regionData);
  }, req);
};

function trasfromRawDataToRegion(element, fieldToGet, rd) {

  let index = rd.data.findIndex(x => x.OBL === element.Область);
  
  try{

    if(element[fieldToGet] === null)
    {
      rd.errors.push( { originalRow: element.Область, originalValue: element[fieldToGet], originalField: fieldToGet, errorDetails: 'Missing value for entry' } )
    }

    else
    {
      rd.data[index].DATA = rd.data[index].DATA + element[fieldToGet];
    }

  }
  catch(e){
    rd.errors.push( { originalRow: element.Область, originalValue: element[fieldToGet], originalField: fieldToGet , errorDetails: e.message + ' ' + e.stack } )
  }
}

function errorsResolver(regionDataObject){

  let result;

  regionDataObject.errors.forEach(element => {

    let index = regionDataObject.data.findIndex(x => x.OBL.includes(guessRegion(element.originalRow)));
    try{      
      result = element.originalValue == null ? "Could not resolve Error, seems there is no data" : "";
      regionDataObject.data[index].DATA = regionDataObject.data[index].DATA + element.originalValue;
    }

    catch(e)
    {
      result = e;
      console.log(('Error occurred on guessing region ' + e.message + ' ' + e.stack).warn)
    }

    finally{

      if(result === "")
      {
        regionDataObject.resolvedErrors.push( {fixedRow: regionDataObject.data[index].OBL, fixedRegionValue: regionDataObject.data[index].DATA} ) 
      }
    }

  });

  if(regionDataObject.resolvedErrors.length === regionDataObject.errors.length)
  {
    console.log(('Resolved ' + regionDataObject.resolvedErrors.length + ' errors of ' + regionDataObject.errors.length).info);
  } else {
    console.log(('Resolved ' + regionDataObject.resolvedErrors.length + ' errors of ' + regionDataObject.errors.length).warn);
  }
 
};

function guessRegion(possibleRegion){

  let trimmed = typeof possibleRegion === 'string' ? possibleRegion.replace('��','|') : '';
  
  let subStrs = trimmed.split('|');

  let longestSbstr = 0;
  let substrtToUse = '';

  for(i = 0; i < subStrs.length; i++)
  {
    if(subStrs[i].length > longestSbstr)
    {
      longestSbstr = subStrs[i].length;
      substrtToUse = subStrs[i];
    }
  }
  
  return substrtToUse;
};
