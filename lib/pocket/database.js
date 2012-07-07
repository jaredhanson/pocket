var path = require('path')
  , fs = require('fs')
  , util = require('util')
  , Collection = require('./collection');


function Database(path, collections) {
  this._path = path;
  this._collections = collections;
}

Database.prototype.open = function(callback) {
  var self = this;
  this.exists(function(exists) {
    if (!exists) { callback(new Error("File does not exist '" + self._path + "'")); }
    
    var names = self._collections;
    var idx = 0;
    (function next() {
      var name = names[idx++];
      if (!name) { return callback(); } // done!
      
      self._collection(name, function(err, coll) {
        if (err) { return callback(err); }
        self[name] = coll;
        next();
      })
    })();
  });
}

Database.prototype.create = function(callback) {
  fs.mkdir(this._path, 0755, function(err) {
    if (err) { return callback(err); }
    callback();
  });
}

Database.prototype.exists = function(callback) {
  fs.exists(this._path, callback);
}

Database.prototype._collection = function(name, callback) {
  var coll = new Collection(name, this._path);
  callback(null, coll);
}


module.exports = Database;
