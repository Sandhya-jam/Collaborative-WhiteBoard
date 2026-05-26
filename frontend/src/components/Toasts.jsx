const Toasts=({toasts})=>{
    return(
        <div className="absolute bottom-4 right-4 z-50 space-y-2">
            {toasts.map(toast=>(
                <div key={toast.id} className={`px-4 py-2 rounded shadow transition-all duration-500 ease-in-out animate-slideIn ${toast.type==="join"?"bg-green-500":"bg-red-500"} text-white`}>
                    {toast.message}
                </div>
            ))}
        </div>
    );
};

export default Toasts;