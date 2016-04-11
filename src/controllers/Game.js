var _ = require('underscore');
var models = require('../models');

var Game = models.Game;

var mainPage = function(req, res) {
  Game.GameModel.findByOwner(req.session.account._id, function(err, docs) {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: "An error occurred"
      });
    }
    docs.sort(function(a, b) {
      return parseFloat(a.createdData) - parseFloat(b.createdData);
    });
    console.log(docs);
    res.render('app', {
      csrfToken: req.csrfToken(),
      games: docs
    });
  });
};

var makePage = function(req, res) {
    res.render('make', {csrfToken: req.csrfToken()});
};

var makeGame = function(req, res) {
  console.log("in make game");
  if (!req.body.name || !req.body.maxItr || !req.body.startWords) {
    return res.status(400).json({
      error: "RAWR! Both name, max iterations and start words are required!"
    });
  }

  var gameData = {
    name: req.body.name,
    maxIterations: req.body.maxItr,
    cards: [req.body.startWords],
    owner: req.session.account._id,
    ownerUsername: req.session.account.username
  };

  var newGame = new Game.GameModel(gameData);

  newGame.save(function(err) {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: "An error occurred"
      });
    }
    res.json({  redirect: '/main'  });
  });
};

var deleteGame = function(req, res) {
    Game.GameModel.deleteByName(req.body.name, function (err, docs) {
      if (err){
        console.log(err);
      }
    });
   res.json({redirect: '/main'});
};

module.exports.mainPage = mainPage;
module.exports.makePage = makePage;
module.exports.make = makeGame;
module.exports.delete = deleteGame;
