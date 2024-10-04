const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const dotenv = require('dotenv')
// console.log(process.env) //To check your enviorment
const authRoute = require('./routes/auth');
const jobRoute = require('./routes/job');
const fs = require('fs');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const cors = require('cors');
app.use(cors({
    origin: "*"
}));
dotenv.config();
// Middleware for all connections
app.use(bodyParser.urlencoded({ extended: false }))
app.get('/', (req, res) => {
    res.send('Hello World')
})
// app.use((req, res, next)=>{
//     console.log("Logged In:", Date.now())
//     console.log(req.method, req.url)
//     next()
// })

app.use('/v1/job', jobRoute);
app.use('/v1/auth', authRoute);

app.use((req, res, next)=>{
   const reqString = `${req.method} ${req.url} ${Date.now()}\n `
   fs.writeFile('log.txt', reqString,{flag: 'a'}, (err) => {
    if (err) {
        console.error('Error writing file:', err);
    } else {
        console.log('File written successfully');
    }
});
    next()
})
app.use((err, req, res, next) => {
    // Create a string with error details
    const reqString = `Error: ${err.message}\n`;
    // Write the error details to a file
    fs.writeFile('error.txt', reqString, { flag: 'a' }, (writeErr) => {
        if (writeErr) {
            console.error('Error writing file:', writeErr);
        }
    });
    // Pass the error to the next middleware (or default error handler)
    res.status(500).send('Something went wrong!');
    next();
});
app.listen(port, () => {
    mongoose.connect(process.env.MONGODB_URL)
        .then(() => console.log('Database Connected!'))
        .catch((err) => console.log(err))
    console.log('Server is running on port 3000');
})