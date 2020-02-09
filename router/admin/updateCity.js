const express = require('express');
const router = express.Router();
const cheerio = require('cheerio')
var request = require('request');
var requestPro = require('request-promise');
var dataProvince = require('./../../utils/DataProvince');
const ProvinceModel = require('./../../db/model/Province');

router.get('/updateBy', (req,res) => {
    try {
        
        let {date} = req.query;
        request('https://ncov.moh.gov.vn/', async function (error, response, html) {
                    if (!error && response.statusCode == 200) {
                        var $ = cheerio.load(html);
                        let data = $.html().substring($.html().indexOf('_congbothongke_WAR_coronadvcportlet_jsonData :')+'_congbothongke_WAR_coronadvcportlet_jsonData : '.length,$.html().length)
                        let data2 = data.substring( data.indexOf('['), data.indexOf(']')+1)
                        let jsonValue = JSON.parse(data2);
                        let arrayFilter = jsonValue.filter( async (value) => {
                            if( value.name == null ) {
                                let valueGet = {};
                                for (let index = 0; index < dataProvince.length; index++) {
                                    const element = dataProvince[index];
                                    if(element.id == value.ma) {
                                       
                                            
                                            valueGet = {
                                                country : element.name,
                                                confirmed : value.soCaNhiem,
                                                recuperate : value.binhPhuc,
                                                deaths : value.tuVong,
                                                
                                            }
                                            console.log(valueGet);
                                            let checkProvince = await ProvinceModel.findOne({city:element.name});
                                            if(checkProvince) {
                                                ProvinceModel.findOneAndUpdate({city:element.name},{
                                                    city : element.name,
                                                    data : valueGet,
                                                    date : date
                                                })
                                            }else {
                                                let provinceModel = new ProvinceModel({
                                                    city : element.name,
                                                    data : valueGet,
                                                    date : date
                                                });
                                                provinceModel.save();
                                            }
                                            
                                    }
                                    
                                   
                                    
                                }

                            }
                        })


                        
                    }
        })

    } catch (error) {
        
    }
})

module.exports = router;