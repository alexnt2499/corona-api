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
            $('#main_table_countries_div tbody tr').each( async function(i, elem) {
               let string = $(this).text();
                let arrayString = string.split(' ');
                let value = {};
                
                let arrayEnd = [];
                let check = false;
                for (let index = 0; index < arrayString.length; index++) {
                    const elem = arrayString[index];
                    if(index == 2) {
                        let checkString = arrayString[3].replace(',','');
                        if(!Number.isNaN(Number(checkString))) {
                            arrayEnd.push(elem);
                        }else {
                            arrayEnd.push(elem + arrayString[3]);
                            check = true;
                        }
                    }else {
                        arrayEnd.push(elem);
                    }
                }   
                if(check == true) {
                    arrayEnd.splice(3,1);
                }

               if(arrayEnd.length == 21  ) {
                   let getLocation = await requestPro.get({
                       uri : `https://api.mapbox.com/geocoding/v5/mapbox.places/${arrayEnd[2]}.json?types=country&access_token=pk.eyJ1IjoiZGVubmEyNDcxOTk5IiwiYSI6ImNrNmNmd2x3ZDEzdm0zanJ5ZmxpY3dseDAifQ.4vQDLt0E5wV7RNE9IgSKBQ`,
                       json : true
                   });
                   
                 value = {
                    country : arrayEnd[2],
                    confirmed : arrayEnd[4],
                    recuperate :  arrayEnd[16],
                    deaths : arrayEnd[9].replace('\n',''),
                    latitude : getLocation.features[0].center[1],
                    longitude : getLocation.features[0].center[0]
                }
               }
               else if(arrayEnd.length == 20) {
                    let getLocation = await requestPro.get({
                        uri : `https://api.mapbox.com/geocoding/v5/mapbox.places/${arrayEnd[2]}.json?types=country&access_token=pk.eyJ1IjoiZGVubmEyNDcxOTk5IiwiYSI6ImNrNmNmd2x3ZDEzdm0zanJ5ZmxpY3dseDAifQ.4vQDLt0E5wV7RNE9IgSKBQ`,
                        json : true
                    });
                    
                value = {
                    country : arrayEnd[2],
                    confirmed : arrayEnd[4],
                    recuperate :  arrayEnd[15],
                    deaths : arrayEnd[9].replace('\n',''),
                    latitude : getLocation.features[0].center[1],
                    longitude : getLocation.features[0].center[0]
                }
               }else if( arrayEnd.length == 19) {
                let getLocation = await requestPro.get({
                    uri : `https://api.mapbox.com/geocoding/v5/mapbox.places/${arrayEnd[2]}.json?types=country&access_token=pk.eyJ1IjoiZGVubmEyNDcxOTk5IiwiYSI6ImNrNmNmd2x3ZDEzdm0zanJ5ZmxpY3dseDAifQ.4vQDLt0E5wV7RNE9IgSKBQ`,
                    json : true
                });
                
                    value = {
                        country : arrayEnd[2],
                        confirmed : arrayEnd[4],
                        recuperate :  arrayEnd[14],
                        deaths : arrayEnd[9].replace('\n',''),
                        latitude : getLocation.features[0].center[1],
                        longitude : getLocation.features[0].center[0]
                    }
               }
               
           
              
              
               console.log(value);
               

               let checkExist = await CountriesModel.findOne({countryName : value.country});

               if(checkExist && value.country) {
                   
                    CountriesModel.findOneAndUpdate({countryName : value.country },{
                        countryName : value.country,
                        data : value,
                        date : date
                    }).then((data) => {
                    })
               }else if(!checkExist && value.country) {
                   let add = new CountriesModel({ countryName : value.country,
                    data : value,
                    date : date});

                    add.save();
               }
             
               
             
           

                
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