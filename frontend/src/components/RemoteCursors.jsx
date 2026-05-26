
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
            <div
            style={{
            fontSize:"24px",
            color:cursor.color
            }}
            >
            🖱️
            </div>
            <div
            style={{
                backgroundColor: cursor.color,
                color:"white",
                padding:"2px 6px",
                borderRadius:"6px",
                fontSize:"11px",
                marginTop:"-4px",
                whiteSpace:"nowrap",
                width:"fit-content",
                transform:"translate(-50%,-150%)"
            }}
            >
            {
                userId.slice(0,5)
             }
            </div>
        </div>
    ))}
    </>
  )
}

export default RemoteCursors;