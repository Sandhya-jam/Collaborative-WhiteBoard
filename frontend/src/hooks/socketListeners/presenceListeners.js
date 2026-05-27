export default function attachPresenceListeners(socket,setUsers){
    socket.off("users-update");

    socket.on("users-update",(users)=>{
        //console.log("USERS UPDATE",users);
        setUsers(users);
    })
}