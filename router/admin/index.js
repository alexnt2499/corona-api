const express = require('express');
const router = express.Router();
const CountriesModel = require('./../../db/model/Countries');
const cheerio = require('cheerio')
var request = require('request');
var requestPro = require('request-promise');

router.get('/updateBy',  (req,res) => {
    try {
        let {date} = req.query;
        request('https://www.worldometers.info/coronavirus/', async function (error, response, html) {
            console.log(error);
            
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);
            let arrayData = [];
            $('#table3 tbody tr').each( async function(i, elem) {
               let string = $(this).text();
                let arrayString = string.split(' ');
                let value = {};
                let demJ = 1;
                



               if(arrayString[2] == 'Hong') {
                   let getLocation = await requestPro.get({
                       uri : `https://api.mapbox.com/geocoding/v5/mapbox.places/${'Hong Kong'}.json?types=country&access_token=pk.eyJ1IjoiZGVubmEyNDcxOTk5IiwiYSI6ImNrNmNmd2x3ZDEzdm0zanJ5ZmxpY3dseDAifQ.4vQDLt0E5wV7RNE9IgSKBQ`,
                       json : true
                   });
                   
                 value = {
                    country : 'Hong Kong',
                    confirmed : arrayString[4+1],
                    recuperate :  arrayString[11+1+demJ],
                    deaths : arrayString[8+1+demJ].replace('\n',''),
                    latitude : getLocation.features[0].center[1],
                    longitude : getLocation.features[0].center[0]
                }
               }
              
               else if(arrayString[2] =='Sri') {
                let getLocation = await requestPro.get({
                    uri : `https://api.mapbox.com/geocoding/v5/mapbox.places/${'Sri Lanka'}.json?types=country&access_token=pk.eyJ1IjoiZGVubmEyNDcxOTk5IiwiYSI6ImNrNmNmd2x3ZDEzdm0zanJ5ZmxpY3dseDAifQ.4vQDLt0E5wV7RNE9IgSKBQ`,
                    json : true
                });
                 value = {
                    country : 'Sri Lanka',
                    confirmed : arrayString[4+1],
                    recuperate :  arrayString[11+1+demJ],
                    deaths : arrayString[8+1+demJ].replace('\n','') ,
                    latitude : getLocation.features[0].center[1],
                    longitude : getLocation.features[0].center[0]
                }}
               else if(arrayString[2] =='S.') {
                let getLocation = await requestPro.get({
                    uri : `https://api.mapbox.com/geocoding/v5/mapbox.places/${'Korea'}.json?types=country&access_token=pk.eyJ1IjoiZGVubmEyNDcxOTk5IiwiYSI6ImNrNmNmd2x3ZDEzdm0zanJ5ZmxpY3dseDAifQ.4vQDLt0E5wV7RNE9IgSKBQ`,
                    json : true
                });
                 value = {
                    country : 'Korea',
                    confirmed : arrayString[4+1],
                    recuperate :  arrayString[11+1+demJ],
                    deaths : arrayString[8+1+demJ].replace('\n','') ,
                    latitude : getLocation.features[0].center[1],
                    longitude : getLocation.features[0].center[0]
                }
               
               }else {
                let getLocation = await requestPro.get({
                    uri : `https://api.mapbox.com/geocoding/v5/mapbox.places/${arrayString[2]}.json?types=country&access_token=pk.eyJ1IjoiZGVubmEyNDcxOTk5IiwiYSI6ImNrNmNmd2x3ZDEzdm0zanJ5ZmxpY3dseDAifQ.4vQDLt0E5wV7RNE9IgSKBQ`,
                    json : true
                });
                
                value = {
                    country : arrayString[2],
                    confirmed : arrayString[4],
                    recuperate :  arrayString[2] == 'China' ? arrayString[12+demJ] : arrayString[11+demJ],
                    deaths : arrayString[8+demJ].replace('\n','') ,
                    latitude : getLocation.features[0].center[1],
                    longitude : getLocation.features[0].center[0]
                }
               }
               console.log(value);
               
               CountriesModel.findOneAndUpdate({countryName : value.country },{
                    countryName : value.country,
                    data : value,
                    date : date
               }).then((data) => {
               })
            //    let addCon = new CountriesModel({
            //         countryName : value.country,
            //         data : value,
            //         date : date
            //     });

            //      addCon.save();

                
            });;


            // res.json({status : 200})

           
        }
        });
    } catch (error) {
        console.log(error);
        
        res.json({status : 501})
    }
})




module.exports = router;