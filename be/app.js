const express = require('express')
const app = express()
const dataFetchRoute = require("./routes/dataFetchRoute.js")
const cors = require('cors')

const port = 3005

app.use(cors());

const url = 'https://randomuser.me/api/'

app.use("/", dataFetchRoute)

app.listen(port, async() => {
    console.log("server is running")
})