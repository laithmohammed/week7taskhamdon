// Dependencies
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Joi = require('joi')
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../module/user');

router.get('/',(req,res)=>{
    if(!req.session.user){
        res.setHeader("Content-Type", "text/html");
        res.send(`
            <form method="post" action="/register">
                <input type="text" name="username" placeholder="username"><br/>
                <input type="email" name="email" placeholder="email"><br/>
                <input type="number" name="phone" placeholder="phone"><br/>
                <input type="password" name="password" placeholder="password"><br/>
                <input type="password" name="repassword" placeholder="re-password"><br/>
                <span></span>
                <input type="submit" value="register">
            </form>
        `);
    }else{
        res.redirect('/')
    }
})

router.post('/',(req,res)=>{
    if(!req.session.user){
        const valid = Validating(req.body);
        if(valid.error || req.body.password !== req.body.repassword){
            let errvalid = '';
            if(valid.error){ valid.error.details.map((index)=>{return errvalid = index.message}) }
            let errpass = '';
            if(!valid.error){ errpass = "your password is not match"; }
            res.status(400)
            res.setHeader("Content-Type", "text/html");
            res.send(`
                <form method="post" action="/register">
                    <input type="text" name="username" placeholder="username" value="${req.body.username}"><br/>
                    <input type="email" name="email" placeholder="email" value="${req.body.email}"><br/>
                    <input type="number" name="phone" placeholder="phone" value="${req.body.phone}"><br/>
                    <input type="password" name="password" placeholder="password"><br/>
                    <input type="password" name="repassword" placeholder="re-password"><br/>
                    <span>${ errvalid + errpass }</span><br/>
                    <span></span>
                    <input type="submit" value="register">
                </form>
            `);
        }else {
            bcrypt.genSalt(10).then(salt => {
                bcrypt.hash(req.body.password, salt).then(hashed => {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        username:req.body.username,
                        email   :req.body.email,
                        phone   :req.body.phone,
                        password:hashed
                    });
                    user.validate().then(rslt=>{
                        user.save()
                        .then( rslt =>{
                            req.session.user = {};
                            req.session.user.id = rslt._id;
                            req.session.user.username = rslt.username;
                            const token = jwt.sign({id: rslt._id, exp: Date.now() + 1000 * 10 }, 'fikracamps')
                            req.session.user['X-auth-token'] = token;
                            res.redirect('/')
                        }).catch(err => {
                            console.log(err);
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    });
                })
            });
        }
    }else{
        res.redirect('/')
    }
})

// To validate the POST requestes
function Validating(user) {
    const newuserSchema = {
        'username': Joi.string().min(3).required().label("Userame"),
        'email'   : Joi.string().min(7).email({ minDomainAtoms: 2 }).required().label("Email"),
        'phone'   : Joi.string().min(10).max(16).required().label("Phone"),
        'password': Joi.string().min(8).max(30).required().label("Password"),
        'repassword':Joi.string()
    }
    return Joi.validate(user, newuserSchema);
}
//  Expoting the router so app.js can use it in a MiddleWare
module.exports = router;