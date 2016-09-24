module.exports.id = "ples";

exports.up = function (done) {
  var coll = this.db.collection('users');
  coll.insert({ name: 'tobi1' }, done);
};

exports.down = function (done) {
  var coll = this.db.collection('users');
  coll.remove({}, done);
};