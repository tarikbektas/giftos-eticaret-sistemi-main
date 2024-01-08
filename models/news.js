const mongoose =require('mongoose')

const Schema = mongoose.Schema


const news = new Schema({
    _id: mongoose.Schema.Types.ObjectId,

    title: String,
    desc:String,
    img:String
})

const News = mongoose.model('news',news)

module.exports = News 