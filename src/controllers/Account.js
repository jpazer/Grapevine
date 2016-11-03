/*Account.js
 *
 *author: jasmine pazer
 *description: handles rendering the right pages for login and signup, 
 *             and account creation and authentication
 *
 *reqires: models/Account.js
 */

var models = require('../models');

var Account = models.Account;

var helpPage = function (req, res) {
  //render the help page
  res.render('help', {csrfToken: req.csrfToken()});
};

var loginPage = function (req, res) {
  //render the login page
  res.render('login', {csrfToken: req.csrfToken()});
};

var signupPage = function (req, res) {
  //render the signup page
  res.render('signup', {csrfToken: req.csrfToken()});
};

var logout = function (req, res) {
  //log out of this account and redirect to root/login page
  req.session.destroy();
  res.redirect('/');
};

var login = function (req, res) {
  //login error checking and logic, redirects to the main page
  if (!req.body.username || !req.body.pass) {
      return res.status(400).json({error: "All fields required!"});
  }
  Account.AccountModel.authenticate(req.body.username, req.body.pass, function (err, account) {
    if (err || !account) {
        return res.status(401).json({error: "Wrong username or password"});
    }

    req.session.account = account.toAPI();

    res.json({redirect: '/main'});
  });
};

var signup = function (req, res) {
  //signup error checking and logic, redirects to main page
  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({error: "All fields required!"});
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({error: "Passwords do not match!"});
  }


  Account.AccountModel.generateHash(req.body.pass, function (salt, hash) {
    var accountData = {
      username: req.body.username,
      salt: salt,
      password: hash,
    };

    var newAccount = new Account.AccountModel(accountData);

    newAccount.save(function (err) {
      if (err) {
        console.log(err);
          return res.status(400).json({error: "An error occurred"});
      }
      req.session.account = newAccount.toAPI();
      res.json({redirect: '/main'});
    });

  });
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signupPage = signupPage;
module.exports.signup = signup;
