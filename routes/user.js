const 
  express = require('express'),
  app = express(),
  router = express.Router(),
  jwt = require('jsonwebtoken'),
  controllers = require('../controllers')

  // 2. access controllers. this is actually /user/signup because /user is already defined in route. so here we only need the /signup extension
router.post('/signup', controllers.user.signup);
  // 5. look at userController.js
router.post('/login', controllers.user.login)

//13. middleware for routes (we alter req and send it forward), part of routes functionality, there is token, server pulls out userID, and pass its in the next routes, so all next routes 
router.use((req, res, next) => {
  console.log('activated')
  const bearerHeader = req.headers['authorization'];
  console.log('triggered token check', bearerHeader)

  // 3. is there a token? This triggers for anything past signup and login
  // check if toke, pull user apart and pass it to show part of site/ Is bearer there or not?
  if(typeof bearerHeader !== 'undefined'){
    const bearer = bearerHeader.split(' ');
    // 9. take secret key, is token signed and verified? once verified bust it open. 
    const bearerToken = bearer[1];
    req.token = bearerToken;
    // 4. set secret word
    let verified = jwt.verify(req.token, 'waffles');
    console.log('here is the verified', verified)
    // crack open jwt and we have user_id. pass on to route by adding user_id to req
    // instead of sending it via url, break apart and add to req and its never sent on user side.
    req.userId = verified._id //add id to user through dot notation into req object, and set user id for routes to use
    // 10. next is function called after this. take all information, store it and go to routes. go to controllers
    // everything we can transpire, pass the object to the next route.
    next();
  } 
  else {
    res.sendStatus(403);
  }
})

router.get('/', controllers.user.show)

router.delete('/', controllers.user.delete)


  



module.exports = router;