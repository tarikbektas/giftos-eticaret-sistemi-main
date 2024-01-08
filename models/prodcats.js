// models/prodcats.js
const mongoose = require('mongoose');

const prodcatsSchema = new mongoose.Schema({
name:String,
desc:String
});

const Prodcats = mongoose.model('prodcats', prodcatsSchema);

module.exports = Prodcats;