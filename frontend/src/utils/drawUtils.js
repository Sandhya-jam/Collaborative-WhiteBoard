export const drawAction = (ctx, action, selectedId) => {
    if(!action) return;
    ctx.strokeStyle = action.color;
    ctx.fillStyle = action.color;
    if(action.id && action.id===selectedId){
        ctx.strokeStyle="#3b82f6";
        ctx.fillStyle="#3b82f6";
    }
    ctx.lineWidth = action.type === "pencil" ? action.width : action.strokewidth || 3;
    ctx.lineCap = "round";

    switch(action.type){
        case "pencil":
        ctx.beginPath();
        action.points.forEach((p, i) => {
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
            });
        ctx.stroke();
        break;
        case "line":
        ctx.beginPath();
        ctx.moveTo(action.startX,action.startY);
        ctx.lineTo(action.endX,action.endY);
        ctx.stroke();
        if(action.id && action.id===selectedId){
            ctx.fillStyle="#3b82f6";
            ctx.beginPath();
            ctx.arc(action.endX,action.endY,6,0,Math.PI*2);
            ctx.fill();
        }
        break;
        case "rectangle":
        if(action.id && action.id===selectedId){
            ctx.fillStyle="#3b82f6";
            ctx.beginPath();
            ctx.arc(action.x+action.width,action.y+action.height,6,0,Math.PI*2);
            ctx.fill();
        }
        ctx.strokeRect(
            action.x,
            action.y,
            action.width,
            action.height
        );
        break;
        case "circle":
        ctx.beginPath();
        ctx.arc(action.x,action.y,action.radius,0,Math.PI*2);
        ctx.stroke();
        if(action.id && action.id===selectedId){
            ctx.fillStyle="#3b82f6";
            ctx.beginPath();
            ctx.arc(action.x+action.radius,action.y,6,0,Math.PI*2);
            ctx.fill();
        }
        break;
        case "text":
            ctx.fillStyle = action.color;
            ctx.font = `${action.width || 20}px sans-serif`;
            ctx.fillText(action.text, action.x, action.y);

            if(action.id && action.id===selectedId){
                const width=ctx.measureText(action.text).width;
                const height=action.width || 20;
                ctx.strokeStyle="#3b82f6";
                ctx.lineWidth=1;
                ctx.strokeRect(action.x-4,action.y-height,width+8,height+8);
                ctx.fillStyle="#3b82f6";
                ctx.beginPath();
                ctx.arc(action.x+width+8,action.y+8,6,0,Math.PI*2);
                ctx.fill();
            }
            break;
        default:
            break;
    }
};

export const drawAll = (ctx,actions,currentPath,preview,color,brushSize,remotePaths,selectedId) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    console.log(
    "DRAWALL ACTIONS:",
    actions.map(
        a=>({
            userId:a.userId,
            type:a.type
        })
    )
);

console.log(
    "REMOTE PATHS:",
    remotePaths
);
    actions?.forEach((action) => {
        drawAction(ctx, action,selectedId);
    });
    
    // draw current path (live preview)
    if (currentPath.length > 0) {
        drawAction(ctx, {
        type: "pencil",
        points: currentPath,
        color,
        width: brushSize
        });
    }

    if(preview){
        drawAction(ctx,preview);
    }

    Object.values(remotePaths).forEach((path) => {
    drawAction(ctx, {
        type: "pencil",
        points: path.points,
        color: path.color,
        width: path.width
    });
    });
};