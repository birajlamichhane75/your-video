import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        lowerCase:true,
        unique:true,
        trim:true,
        index:true,
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        unique:true
    },
    email:{
        type:String,
        required:true,
        lower:true,
        unique:true
    },
    fullName:{
        type:String,
        required:true,
        lower:true,
        unique:true
    },
    avatar:{
        type:String,
        required:true
    },
    coverImage:{
        type:String
    },
    watchHistory:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video"
        }
    ],

    refreshToken:{
        type:String
    }
    
},
{
    timestamps:true
});


// encrypt the password before saving in database if password is modified
userSchema.pre("save", async function (next){               // pre hook that cheeck before data is save in database
    if(!this.isModified("password")) return next();
    
    this.password = await bcrypt.hash(this.password,10);          // hashing the password using bcrypt before sending to database
    
    next();
    // console.log("working before");
})

// Check if the password entered and password in database are equal
userSchema.methods.isPasswordCorrect = async function(password){
    // console.log("working after");
    console.log(password,this.password);
    
    return bcrypt.compare(password, this.password);              // comparing password using bcrypt
}

// Generate access token
userSchema.methods.generateAccessToken = function(){     // generateAcceseToken using jwt.sign(payload,accesstokensecret,{expireIn:time}) 
    return jwt.sign({
        _id : this._id,
        username :this.username,
        email: this.email,
        fullName : this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
)
}

// generate refresh token
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id : this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
)
}


export const User = mongoose.model("User",userSchema)
