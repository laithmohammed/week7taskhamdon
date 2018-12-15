// dependencies
const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const registerRoute = require('./route/register');
const loginRoute = require('./route/login');
const logoutRoute = require('./route/logout');
var app = express();
//  Starting MongoDB connection
mongoose.connect('mongodb://recete:recete1@ds145369.mlab.com:45369/recete', { useNewUrlParser: true });
//  To Check if the connection works fine or not
mongoose.connection.on('connected', () => { console.log('\x1b[36m%s\x1b[0m', 'mongo has been connected...'); })
// MiddleWare
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    resave: true, // don't save session if unmodified, true => save, false => unsave
    saveUninitialized: false, // don't create session until something stored, true => create, false => bot create
    secret: 'shhhh, very secret' // Key
}));
// Route MiddleWare for any route that start with /register
app.use('/register', registerRoute);
// Route MiddleWare for any route that start with /login
app.use('/login', loginRoute);
// Route MiddleWare for any route that start with /logout
app.use('/logout', logoutRoute);
// at / path
app.get('/', (req, res) => {
    if(req.session.user['X-auth-token']){ // if there are session
        const decodeToken  = jwt.verify(req.session.user['X-auth-token'],'fikracamps'); // decode token and get expiry date of session
        if(Date.now() <= decodeToken.exp){ // if the date of this moment equel or less then expiry date of session
            res.setHeader("Content-Type", "text/html");
            res.send("hi, "+ req.session.user.username + "<br/><a href='logout'>logout</a>");
        }else{ // if the date of this moment greate then expiry date of session
            req.session.destroy(); // semove all session detailes
            res.setHeader("Content-Type", "text/html");
            res.send("access denied!<br/>try to <a href='login'>login</a> or <a href='register'>register</a>")
        }
    }else{ // if there are no session
        res.setHeader("Content-Type", "text/html");
        res.send("access denied!<br/>try to <a href='login'>login</a> or <a href='register'>register</a>")
    }
  })
// Starting the server
if(!module.parent){ // parent is a module => caused the script to be interprete
    app.listen(3000);
    console.log('server listening on port 3000')
}
/*
router.post('checKlogin', (req, res) => {
    //  check if there token is there
        //  you can check line 30 at app.js, token : req.session.user['X-auth-token']
    //  decode the token and chekc if it's validate
        // you can check line 31 at app.js,
    //  Get the payload from the jsonwebtoken
        // you can check line 32 at app.js,
    //  return('you are logged in')
        // you can check lines 33-34 at app.js,
    //  you have to login
        // you can check lines 41-42 at app.js,
});
router.post('login', (req, res) => {
    //  check if there is a user data (username & password) in the req body
        // you can check line 24 for Joi function and line 28 if ther are errors like empty username or password [at route/login.js]
    //  chekc if there is such username get the user info
        // you can check lines 39-42 and result at line 43 return array have one index or empty array [at route/login.js]
    //  check if the password valid
        // you can check line 46, by using "compare" function of "bcrypt" where value of callback function return as true if the password is equeled [at route/login.js]
    //  create a new token and send it back to the user
        // you can check lines 51-52, req.session.user['X-auth-token'] : token [at route/login.js]
});
*/