const express = require('express')
const path = require('path')
const userRoute = require('./routes/user');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middleware/authentication');

// const {} = require('dotenv')

const app = express();
const PORT =8000

mongoose.connect('mongodb+srv://rohan:pass123@cluster0.ucvjgur.mongodb.net/?appName=Cluster0').then(console.log("DB connected")).catch();

app.set('view engine', 'ejs')
app.set('views',path.resolve("./views"))

// middlewares
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(checkForAuthenticationCookie("token"))

app.get('/', (req,res)=>{
    return res.render("home",{
        user : req.user
    })
})

app.use('/user',userRoute)

app.listen(PORT, ()=> console.log(`Server started at ${PORT}`))
