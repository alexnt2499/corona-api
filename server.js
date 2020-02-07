const express = require('express');
const app = express();
const PORT = process.env.PORT;

const fs = require('fs');
const pdf = require('pdf-parse');

const pathFileData = './file/20200206-sitrep-17-ncov.pdf';

const DataCountries = require('./utils/DataCountries');
let dataBuffer = fs.readFileSync(pathFileData);

app.listen(PORT,(data) => {
    console.log('server run PORT ' + PORT) 
})





app.get('/api/getDataCoronaByDate', (req,res) => {
    try {
        pdf(dataBuffer).then(function(data) {
            let dataBegin =  data.text.indexOf('Table 2. Countries, territories or areas with reported confirmed 2019-nCoV cases and deaths.');
            let dataEnd = data.text.indexOf('Case classifications are based on WHO case definitions for 2019-nCoV.');
            let dataTable = data.text.substring(dataBegin,dataEnd)
            
            let TotalDataCorona = [];
        
            for (let index = 0; index < DataCountries.length; index++) {
                const element = DataCountries[index];
                let Singapore = dataTable.substring(dataTable.indexOf(element) + (element.length-1),dataTable.length);
                let arraySingapore = Singapore.split(' ');
                let arraySingaporeNew = arraySingapore.filter((value) => {
                    if(value.indexOf('(') == -1) {
                        return value;
                    }
                })
        
                
                let dataSingapore = {
                    country : element,
                    confirmed : arraySingaporeNew[1],
                    travelHistoryChina : arraySingaporeNew[2],
                    deaths : arraySingaporeNew[5].replace('\n','')
                }
                TotalDataCorona.push(dataSingapore)
            }
        
            res.json({
                data : TotalDataCorona
            })
        });
    } catch (error) {
        res.json({
            status : 501
        })
    }
})