var controllers = require('./controllers');
var mid = require('./middleware');

var router = function (app) {
  app.get("/login", mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post("/login", mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.get("/signup", mid.requiresSecure, mid.requiresLogout, controllers.Account.signupPage);
  app.post("/signup", mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get("/logout", mid.requiresLogin, controllers.Account.logout);
  app.get("/account", mid.requiresLogin, controllers.Account.viewAccount);
  app.get("/main", mid.requiresLogin, controllers.Game.mainPage);
  app.get("/make", mid.requiresLogin, controllers.Game.makePage);
  app.post("/make", mid.requiresLogin, controllers.Game.make);
  app.post("/delete", mid.requiresLogin, controllers.Game.delete);
  app.get("/", mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
