import mongoose from 'mongoose';

const roomSchema=new mongoose.Schema({
    roomId:{type:String,required:true,unique:true},
    actions:{type:Array,default:[]},
    history:{type:Array,default:[]},
    redoHistory:{type:Array,default:[]}
});

export default mongoose.model('Room',roomSchema);