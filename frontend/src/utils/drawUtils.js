export const drawAction = (ctx, action) => {
    ctx.strokeStyle = action.color;
    ctx.lineWidth = action.width;
    ctx.lineCap = "round";

    if (action.type === "pencil") {
        ctx.beginPath();
        action.points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();
    }
};

export const drawAll = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

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
};