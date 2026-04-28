import { useState } from "react";

const Tooltip = ({text,children}) => {
    const [show,setShow]=useState(false);

  return (
    <div className="relative flex items-center"
    onMouseEnter={()=>setShow(true)}
    onMouseLeave={()=>setShow(false)}>
    {children}
    {show && (
        <div className="absolute-top-10 left-1/2-translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded shadow-md whitespace-nowrap">
            {text}
        </div>
    )}
    </div>
  );
}

export default Tooltip