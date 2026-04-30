export const drawAction = (ctx, action) => {
    ctx.strokeStyle = action.color;
    ctx.lineWidth = action.strokewidth;
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
        break;
        case "rectangle":
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
        break;
        default:
            break;
    }
};

export const drawAll = (ctx,actions,currentPath,preview,color,brushSize) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    actions.forEach((action) => {
        drawAction(ctx, action);
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
};