const mongoose =require('mongoose')

const Schema = mongoose.Schema


const blogs = new Schema({
    title: String,
    desc:String,
    img:String,
})

const Blogs = mongoose.model('blogs',blogs)

module.exports = Blogs 