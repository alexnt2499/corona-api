let URI = 'mongodb+srv://subee:subee123@cluster0-uppre.mongodb.net/test?retryWrites=true&w=majority';
const mongoose = require('mongoose');
module.exports = () => {
    try {
        mongoose.connect(URI, {useNewUrlParser: true , useUnifiedTopology: true},(err) => {
            if(err) throw console.log(err);
            console.log('Mongodb connected');
        });
    } catch (error) {
        console.log(error);
    }
}