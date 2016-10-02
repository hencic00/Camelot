var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema
(
	{
		eMail: String,
		password: String,
		firstName: String,
		lastName: String,
		dateOfBirth: String,
		sex: String,
		loginHash: String
	}
);

mongoose.model('users', userSchema);