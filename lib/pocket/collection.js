var path = require('path')
  , fs = require('fs')
  , mkdirp = require('mkdirp')
  , util = require('util');


function Collection(name, dbPath) {
  this._name = name;
  this._dbPath = dbPath;
}

Collection.prototype.allIds = function(callback) {
  var self = this;
  var dir = self._dbPath + '/data/' + self._name;
  
  fs.readdir(dir, function(err, files) {
    if (err) { return callback(err); }
    var ids = files.map(function(file) { return file.replace('.json', ''); });
    return callback(null, ids);
  });
}

Collection.prototype.get = function(id, callback) {
  var self = this;
  var file = self._dbPath + '/data/' + self._name + '/' + id + '.json';
  
  fs.readFile(file, 'utf8', function (err, data) {
    if (err) { return callback(err); }
    return callback(null, JSON.parse(data));
  });
}

Collection.prototype.put = function(id, obj, callback) {
  var self = this;
  var dir = self._dbPath + '/data/' + self._name;
  
  fs.exists(dir, function(exists) {
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

Collection.prototype.refs = function(id, rel, callback) {
  var self = this;
  var file = self._dbPath + '/ref/' + self._name + '/' + id + '/' + rel + '.json';
  
  fs.readFile(file, 'utf8', function (err, data) {
    if (err) { return callback(err); }
    return callback(null, JSON.parse(data));
  });
}

Collection.prototype.relate = function(id, rel, refs, callback) {
  var self = this;
  var dir = self._dbPath + '/ref/' + self._name + '/' + id;
  
  fs.exists(dir, function(exists) {
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
