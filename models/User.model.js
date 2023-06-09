const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')
const UserSchema = new mongoose.Schema({
  username: { type: String, default: null },
  last_name: { type: String, default: null },
  email: { type: String, unique: true },
  password: { type: String,require:true },
  role : {
    type : String,
    enum : ['user','admin','author'],
    required: true
},
});
UserSchema.pre('save',function(next){
  if(!this.isModified('password'))
      return next();
  bcrypt.hash(this.password,10,(err,passwordHash)=>{
      if(err)
          return next(err);
      this.password = passwordHash;
      next();
  });
});

UserSchema.methods.comparePassword = function(password,cb){
  bcrypt.compare(password,this.password,(err,isMatch)=>{
      if(err)
          return cb(err);
      else{
          if(!isMatch)
              return cb(null,isMatch);
          return cb(null,this);
      }
  });
}
module.exports = mongoose.model("user", UserSchema);