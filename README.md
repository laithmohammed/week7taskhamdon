# Laith Mohammed Saker
## engr.laith@gmail.com

Task Results

```js
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
```
