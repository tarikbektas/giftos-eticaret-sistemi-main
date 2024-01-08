const mongoose = require('mongoose')

const Schema = mongoose.Schema

const slider = new Schema({
   slider_sira:Number,
   slider_title :String,
   slider_img:String,
   slider_desc:String,
   slider_link :String
})

const Slider = mongoose.model("slider",slider)

module.exports = Slider