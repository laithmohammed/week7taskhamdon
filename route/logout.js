// Dependencies
const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
    req.session.destroy(function(){
        res.redirect('/');
    });
})
router.post('/',(req,res)=>{
    req.session.destroy(function(){
        res.redirect('/');
    });
})

//  Expoting the router so logout.js can use it in a MiddleWare
module.exports = router;