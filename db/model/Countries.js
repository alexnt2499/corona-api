const mongoose = require('mongoose');

const Countries = new mongoose.Schema({ 
    countryName:  {
        type : String
    },
    data : {
        
                type : Object
       
    },
    date : {
        type : 'String'
    }

})

module.exports = mongoose.model('countries',Countries);
