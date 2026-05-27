import React from 'react'

const Users = ({users}) => {
  return (
    <div className="absolute top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md bg-white/20 dark:bg-gray-900/40 border border-white/20 shadow-lg text-sm font-medium text-gray-800 dark:text-white">
        <div className="w-2 5 h-2 5 rounded-full bg-green-500 animate-pulse"/>
        <span>{users?.length || 0} {" "} Online</span>
    </div>
  )
}

export default Users;