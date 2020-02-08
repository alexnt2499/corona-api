const mongoose = require('mongoose');

const Provinces = new mongoose.Schema({ 
    city:  {
        type : String
    },
    data : {
        
                type : Object
       
    },
    date : {
        type : 'String'
    }

})

module.exports = mongoose.model('provinces',Provinces);