import Room from "../models/Room.js"
import crypto from "crypto";

export const createRoom=async(req,res)=>{
    try {
        const {title}=req.body;
        if(!title){
            return res.status(400).json({message:"Title is required"})
        }

        const room=await Room.create({
            roomId:crypto.randomUUID(),
            title,
            owner:req.user._id,
            collaborators:[],
            actions:[],
            history:[],
            redoHistory:[]
        });
        res.status(201).json(room)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
};

export const getMyRooms=async(req,res)=>{
    try {
        const rooms=await Room.find({
            owner:req.user._id,
        }).sort({updatedAt:-1});
        res.status(200).json(rooms)
    } catch (error) {
        res.status(500).json({message:error.message})
    };
};

export const renameRoom=async(req,res)=>{
    try {
        const {title}=req.body;

        const room=await Room.findById(req.params.id);
        if(!room){
            return res.status(404).json({message:"Board not Found"})
        }
        if(!room.owner.equals(req.user._id)){
            return res.status(403).json({message:"Not Authorized"})
        }
        room.title=title;
        await room.save();
        res.json(room);
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const deleteRoom=async(req,res)=>{
    try {
        const room=await Room.findById(req.params.id);
        if(!room){
            return res.status(404).json({message:"Board not Found"})
        }
        if(!room.owner.equals(req.user._id)){
            return res.status(403).json({message:"Not Authorized"})
        }

        await room.deleteOne();
        res.json({message:"Board deleted Successfully"})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}