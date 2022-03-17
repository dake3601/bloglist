const config = require('./utils/config')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const blogSchema = require('./controllers/blogs')

console.log('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogSchema)

module.exports = app
