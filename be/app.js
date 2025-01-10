const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const authRoutes = require('./routes/authRoute');
const dataFetchRoute = require("./routes/dataFetchRoute.js")

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB', err);
}); 

const port = process.env.PORT || 3000

// Routes
app.use('/auth', authRoutes); // Authentication routes
app.use("/", dataFetchRoute)


app.listen(port, async() => {
    console.log("server is running")
})