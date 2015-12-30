'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

var MemberSchema = new Schema({
  name: String
});

module.exports = mongoose.model('Member', MemberSchema);
