const mongoose = require('mongoose');

const Countries = new mongoose.Schema({ 
    list : {
        type : [
            {
                type : Object
            }
        ]
    },
    date : {
        type : 'String'
    }

})

module.exports = mongoose.model('countries',Countries);
