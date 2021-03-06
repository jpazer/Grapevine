/*Account.js
 *
 *author: jasmine pazer
 *description: account schema and model with authentication and search functions
 */

var crypto = require('crypto');
var mongoose = require('mongoose');

var AccountModel;
var iterations = 10000;
var saltLength = 64;
var keyLength = 64;

var AccountSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        match: /^[A-Za-z0-9_\-\.]{1,16}$/
    },

	salt: {
		type: Buffer,
		required: true
	},

    password: {
        type: String,
        required: true
    },

    createdData: {
        type: Date,
        default: Date.now
    }

});

//_id is built into your mongo document and is guaranteed to be unique
AccountSchema.methods.toAPI = function() {
    return {
        username: this.username,
        _id: this._id
    };
};

//checks if this password is useable
AccountSchema.methods.validatePassword = function(password, callback) {
	var pass = this.password;

	crypto.pbkdf2(password, this.salt, iterations, keyLength, function(err, hash) {
		if(hash.toString('hex') !== pass) {
			return callback(false);
		}
		return callback(true);
	});
};

//returns an account by username
AccountSchema.statics.findByUsername = function(name, callback) {
    var search = {
        username: name
    };
    return AccountModel.findOne(search, callback);
};

//returns the hash of a password
AccountSchema.statics.generateHash = function(password, callback) {
	var salt = crypto.randomBytes(saltLength);

	crypto.pbkdf2(password, salt, iterations, keyLength, function(err, hash){
		return callback(salt, hash.toString('hex'));
	});
};

//authenticates a users username and password to log them into their account
AccountSchema.statics.authenticate = function(username, password, callback) {
	return AccountModel.findByUsername(username, function(err, doc) {
		if(err){
			return callback(err);
		}
        if(!doc) {
            return callback();
        }

        doc.validatePassword(password, function(result) {
            if(result === true) {
                return callback(null, doc);
            }
            return callback();
        });
	});
};

AccountModel = mongoose.model('Account', AccountSchema);

module.exports.AccountModel = AccountModel;
module.exports.AccountSchema = AccountSchema;
