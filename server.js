const express = require('express');
const app = express();
const PORT =  process.env.PORT || 4000;
const fs = require('fs');
const pdf = require('pdf-parse');
const pathFileData = './file/updateCorona.pdf';
const DataCountries = require('./utils/DataCountries');
let dataBuffer = fs.readFileSync(pathFileData);
const database = require('./db/connection');
const CountriesModel = require('./db/model/Countries');
const Views = require('./db/model/Views');
const Emails = require('./db/model/Emails');


const body_parser = require('body-parser');
const cors = require('cors');
database();

app.listen(PORT,(data) => {
    console.log('server run PORT ' + PORT) 
})

app.use(body_parser.json());
app.use(cors())

app.use('/api/public', require('./router/index'));
app.use('/api/admin', require('./router/admin/index'));
app.use('/api/admins', require('./router/admin/updateCity'));

app.use('/',express.static('frontend'))




app.get('/ViewUp', async (req,res) => {
    try {
        let view = await Views.findOne({name : 'corona'});
        if(view) {
           let up = await Views.findOneAndUpdate({name : 'corona'},{views : view.views+1});
           console.log(view.views);
           
        }else{
            let addView = new Views({
                name : 'corona',
                views : 0
            });
            addView.save();
        }
        res.json({data : view})
    } catch (error) {
        
    }
})

app.get('/getViewAndSub', async (req,res) => {
    try {
       
        let viewObj = await Views.findOne({name : 'corona'});
        let subs = await Emails.find();
        console.log( subs.length);
        
        res.json({
            views : viewObj.views,
            sub : subs.length,
            status : 200});
    } catch (error) {
        res.json({status : 501})

    }
})


app.post('/api/UpdateCoronaByPDFWHO', (req,res) => {
    try {
        let {date} = req.body;
        pdf(dataBuffer).then(function(data) {
            let dataBegin =  data.text.indexOf('Table 2. Countries, territories or areas with reported confirmed 2019-nCoV cases and deaths.');
            let dataEnd = data.text.indexOf('Case classifications are based on WHO case definitions for 2019-nCoV.');
            let dataTable = data.text.substring(dataBegin,dataEnd)

            let dataBeginChina = data.text.indexOf('SITUATION IN NUMBERS total and new cases in last 24 hours');
            let dataEndChina = data.text.indexOf('WHO RISK ASSESSMENT');
            let dataTableChina = data.text.substring(dataBeginChina,dataEndChina)

            let China = dataTableChina.substring(dataTableChina.indexOf('China') + 5,dataTableChina.length);
           
            let deathsString = China.substring(China.indexOf('severe'),China.indexOf('deaths'));
            let deathsArray = deathsString.split(' ');
            let deathsArrayEnd = deathsArray.filter((value) => {
               
                    if(value.indexOf('(') == -1 && value.indexOf(')') == -1 && value.indexOf('\n') == -1 && value != '' ) {
                        return value;
                    }
             
            })
            console.log(deathsArrayEnd);
            
            let TotalDataCorona = [{
                country : 'China',
                confirmed : China.substring(0,China.indexOf('confirmed')).replace('\n','').trim(),
                travelHistoryChina :  0,
                deaths : deathsArrayEnd[1]  
            }];

            console.log(TotalDataCorona);
            
        
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
                TotalDataCorona.push(dataSingapore);
            }
            let addCon = new CountriesModel({
                list : TotalDataCorona,
                date : date
            });

            addCon.save();
        
            res.json({
                status : 200
            })
        });
    } catch (error) {
        res.json({
            status : 501
        })
    }
})