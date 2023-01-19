

const mongoose = require("mongoose")
require('dotenv').config()
mongoose.set('strictQuery',true)
const connections = mongoose.connect(process.env.MONGO_URL)

module.exports = { connections }