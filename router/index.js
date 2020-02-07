const express = require('express');
const router = express.Router();
const Countries = require('./../db/model/Countries');

router.get('/getAllDataCoronaByDate', async (req,res) => {
    try {
        let {date} = req.query; 

        let getData = await Countries.findOne({date});

        res.json({
            data : getData.list,
            status : 200

        })
    } catch (error) {
        res.json({
            status : 501
        })
    }
})



router.get('/getByNameCountry', async (req,res) => {
    try {
        let {nameCountry,date} = req.query; 
        let getData = await Countries.findOne({date});
        for (let index = 0; index < getData.list.length; index++) {
            const element = getData.list[index];
            if(element.country == nameCountry) {
                res.json({
                    data : element,
                    status : 200
                })
            }
        }

        res.json({
            msg : 'Not Found Data',
            status : 204
        })
       
    } catch (error) {
        console.log();
        
        res.json({
            status : 501
        })
    }
})

module.exports = router;