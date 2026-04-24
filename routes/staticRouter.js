const express = require('express');
const router = express.Router();
const URL = require("../models/url");

router.get('/', async (req,res)=>{
    const allurls = await URL.find({});
    
    return res.render('home',{
        urls: allurls,
        id: req.query.id   // 👈 ye missing tha
    });
});
module.exports = router;