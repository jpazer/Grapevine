var _ = require('underscore');
var models = require('../models');

var makerPage = function (req, res) {
  res.render('app');
};

module.exports.makerPage = makerPage;
