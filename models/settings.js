const mongoose =require('mongoose')

const Schema = mongoose.Schema


const setting = new Schema({
    site_title:String,
    site_url:String,
    short_desc :String,
    site_description:String,
    site_keywords :String,
    bakim_modu:Number,
    whastsapp_number:Number,
    instagram_username:String,
    facebook_username:Number,
    phone:Number,
    twitter_username:String,
    email:String,
    youtube_username:String,
    address:String,
    logo:String,
    favicon:String,
    contact_mail:String,
    second_phone:Number
})

const Setting = mongoose.model("settings",setting)

module.exports = Setting