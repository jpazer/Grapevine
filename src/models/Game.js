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

  iterationsLeft: {
    type: Number,
    required:true
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
  },

  lastUpdated: {
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
  //returns all of the models whose owner has this ownerId
  var search = {
    owner: mongoose.Types.ObjectId(ownerId)
  };
  return GameModel.find(search).select().exec(callback);
};

GameSchema.statics.deleteByName = function (name, callback) {
  //deletes the game with this name
  var search = {
    name: name
  };
   GameModel.find(search).remove().exec(callback);
};

GameSchema.statics.findByName = function (name, callback) {
  //returns the game with this name
  var search = {
    name: name
  };
  return GameModel.find(search).select().exec(callback);
};

GameSchema.statics.findByParticipatingUser = function (id, callback) {
  //returns games that this id has participated in
  var search = {
    users: id
  };
  return GameModel.find(search).select().exec(callback);
};

GameSchema.statics.returnAvailable = function (id, callback) {
  //returns all games that's owner isn't this id, this id hasn't participated in, and have not yet finished
  var search = {
    owner: {$ne: id},
    users: {$ne: id},
    iterationsLeft: {$ne: 0}
  };
  return GameModel.find(search).select().exec(callback);
};

GameModel = mongoose.model("Game", GameSchema);

module.exports.GameModel = GameModel;
module.exports.GameSchema = GameSchema;
