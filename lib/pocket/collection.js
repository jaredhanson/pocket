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
  var dir = self._dbPath + '/data/' + self._name;
  
  path.exists(dir, function(exists) {
    if (exists) {
      writeObject();
    } else {
      // No directory exists in which to store objects in this collection.
      // Create a directory and write the object.
      mkdirp(dir, 0755, function(err) {
        if (err) { return callback(err); }
        writeObject();
      });
    }
  });
  
  function writeObject() {
    // TODO: Implement option to control pretty printing (disable by default).
    fs.writeFile(dir + '/' + id + '.json', JSON.stringify(obj, null, 4), callback);
  }
}

Collection.prototype.relate = function(id, rel, refs, callback) {
  var self = this;
  var dir = self._dbPath + '/ref/' + self._name + '/' + id;
  
  path.exists(dir, function(exists) {
    if (exists) {
      writeReferences();
    } else {
      // No directory exists in which to store the relations of this object.
      // Create a directory and write the references.
      mkdirp(dir, 0755, function(err) {
        if (err) { return callback(err); }
        writeReferences();
      });
    }
  });
  
  function writeReferences() {
    // TODO: Implement option to control pretty printing (disable by default).
    fs.writeFile(dir + '/' + rel + '.json', JSON.stringify(refs, null, 4), callback);
  }
}


module.exports = Collection;
