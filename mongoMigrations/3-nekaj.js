module.exports.id = "nekaj";

exports.up = function (done) {
  var coll = this.db.collection('users');
  coll.insert({ name: 'tobi2' }, done);
};

exports.down = function (done) {
  var coll = this.db.collection('users');
  coll.remove({}, done);
};