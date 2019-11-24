const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const userRoutes = require('./routes/user')
const jwt = require('jsonwebtoken')


// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
})

// 1B. set up routes for login and signup. default route /user. when we go to to /user we have /signup and /login
app.use('/user', userRoutes);

app.listen( 3000, () => console.log("Listening on 3000"))