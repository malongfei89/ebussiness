const app = require('express')()
const bodyparser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
app.listen(process.env.PORT, ()=>{
    console.log(`listen at ${process.env.PORT}`)
})
app.use(bodyparser)
app.use(cors)