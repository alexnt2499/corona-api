const mongoose = require('mongoose');

const Views = new mongoose.Schema({ 
    views : {
        type : Number,
        default : 0
    },
    name : {
        type : 'String',
        default : 'corona'
    }
    


})

module.exports = mongoose.model('views',Views);