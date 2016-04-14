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
    unique:true,
    trim: true,
    set: setName
  },

  cards: [mongoose.Schema.Types.Mixed],

  currentIteration: {
    type: Number,
    default: 0
  },

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

  ownerUsername: {
    type: String,
    required: true
  },

  createdData: {
    type: Date,
    default: Date.now
  }
});

GameSchema.methods.toAPI = function () {
  return {
    card: this.cards[this.currentIteration],
    curItr: this.currentIteration,
    maxItr: this.maxIterations,
    owner: this.owner,
    ownerUsername: this.ownerUsername,
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

GameSchema.statics.findByName = function (name, ownerId, callback) {
  var search = {
    owner: mongoose.Types.ObjectId(ownerId),
    name: name
  };
  return GameModel.find(search).select().exec(callback);
};

GameModel = mongoose.model("Game", GameSchema);

module.exports.GameModel = GameModel;
module.exports.GameSchema = GameSchema;
