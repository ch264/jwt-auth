const 
  bcrypt = require('bcrypt'),
  db = require('../models'),
  jwt = require('jsonwebtoken')

module.exports = {
  // 5. I am at /signup route
    signup : (req, res) => {
        console.log(req.body);
        // Check database to see if email is already in db
        db.User.find({email: req.body.email})
          .exec()
          .then( user => {
            // if a user is found with that email
            if (user.length >= 1) {
              // send an error and let the user know that the email already exists, send 409 to frontend. If JSON receives message, it can display it
              return res.status(409).json({
                message: "email already exists"
              })
            // if we don't find/have this user's email in our db, lets get them set up!
            } else {
              // lets hash our plaintext password, hash password with difficulty of 10 (standard level of encryption). bcrypt encrypts the password
              bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err){ 
                  console.log("hashing error:", err);
                  res.status(200).json({error: err}) // send error to frontend
                // we now have a successful hashed password
                } else {
                  // if no error we are create a User object with their email address and OUR hashed password
                  db.User.create({
                    email: req.body.email,
                    password: hash // hashed password goes into database
                  }, (err, newUser) => {
                      console.log('here is the result',newUser)
                    // if(err){ return res.status(500).json({err})}
                    // we send our new data back to user or whatever you want to do. we create a user to include what we want to store in our jwt
                    let user ={
                      email: newUser.email,
                      _id: newUser._id
                    } 
                  // this token is valid for one hour, then it signs this user out
                  jwt.sign(
                      user,
                      // waffles is our secret key that signs the jwt. encrypt waffles in b64 and insert secret key
                      "waffles",
                      {
                        // its good practice to have an expiration amount for jwt tokens.
                        expiresIn: "1h"
                      },
                      // this is our response res.json that holds our message user and jwt token. we need token on frontend to save to local storage
                      (err, signedJwt) => {
                      res.status(200).json({
                        message: 'User Created',
                        // send user data so res on frontend can receive information
                        user,
                        signedJwt
                      })
                    });
                    // send success back to user, along with a token.
                  })
                }
              })
            }
          })
          // catch function just in case something fails
          .catch( err => {
            console.log(err);
            res.status(500).json({err})
          })
      },
      // 2b.
    login: (req, res) => {
        console.log("LOGIN CALLED");
        // find the user in our user db with this email
        console.log("body", req.body)
        db.User.find({email: req.body.email})
          // make sure that password is removed from db search results, define in user model user.js.
          // once we found user we add password back. we toggled password off and now we toggle it back on because we need access to password to login the user
          .select('+password')
          .exec()
          // if we have found a user
          .then( users => {
            // if there is not email in our db
            console.log("USERS: ", users);
            // if user does not exist or the email is incorrect
            if(users.length < 1) {
              return res.status(401).json({
                message: "Email/Password incorrect" // important to deter hackes 
              })
            }
            // we have an email in our db that matches what they gave us
            // now we have to compare their hashed password to what we have in our db
            console.log("body", req.body);
            console.log("hash", users[0].password);
            // encrypt passowrd, both passwords are reencrypted and check if they match
            bcrypt.compare(req.body.password, users[0].password, (err, match) => {
              console.log(match)
              // If the compare function breaks, let them know
              if(err){console.log(err);return res.status(500).json({err})}
              // If match is true (their password matches our db password)
              if(match){
                console.log("MATCH: ", match)
                // create a json web token

                let user ={
                  email: users[0].email,
                  _id: users[0]._id
                } 
                jwt.sign(
                  user,
                  "waffles",
                  {
                    // its good practice to have an expiration amount for jwt tokens.
                    expiresIn: "1h"
                  },
                  (err, signedJwt) => {
                  res.status(200).json({
                    message: 'Auth successful',
                    user,
                    signedJwt
                  })
                });
              // if the password provided does not match the password on file, send error
              } else {
                console.log("NOT A MATCH")
                res.status(401).json({message: "Email/Password incorrect"})
              }
            })
      
      
          })
          // its good practice to have an additional catch, in case of errors
          .catch( err => {
            console.log("OUTSIDE ERROR_")
            console.log(err);
            res.status(500).json({err})
          })
        },
        //11. once hits show, req, is a big object that we can parse. we add key value pair on req object and we can access the user ID here because it was carried over
    show: (req,res)=>{
      console.log('trigger Show', req.userId)
      // 12. if userID in that token, here is the user information, send it back to frontend. go back to user.js
      // id is now part of req and we can use it
      if(req.userId){
        db.User.findById(req.userId, (err, foundUser)=>{
          res.json(foundUser)
        })
      } else {
        res.json('No user Id provided')
      }
      
    },
    delete: (req, res) => {
        console.log("hitting delete");
        db.User.deleteOne({_id: req.params.userId}, (err, result) =>{
          if(err){return res.status(500).json({err})}
          res.status(200).json({result})
        })
      }
}