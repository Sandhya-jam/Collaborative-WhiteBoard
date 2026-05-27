export default function attachToastListeners(socket,addToast){
    socket.off("user-joined");
    socket.off("user-left");

    socket.on("user-joined",(userId)=>{
        addToast(`${userId.slice(0,5)} joined`,"join");
    });

    socket.on("user-left",(userId)=>{
        addToast(`${userId.slice(0,5)} left`,"leave");
    });
}