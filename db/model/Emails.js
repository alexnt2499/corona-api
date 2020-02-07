const mongoose = require('mongoose');

const Email = new mongoose.Schema({ 
    email:  {
        type : String,
        required : true,
        unique : true
    },
    

})

module.exports = mongoose.model('emails',Email);
