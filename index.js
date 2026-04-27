const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const {connectToMongoDB} = require('./connect');
const URL = require('./models/url');
const {restrictToLoggedinUserOnly,checkAuth} = require("./middlewares/auth");
const app = express();
const PORT = 8001;


//ROUTES////////////////////////////////////
const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");


connectToMongoDB('mongodb://localhost:27017/short-url')
.then(()=>console.log('Mongodb Connected'));

app.set("view engine" , "ejs");
app.set("views",path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({extended:false})); 
app.use(cookieParser()); 

app.use('/', checkAuth, staticRoute);
app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/user",userRoute);


app.get('/:shortId' , async (req,res)=>{
    const shortId = req.params.shortId;

    const entry = await URL.findOneAndUpdate(
        { shortId },
        {
            $push:{
                visitHistory:{
                    timestamp : Date.now(),
                }
            },
        }
    );

    if(!entry){
        return res.send("❌ Short URL not found");
    }

    res.redirect(entry.redirectURL);
});


app.listen(PORT, ()=>{
    console.log(`Server Started at Port : ${PORT}`);
});
