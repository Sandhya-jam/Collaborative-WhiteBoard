import { useState } from "react";
export default function useTextTool(userId,color,addAction,sendAction){
    const [textInput,setTextInput]=useState("");
    const [textPosition,setTextPosition]=useState(null);

    const startText=(x,y)=>{
        setTextPosition({x,y});
    };

    const submitText=(e)=>{
        if(e.key!=="Enter") return;
        const action={
            id:crypto.randomUUID(),
            type:"text",
            text:textInput,
            x:textPosition.x,
            y:textPosition.y,
            width:20,
            color,
            userId
        };
        addAction(action);
        sendAction(action);
        setTextInput("");
        setTextPosition(null);
    };

    return{
        textInput,
        setTextInput,
        textPosition,
        startText,
        submitText
    }
}