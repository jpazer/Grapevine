/*router.js
 *
 *author: jasmine pazer
 *description: handles routing various ajax requests and page requests 
 *             to the appropriate pages and with appropriate requirements
 *
 *reqires: middleware/index.js
 *         controllers/Account.js
 *         controllers/Game.js
 */

var controllers = require('./controllers');
var mid = require('./middleware');

//routes urls to various functions
var router = function (app) { 
  app.get("/login", mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post("/login", mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.get("/signup", mid.requiresSecure, mid.requiresLogout, controllers.Account.signupPage);
  app.post("/signup", mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get("/logout", mid.requiresLogin, controllers.Account.logout);
  app.get("/account", mid.requiresLogin, controllers.Game.viewAccount);
  app.get("/main", mid.requiresLogin, controllers.Game.mainPage);
  app.get("/make", mid.requiresLogin, controllers.Game.makePage);
  app.post("/make", mid.requiresLogin, controllers.Game.make);
  app.get("/game/:name", mid.requiresLogin, controllers.Game.showGame);
  app.post("/addcard/:name", mid.requiresLogin, controllers.Game.addCard);
  app.post("/delete", mid.requiresLogin, controllers.Game.delete);
  app.get("/", mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
