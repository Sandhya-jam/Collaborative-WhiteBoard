
const RemoteCursors = ({remoteCursors}) => {
  return (
    <>
    {Object.entries(remoteCursors).map(([userId,cursor])=>(
        <div key={userId}
        className="absolute pointer-events-none z-50"
        style={{
            left: cursor.x,
            top: cursor.y
        }}>
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
    ))}
    </>
  )
}

export default RemoteCursors;