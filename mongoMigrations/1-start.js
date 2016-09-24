module.exports.id = "start";

exports.up = function (done) {
  var coll = this.db.collection('users');
  coll.insert({ name: 'tobi' }, done);
};

exports.down = function (done) {
  var coll = this.db.collection('users');
  coll.remove({}, done);
};