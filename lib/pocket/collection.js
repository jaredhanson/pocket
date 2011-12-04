var path = require('path')
  , fs = require('fs')
  , mkdirp = require('mkdirp')
  , util = require('util');


function Collection(name, dbPath) {
  this._name = name;
  this._dbPath = dbPath;
}

Collection.prototype.put = function(id, obj, callback) {
  var self = this;
  path.exists(self._dbPath + '/data/' + self._name, function(exists) {
    if (exists) {
      writeObject();
    } else {
      // No directory exists in which to store objects in this collection.
      // Create a directory and write the object.
      mkdirp(self._dbPath + '/data/' + self._name, 0755, function(err) {
        if (err) { return callback(err); }
        writeObject();
      });
    }
  });
  
  function writeObject() {
    // TODO: Implement option to control pretty printing (disable by default).
    fs.writeFile(self._dbPath + '/data/' + self._name + '/' + id + '.json', JSON.stringify(obj, null, 4), callback);
  }
}


module.exports = Collection;
