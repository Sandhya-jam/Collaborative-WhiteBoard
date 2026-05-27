import { useState,useEffect } from "react";

const avatars=[
    "https://api.dicebear.com/7.x/bottts/svg?seed=1",
    "https://api.dicebear.com/7.x/bottts/svg?seed=2",
    "https://api.dicebear.com/7.x/bottts/svg?seed=3",
    "https://api.dicebear.com/7.x/bottts/svg?seed=4",
    "https://api.dicebear.com/7.x/bottts/svg?seed=5"
];

export default function useProfile(){
    const [profile,setProfile]=useState(()=>{
        const saved=localStorage.getItem("profile");
        return saved?JSON.parse(saved):{
            username:"",
            avatar:avatars[Math.floor(Math.random()*avatars.length)]
        };
    });

    useEffect(()=>{
        localStorage.setItem("profile",JSON.stringify(profile));
    },[profile]);

    return{
        profile,
        setProfile
    };
}