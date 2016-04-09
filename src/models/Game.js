var mongoose = require('mongoose');
var _ = require('underscore');

var GameModel;

var setName = function (name) {
  return _.escape(name).trim();
};

var GameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName
  },

  cards: [mongoose.Schema.Types.Mixed],

  currentIteration: Number,

  maxIterations: {
    type: Number,
    required: true,
    min: 1,
    max: 100,
    trim: true
  },

  users: [mongoose.Schema.ObjectId],

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account'
  },

  createdData: {
    type: Date,
    default: Date.now
  }
});

GameSchema.methods.toAPI = function () {
  return {
    cards: this.cards,
    curentIteration: this.currentIteration,
    maxIterations: this.maxIterations,
    owner: this.owner,
    createdData: this.createdData
  };
};

GameSchema.statics.findByOwner = function (ownerId, callback) {
  var search = {
    owner: mongoose.Types.ObjectId(ownerId)
  };
  return GameModel.find(search).select().exec(callback);
};

GameSchema.statics.deleteByName = function (name, callback) {
  var search = {
    name: name
  };
   GameModel.find(search).remove().exec(callback);
};

GameModel = mongoose.model("Game", GameSchema);

module.exports.GameModel = GameModel;
module.exports.GameSchema = GameSchema;
