const mongoose = require('mongoose')

const connect = async () => {
    try{
       await mongoose.connect('mongodb://superuser:superuser1@ds019856.mlab.com:19856/todo-db', { useNewUrlParser: true, useUnifiedTopology: true })
    }catch(err){
        console.error('error connecting to mongodb')
        console.error(err)
    }
}

module.exports.connect = connect