const express = require('express')
const path = require('path')
const userRoute = require('./routes/user');
const mongoose = require('mongoose');

// const {} = require('dotenv')

const app = express();
const PORT =8000

mongoose.connect('mongodb+srv://rohan:pass123@cluster0.ucvjgur.mongodb.net/?appName=Cluster0').then(console.log("DB connected")).catch();

app.set('view engine', 'ejs')
app.set('views',path.resolve("./views"))

app.use(express.urlencoded({extended: false}))


app.get('/', (req,res)=>{
    res.render("home")
})

app.use('/user',userRoute)

app.listen(PORT, ()=> console.log(`Server started at ${PORT}`))
