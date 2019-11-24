localStorage.length > 0 ? console.log(localStorage) : console.log('no local storage');

let loggedIn ;
let user ;

checkForLogin();

$('a#logout').on('click', handleLogout);

$('#login').on('click', showLogin)

$('#signup').on('click', showSignup)

$('#signupForm').on('submit', submitSignup)

$('#loginForm').on('submit', submitLogin)

// 1a login
function checkForLogin(){
  if(localStorage.token){
    $.ajax({
      type: "GET", 
      url: '/user',  
      beforeSend: function (xhr) {  
          // set authorisation header, instead of req, for backend to break apart token 
          xhr.setRequestHeader("Authorization", 'Bearer '+ localStorage.token);
      }
      // same as on success
    }).done(function (response) {
      console.log(response)
      // if you do req to user, go to routes and userController
      user = { email: response.email, _id: response._id }
      console.log("you can access variable user: " , user)
        $('#message').text(`Welcome, ${ response.email } `)
        // same as on error
    }).fail(function (err) { 
        console.log(err);
    });
    // toggle clases
    $('#yesToken').toggleClass('show');
  } else {
    $('#noToken').toggleClass('show');
  }
}

function handleLogout(e) {
  e.preventDefault();
  console.log("LOGGED OUT")
  delete localStorage.token;
  $('#yesToken').toggleClass('show');
  $('#message').text('Goodbye!')
  user = null;
  checkForLogin();
}

function showLogin(e){
  e.preventDefault();
  console.log('login clicked.')
  $('#loginForm').toggleClass('show')
}

function showSignup(e){
  e.preventDefault();
  console.log('signup clicked.')
  $('#signupForm').toggleClass('show')
}

// 6. frontend, grab form and serialize it to send to the backend
function submitSignup(e){
  e.preventDefault();
  let userData = $(this).serialize()
  $.ajax({
    method: "POST",
    url: "/user/signup",
    data: userData,
    // always 3 error levels
    error: function signupError(e1,e2,e3) {
      console.log(e1);
      console.log(e2);
      console.log(e3);
    },
    // 7. run success
    success: function signupSuccess(json) {
      console.log(json);
      // send user object as part of response
      user = json.user
      // take token and save in local storage under the name token.
      localStorage.token = json.signedJwt;
      // make things appear in DOM as part of response
      $('#signupForm').toggleClass('show');
      $('#noToken').toggleClass('show');
      // run checkforLogin function, defined above
      checkForLogin();

    }

  })
}

function submitLogin(e){
  e.preventDefault();
  console.log("LOGIN FORM SUBMITTED")
  let userData = $(this).serialize()
  console.log("LOGIN: ", userData)
  $.ajax({
    method: "POST",
    url: "/user/login",
    data: userData,
  }).done(function signupSuccess(json) {
    console.log("LOG IN SUCCESSFUL")
    console.log(json);
    localStorage.token = json.signedJwt;
    $('#noToken').toggleClass('show')
    $('#loginForm').toggleClass('show')
    checkForLogin();
  }).fail(function signupError(e1,e2,e3) {
    console.log(e2);
  })
}