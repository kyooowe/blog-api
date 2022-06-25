const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

require('dotenv').config()

app.use(cors())
app.use(express.json())

//#region Database
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connected to Database'))
//#endregion

//#region Auth Routes
const authRoutes = require('./routes/authRoutes')
app.use('/api/auth', authRoutes)
//#endregion

//#region Blog Routes
const blogRoutes = require('./routes/blogRoutes')
app.use('/api/blog', blogRoutes)
//#endregion

app.listen(process.env.PORT || 3001, () => console.log('Server started'))