const express = require('express');
const app = express();
const router = require('./routes/todo.routes')
const mongodb = require('./mongodb/mongodb.connect')

mongodb.connect()

app.use(express.json())

app.use('/todos', router)

app.use((error, req, res, next) => {

    res.status(500).json({message: error.message})
})

app.get('/', (req, res) => res.json("Hello World!"))

module.exports = app;