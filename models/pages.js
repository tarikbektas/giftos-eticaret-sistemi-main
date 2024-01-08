const mongoose =require('mongoose')

const Schema = mongoose.Schema


const pages = new Schema({
    title: String,
    url:String,
    desc:String,
})

const Pages = mongoose.model('pages',pages)

module.exports = Pages 