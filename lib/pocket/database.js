var path = require('path')
  , fs = require('fs')
  , util = require('util')
  , Collection = require('./collection');


function Database(path) {
  this._path = path;
}

Database.prototype.collection = function(name, callback) {
  var coll = new Collection(name, this._path);
  callback(null, coll);
}


Database.prototype.open = function(callback) {
  var self = this;
  this.exists(function(exists) {
    if (!exists) { callback(new Error("File does not exist '" + self._path + "'")); }
    callback();
  });
}

Database.prototype.create = function(callback) {
  fs.mkdir(this._path, 0755, function(err) {
    if (err) { return callback(err); }
    callback();
  });
}

Database.prototype.exists = function(callback) {
  path.exists(this._path, callback);
}


module.exports = Database;
