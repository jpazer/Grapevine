var _ = require('underscore');
var models = require('../models');

var Domo = models.Domo;

var makerPage = function(req, res) {
  Domo.DomoModel.findByOwner(req.session.account._id, function(err, docs) {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: "An error occurred"
      });
    }
    docs.sort(function(a, b) {
      return parseFloat(a.age) - parseFloat(b.age);
    });
    res.render('app', {
      csrfToken: req.csrfToken(),
      domos: docs
    });
  });
};

var makeDomo = function(req, res) {
  if (!req.body.name || !req.body.age || !req.body.color) {
    return res.status(400).json({
      error: "RAWR! Both name, age and color are required!"
    });
  }

  var domoData = {
    name: req.body.name,
    age: req.body.age,
    color: req.body.color,
    owner: req.session.account._id
  };

  console.log(req.body.color);

  var newDomo = new Domo.DomoModel(domoData);

  newDomo.save(function(err) {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: "An error occurred"
      });
    }
    res.json({  redirect: '/maker'  });
  });
};

var deleteDomo = function(req, res) {
    Domo.DomoModel.deleteByName(req.body.name, function (err, docs) {
      if (err){
        console.log(err);
      }
    });
   res.json({redirect: '/maker'});

};

module.exports.makerPage = makerPage;
module.exports.make = makeDomo;
module.exports.delete = deleteDomo;
