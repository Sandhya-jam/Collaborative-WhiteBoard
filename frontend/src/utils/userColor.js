const colors = [
    "#ef4444",
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899"
];

export const getUserColor=(userId)=>{
    let hash=0;
    for(let i=0;i<userId.length;i++){
        hash=hash*31+userId.charCodeAt(i);
        hash=hash%colors.length;
    }
    return colors[Math.abs(hash)];
};