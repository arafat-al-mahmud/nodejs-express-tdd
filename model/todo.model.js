const mongoose = require('mongoose')

const TodoSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    done: {
        type: Boolean,
        required: true
    }
})

const todoModel = mongoose.model("Todo", TodoSchema)

module.exports = todoModel;