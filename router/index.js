const express = require('express');
const router = express.Router();
const Countries = require('./../db/model/Countries');
const Email = require('./../db/model/Emails');
router.get('/getAllDataCoronaByDate', async (req,res) => {
    try {
        let {date} = req.query; 

        let getData = await Countries.find({date});

        res.json({
            data : getData,
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
        let getData = await Countries.findOne({date,countryName : nameCountry});
        
        if(getData) {
            res.json({
                msg : getData,
                status : 200
            })
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

router.get(`/sendEmail`,(req,res) => {
    try {
        let {email} = req.query;
        let addEmail = new Email({
            email
        });
        addEmail.save();
        res.json({status : 200});
    } catch (error) {
        res.json({status : 501})

    }
})

module.exports = router;