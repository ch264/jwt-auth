const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/jwt-auth',
  { useNewUrlParser: true })

module.exports.User = require('./user')
