var _ = require('underscore');
var models = require('../models');

var Game = models.Game;
var errmsg = "";

var mainPage = function(req, res) {
  //renders main page with games that are available to contribute to
  Game.GameModel.returnAvailable(req.session.account._id, function(err, docs) {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: "An error occurred"
      });
    }
    docs.sort(function(a, b) {
      return new Date(b.lastUpdated) - new Date(a.lastUpdated);
    });
    res.render('app', {
      csrfToken: req.csrfToken(),
      games: docs
    });
  });
};

var viewAccount = function (req, res) {
  //renders My Games/Account page with games the user created and contributed to
  Game.GameModel.findByOwner(req.session.account._id, function(err, myGames) {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: "An error occurred"
      });
    }
    myGames.sort(function(a, b) {
      return new Date(b.lastUpdated) - new Date(a.lastUpdated);
    });

    Game.GameModel.findByParticipatingUser(req.session.account._id, function(err, participatedGames) {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: "An error occurred"
      });
    }
    participatedGames.sort(function(a, b) {
      return new Date(b.lastUpdated) - new Date(a.lastUpdated);
    });
    res.render('account', {myGames:myGames, participatedGames:participatedGames, account: req.session.account, csrfToken: req.csrfToken()});
    });
  });  
};

var makePage = function(req, res) {
    //render the page with the make game form
    res.render('make', {csrfToken: req.csrfToken()});
};

var makeGame = function(req, res) {
  //make a new game and redirect back to the My Games/Account page

  //check for all of the required fields
  if (!req.body.name || !req.body.maxItr || !req.body.startWords) {
    return res.status(400).json({
      error: "Both name, max iterations and start words are required."
    });
  }

  //make a object with all of the new data
  var gameData = {
    name: req.body.name,
    maxIterations: req.body.maxItr,
    iterationsLeft: req.body.maxItr,
    cardType: "string",
    cards: [req.body.startWords],
    owner: req.session.account._id,
    ownerUsername: req.session.account.username
  };

  //turn it into a GameModel and save it with smart error reporting
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
    res.json({  redirect: '/account'  });
  });
};

var showGame = function (req, res) {
  //find the game that was clicked on, and display the page corresponding to its current state
  Game.GameModel.findByName(decodeURI(req.params.name), function (err, docs) {
    if (err){
      console.log(err);
    }

    var game = docs[0];

    if(game.iterationsLeft === 0){ //finished game
      res.render('game_done', {game:docs, csrfToken: req.csrfToken()}); 
    }else if (game.owner == req.session.account._id){ //game the user created
      res.render('game_error', {error:"You can not contribute to a game you created.", csrfToken: req.csrfToken()}); 
    }else if (game.users.indexOf(req.session.account._id) > -1){ //game the user participated in
      res.render('game_error', {error:"You can only contribute to each game once.", csrfToken: req.csrfToken()}); 
    }else if (game.cardType == "string"){ //game where the next card should be a drawing
      res.render('game_draw', {game:docs, csrfToken: req.csrfToken()});
    }else if (game.cardType == "img"){ //game where next card should be a sentence
      res.render('game_type', {game:docs, csrfToken: req.csrfToken()});
    }
  });
};

var addCard = function(req, res) {
  //find and update the game with the new card and redirect to a the main page
  Game.GameModel.findByName(decodeURI(req.params.name), function(err,docs) {
    if (err) {
      console.log(err);
    }

    var game = docs[0];

    game.cardType = req.body.cardType;
    game.cards.push(req.body.newCard);
    game.users.push(req.session.account._id);
    game.currentIteration++;
    game.iterationsLeft--;
    game.lastUpdated = Date.now();
    game.save(function(err) {
      if (err){
        console.log(err);
      }
    });
    res.json({redirect: '/main'});

  });
};

var deleteGame = function(req, res) {
  //find a game by name and delete it (only available when you are the creator)
  Game.GameModel.deleteByName(req.body.name, function (err, docs) {
    if (err){
      console.log(err);
    }
  });
 res.json({redirect: '/account'});
};

module.exports.mainPage = mainPage;
module.exports.viewAccount = viewAccount;
module.exports.makePage = makePage;
module.exports.make = makeGame;
module.exports.showGame = showGame;
module.exports.addCard = addCard;
module.exports.delete = deleteGame;
