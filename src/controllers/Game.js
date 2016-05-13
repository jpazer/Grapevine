var _ = require('underscore');
var models = require('../models');

var Game = models.Game;
var errmsg = "";

var mainPage = function(req, res) {
  Game.GameModel.returnAll(function(err, docs) {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: "An error occurred"
      });
    }
    docs.sort(function(a, b) {
      return parseFloat(a.createdData) - parseFloat(b.createdData);
    });
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
      error: "Both name, max iterations and start words are required."
    });
  }

  var gameData = {
    name: req.body.name,
    maxIterations: req.body.maxItr,
    cardType: "string",
    cards: [req.body.startWords],
    owner: req.session.account._id,
    ownerUsername: req.session.account.username
  };

  var newGame = new Game.GameModel(gameData);

  newGame.save(function(err) {
    if (err) {
      console.log(err);
      if (err.code == 11000){
        errmsg = "Error: The name ''"+req.body.name + "'' is already in use.";
      }else if(err.name == 'ValidationError'){
        errmsg = "Error: Max Rounds must be a number between 1-100.";
      }else{
        errmsg =  "An error occurred";
      }
      return res.status(400).json({
        error: errmsg
      });
    }
    res.json({  redirect: '/main'  });
  });
};

var showGame = function (req, res) {
  console.log(req.params.name);

  Game.GameModel.findByName(decodeURI(req.params.name), function (err, docs) {
    if (err){
      console.log(err);
    }
    console.log(docs);

    var game = docs[0];
    if (game.cardType == "string"){
      res.render('game_draw', {game:docs, csrfToken: req.csrfToken()});
    }else if (game.cardType == "img"){
      res.render('game_type', {game:docs, csrfToken: req.csrfToken()});
    }
  });
};

var addCard = function(req, res) {
  Game.GameModel.getByName(decodeURI(req.params.name), function(err,docs) {
    if (err) {
      console.log(err);
    }
    

    var game = docs[0];

    game.cardType = req.body.cardType;
    

    game.cards.push(req.body.newCard);

    game.users.push([req.session.account._id, req.session.account.username]);

    game.currentIteration++;

    game.save(function(err) {
      if (err)
        console.log('error')
      else
        console.log('success')
    });

    
    res.json({redirect: '/main'});

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
module.exports.showGame = showGame;
module.exports.addCard = addCard;
module.exports.delete = deleteGame;
