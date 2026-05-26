import { useState } from "react";

const useToast = () => {
    const [toasts, setToasts] = useState([]);
    
    const addToast=(message,type)=>{
        const id = Date.now();
        const toast={id,message,type};
        setToasts(prevToasts=>[...prevToasts,toast]);
        setTimeout(()=>{
            setToasts(prevToasts=>prevToasts.filter(t=>t.id!==id));
        },3000);
    };

    return {toasts,addToast};
}

export default useToast;