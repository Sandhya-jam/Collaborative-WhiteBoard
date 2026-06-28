import mongoose from 'mongoose';

const roomSchema=new mongoose.Schema({
    roomId:{type:String,required:true,unique:true},
    title:{type:String,required:true},
    owner:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    collaborators:[{type:mongoose.Schema.Types.ObjectId,required:true}],
    actions:{type:Array,default:[]},
    history:{type:Array,default:[]},
    redoHistory:{type:Array,default:[]}
});

export default mongoose.model('Room',roomSchema);