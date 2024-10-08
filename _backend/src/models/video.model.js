import mongoose, { model } from "mongoose";
// import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema({
    video:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true,
    },
    desc:{
        type:String,
        required:true,
    },
    thumbnail:{
        type:String,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    views:{
        type:Number,
        default:0
    },
    isPublish:{
        type:Boolean,
        default:true
    },
    duration:{
        type:Number,
    }
})

// videoSchema.plugin(mongooseAggregatePaginate())

export const Video = mongoose.model("Video",videoSchema);