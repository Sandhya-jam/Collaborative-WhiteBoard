export default function useExport(canvasRef,darkMode) {
  const exportPNG = () => {
    if(!canvasRef.current) return;
    const canvas=canvasRef.current;
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    tempCtx.fillStyle = darkMode ? '#1f2937' : '#ffffff'; // Set background based on dark mode
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(canvas, 0, 0);
    const link = document.createElement('a');
    link.download = 'canvas.png';
    link.href = tempCanvas.toDataURL('image/png');
    link.click();
  };

  return {
    exportPNG
    };
}