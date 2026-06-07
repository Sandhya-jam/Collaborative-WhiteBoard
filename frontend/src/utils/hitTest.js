export function hitTest(action,x,y){
    switch(action.type){
        case "rectangle":
            return(
                x>=action.x &&
                x<=action.x+action.width &&
                y>=action.y &&
                y<=action.y+action.height
            );
        case "circle":
            const dx=x-action.x;
            const dy=y-action.y;
            return Math.sqrt(dx*dx+dy*dy)<=action.radius;
        case "text":
            const width=action.text.length*10; // Approximate width
            const height=action.width || 20;
            return(
                x>=action.x &&
                x<=action.x+width &&
                y>=action.y &&
                y<=action.y+height
            );
        case "line":
            const x1=action.startX;
            const y1=action.startY;
            const x2=action.endX;
            const y2=action.endY;
            const lengthSq=(x2-x1)*(x2-x1)+(y2-y1)*(y2-y1);
            if(lengthSq===0) return false;
            let t=((x-x1)*(x2-x1)+(y-y1)*(y2-y1))/lengthSq;
            t=Math.max(0,Math.min(1,t));
            const projX=x1+t*(x2-x1);
            const projY=y1+t*(y2-y1);
            const dist=Math.sqrt((x-projX)*(x-projX)+(y-projY)*(y-projY));
            return dist<=5;
        default:
            return false;
    }
}