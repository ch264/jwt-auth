const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: { 
    type: String, 
    // put required so that mongoose and mongod and express, it will not create a db entry if email is not there.
    required: true, 
    // if user is in db, do not create duplicate
    unique: true, 
    // this is regex: it checks the format of the email
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ ,
    }, 
    // if you search for user in db, the password is not available with select: false. in user login (userController.js) we have .select('+password")
  password: { type: String, required: true , select: false}

})

// this will make sure that when user is sent out from databse,  the password will also not be send. extra check to delete password out and make users more secure in database, if somebody pulls out data
userSchema.set('toJSON', {
  transform: function(doc, ret, opt) {
      delete ret['password']
      return ret
  }
})

module.exports = mongoose.model('User', userSchema);