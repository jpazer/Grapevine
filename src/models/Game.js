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

  cardType: {
    type:String,
  },

  cards: [String],

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

  users: [mongoose.Schema.Types.Mixed],

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
    cardType: this.cardType,
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

GameSchema.statics.findByName = function (name, callback) {
  var search = {
    name: name
  };
  return GameModel.find(search).select().exec(callback);
};

GameSchema.statics.getByName = function (name, callback) {
  var search = {
    name: name
  };
  return GameModel.find(search).exec(callback);
};

GameSchema.statics.returnAll = function (callback) {
  var search = {};
  return GameModel.find(search).select().exec(callback);
}

GameModel = mongoose.model("Game", GameSchema);

module.exports.GameModel = GameModel;
module.exports.GameSchema = GameSchema;
