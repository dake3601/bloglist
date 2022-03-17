const express = require('express')
const app = express()
const cors = require('cors')
const blogSchema = require('./controllers/blogs')

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogSchema)

module.exports = app
