
const RemoteCursors = ({remoteCursors}) => {
  return (
    <>
    {Object.entries(remoteCursors).map(([userId,cursor])=>(
        <div key={userId}
        className='absolute'
        style={{
            left: cursor.x,
            top: cursor.y
        }}>
            {cursor.reaction && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 drop-shadow-xl emojiFloat pointer-events-none">
                    <div className="text-4xl drop-shadow-lg">
                        {cursor.reaction}
                    </div>
                    <span className="mt-1 px-2 py-0.5 rounded-full bg-black/70 text-white text-xs font-medium whitespace-nowrap">
                        {cursor.reactionName}
                    </span>

                </div>
            )}
            <div
            className={`absolute pointer-events-none z-50 transition-opacity duration-500

            ${cursor.faded ? "opacity-20" : "opacity-100"}`}>
            <div className="flex items-center gap-2 px-2 py-1 rounded-full shadow dark:bg-gray-800">
                <img 
                src={cursor.avatar}
                alt={cursor.name}
                className="w-6 h-6 rounded-full"
                />
                <span className="text-xs font-medium" style={{color:cursor.color}}>
                    {cursor.name || "Guest"}
                </span>
            </div>
            </div>
        </div>
    ))}
    </>
  )
}

export default RemoteCursors;