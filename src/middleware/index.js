/*index.js
 *
 *author: jasmine pazer
 *description: error checking requirements
 */

var requiresLogin = function (req, res, next) {
  //redirects if no one is logged in
  if (!req.session.account) {
    return res.redirect('/');
  }
  next();
};

var requiresLogout = function (req, res, next) {
  //redirects if someone is still logged in
  if (req.session.account) {
    return res.redirect('/main');
  }
  next();
};

var requiresSecure = function (req, res, next) {
  //redirects to a secure connection
  if (req.headers['x-forwarded-proto'] != 'https') {
    return res.redirect('https://' +req.hostname + req.url);
  }
  next();
};

var bypassSecure = function (req, res, next) {
  //used when testing locally
  next();
};

module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;


//this espablishes when it is local or online
if (process.env.NODE_ENV === "production") {
  module.exports.requiresSecure = requiresSecure;
}else{
  module.exports.requiresSecure = bypassSecure;
}
