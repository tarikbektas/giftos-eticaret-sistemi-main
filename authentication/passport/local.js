const localsStrategy = require('passport-local').Strategy
const passport =require('passport')
const bcrypt = require('bcryptjs'); 
const User =require('../../models/User')

passport.use(new localsStrategy((email, password, done) => {
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return done(null, false,"kullanıcı bulunamadı");
            }

            bcrypt.compare(password, user.password,(err,res)=>{
                if(res) {
                    return done(null,user,'Giriş Başarılı')
                }else{
                    return done(null,false,'Girdiğiniz şifre yanlış')
                }
            })
             
        })
        .catch(err => {
            return done(err, false, { message: 'Bir hata oluştu' });
        });
}));


 

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, { id: user.id, email: user.email,name:user.name ,surname:user.lastname,userid:user._id,usercartid:user.cart});
    });
  });
  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });