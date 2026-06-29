const Input = ({label,type="text",placeholder,value,onChange})=> {
  return (
    <div className="space-y-2">
        <label className="text-sm text-muted">
            {label}
        </label>
        <input 
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        required
        autoComplete="off"
        className="w-full px-4 py-3 rounded-xl bg-surface border border-border outline-none focus:border-primary transition"
         />
    </div>
  )
}

export default Input