// Dependencies
const express = require('express');
const router = express.Router();
var jwt = require('jsonwebtoken');
var Joi = require('joi')
const bcrypt = require('bcrypt');
const User = require('../module/user');

router.get('/',(req,res)=>{
    if(!req.session.user){
        res.send(`
            <form method="post" action="/login">
                <input type="text" name="username" placeholder="username"><br/>
                <input type="password" name="password" placeholder="password"><br/>
                <input type="submit" value="login">
            </form>
        `)
    }else{
        res.redirect('/')
    } 
})
router.post('/',(req,res)=>{
    if(!req.session.user){
        const valid = Validating(req.body);
        let error = '';
        let permit;
        let user = {};
        if(valid.error){
            error += valid.error.details.map((index)=>{return errvalid = index.message});
            res.send(`
                <form method="post" action="/login">
                    <input type="text" name="username" placeholder="username" value="${req.body.username}"><br/>
                    <input type="password" name="password" placeholder="password"><br/>
                    <input type="submit" value="login"><br/>
                    <span>${error}</span>
                </form>
            `)
        }else{
            User.find()
            .where('username')
            .eq(req.body.username)
            .select({username: 1, _id: 1,  password : 1})
            .then(result=>{
                user = result[0];
                if(result[0]){
                    bcrypt.compare(req.body.password, user.password, function(err, value) {
                        if(value){
                            req.session.user = {};
                            req.session.user.username = user.username;
                            req.session.user.id = user._id;
                            const token = jwt.sign({id: user._id, exp: Date.now() + 1000 * 10 }, 'fikracamps')
                            req.session.user['X-auth-token'] = token;
                            res.redirect('/')
                        }else{ 
                            error += "<br>invalid username / password pair";
                            res.send(`
                                <form method="post" action="/login">
                                    <input type="text" name="username" placeholder="username" value="${req.body.username}"><br/>
                                    <input type="password" name="password" placeholder="password"><br/>
                                    <input type="submit" value="login">
                                    <span>${error}</span>
                                </form>
                            `)
                        }
                    });
                }else{ permit = false;error += "<br>invalid username / password pair";}
                if(permit === false){
                    console.log(2)
                    res.send(`
                        <form method="post" action="/login">
                            <input type="text" name="username" placeholder="username" value="${req.body.username}"><br/>
                            <input type="password" name="password" placeholder="password"><br/>
                            <input type="submit" value="login">
                            <span>${error}</span>
                        </form>
                    `)
                }
            }).catch(err => {
                res.status(400).send(err)
            })
        }
    }else{
        res.redirect('/')
    } 
})

// To validate the POST requestes
function Validating(user) {
    const userSchema = {
        'username': Joi.string().required().label("Username"),
        'password': Joi.string().min(8).max(30).required().label("Password"),
    }
    return Joi.validate(user, userSchema);
}

//  Expoting the router so login.js can use it in a MiddleWare
module.exports = router;