const TextInput = ({position,value,setValue,onSubmit}) => {
    if(!position) return null;
  return (
    <input
    autoFocus
    value={value}
    onChange={(e) => setValue(e.target.value)}
    onKeyDown={onSubmit}
    style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        zIndex: 9999,
        background:"white",
        border:"1px solid gray",
    }}
    className="border px-2 py-1 rounded bg-white dark:bg-gray-800"
    />
  );
}

export default TextInput