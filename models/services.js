const mongoose =require('mongoose')

const Schema = mongoose.Schema


const services = new Schema({
    title: String,
    desc:String,
    img:String
})

const Services = mongoose.model('services',services)

module.exports = Services 