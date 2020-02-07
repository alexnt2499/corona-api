const express = require('express');
const router = express.Router();
const CountriesModel = require('./../../db/model/Countries');
const cheerio = require('cheerio')
var request = require('request');

router.get('/updateBy', (req,res) => {
    try {
        let {date} = req.query;
        request('https://www.worldometers.info/coronavirus/', async function (error, response, html) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);
            let arrayData = [];
            $('#table3 tbody tr').each(function(i, elem) {
               let string = $(this).text();
                let arrayString = string.split(' ');
                let value = {};
               if(arrayString[2] == 'Hong') {
                 value = {
                    country : 'Hong Kong',
                    confirmed : arrayString[4+1],
                    recuperate :  arrayString[11+1],
                    deaths : arrayString[7+1].replace('\n','')  
                }
               }else if(arrayString[2] =='S.') {
                 value = {
                    country : 'Korea',
                    confirmed : arrayString[4+1],
                    recuperate :  arrayString[11+1],
                    deaths : arrayString[7+1].replace('\n','')  
                }
               }else {
                value = {
                    country : arrayString[2],
                    confirmed : arrayString[4],
                    recuperate :  arrayString[11],
                    deaths : arrayString[7].replace('\n','')  
                }
               }

               arrayData.push(value)

                
            });;

            console.log(arrayData);
            let check = await CountriesModel.findOne({date : date});

            if(!check) {
                let addCon = new CountriesModel({
                    list : arrayData,
                    date : date
                });
    
                addCon.save();
            }else{
                CountriesModel.findOneAndUpdate({date : date})
            }
            

            res.json({status : 200})

           
        }
        });
    } catch (error) {
        res.json({status : 501})
    }
})

module.exports = router;