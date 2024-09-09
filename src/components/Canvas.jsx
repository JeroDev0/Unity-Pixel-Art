import React, { useRef, useEffect, useState, useCallback } from 'react';

function Canvas({ color, tool, zoom, layers, currentLayer, setLayers, addToHistory, canvasSize, setColor }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 });
  const [touchStartDistance, setTouchStartDistance] = useState(null);

  const PIXEL_SIZE = 10;
  const CANVAS_MULTIPLIER = 5;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Aumenta el tamaño del canvas para poder moverlo y hacer zoom sin cortes
    const WORKSPACE_SIZE = canvasSize * PIXEL_SIZE * CANVAS_MULTIPLIER;

    canvas.width = WORKSPACE_SIZE;
    canvas.height = WORKSPACE_SIZE;

    // Llenar todo el canvas con un fondo oscuro
    ctx.fillStyle = '#1a202c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawLayers(ctx);
  }, [canvasSize, layers, zoom, cameraOffset, currentLayer]);

  const drawLayers = useCallback((ctx) => {
    ctx.save();
    ctx.scale(zoom, zoom);
    ctx.translate(-cameraOffset.x, -cameraOffset.y);

    // Volver a dibujar el fondo oscuro
    ctx.fillStyle = '#1a202c';
    ctx.fillRect(0, 0, ctx.canvas.width / zoom, ctx.canvas.height / zoom);

    const selectedLayer = layers[currentLayer];
    if (selectedLayer) {
      // Dibuja la cuadrícula de trabajo con fondo blanco solo en el área de dibujo
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvasSize * PIXEL_SIZE, canvasSize * PIXEL_SIZE);

      // Si la opacidad de la capa actual es menor que 1, dibuja la capa inferior
      if (selectedLayer.opacity < 1 && currentLayer > 0) {
        const lowerLayer = layers[currentLayer - 1];
        ctx.globalAlpha = 1 - selectedLayer.opacity; // Ajusta la visibilidad de la capa inferior
        lowerLayer.grid.forEach((row, y) => {
          row.forEach((pixelColor, x) => {
            if (pixelColor !== 'white') {
              ctx.fillStyle = pixelColor;
              ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
            }
          });
        });
      }

      // Dibuja la capa actual
      ctx.globalAlpha = selectedLayer.opacity;
      selectedLayer.grid.forEach((row, y) => {
        row.forEach((pixelColor, x) => {
          if (pixelColor !== 'white') {
            ctx.fillStyle = pixelColor;
            ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
          }
        });
      });

      // Dibuja las líneas de la cuadrícula
      ctx.globalAlpha = 1;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
      selectedLayer.grid.forEach((row, y) => {
        row.forEach((_, x) => {
          ctx.strokeRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
        });
      });
    }

    ctx.restore();
  }, [layers, zoom, cameraOffset, PIXEL_SIZE, currentLayer, canvasSize]);

  const handleCanvasClick = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
  
    const clickX = (e.clientX - rect.left) / zoom + cameraOffset.x;
    const clickY = (e.clientY - rect.top) / zoom + cameraOffset.y;
  
    const gridX = Math.floor(clickX / PIXEL_SIZE);
    const gridY = Math.floor(clickY / PIXEL_SIZE);
  
    if (gridX < 0 || gridX >= canvasSize || gridY < 0 || gridY >= canvasSize) return;
  
    if (tool === 'eyedropper') {
      const selectedLayer = layers[currentLayer];
      const pickedColor = selectedLayer.grid[gridY][gridX];
      if (pickedColor !== 'white') {
        setColor(pickedColor); // Cambia el color actual al color seleccionado
      }
      return; // Evita seguir con la lógica de dibujo cuando se usa el cuentagotas
    }

    const newLayers = layers.map((layer, index) => {
      if (index === currentLayer) {
        let newGrid = [...layer.grid];
        
        if (tool === 'fill') {
          const targetColor = layer.grid[gridY][gridX];
          newGrid = floodFill(newGrid, gridX, gridY, targetColor, color);
        } else {
          newGrid[gridY] = [...newGrid[gridY]];
          newGrid[gridY][gridX] = tool === 'eraser' ? 'white' : color;
        }
        
        return { ...layer, grid: newGrid };
      }
      return layer;
    });
  
    setLayers(newLayers);
    addToHistory(newLayers);
  }, [color, tool, zoom, layers, currentLayer, canvasSize, cameraOffset, PIXEL_SIZE, setLayers, addToHistory, setColor]);

  const floodFill = (grid, x, y, targetColor, replacementColor) => {
    if (x < 0 || x >= grid[0].length || y < 0 || y >= grid.length) return grid;
    if (grid[y][x] !== targetColor) return grid;
    if (targetColor === replacementColor) return grid;

    const newGrid = grid.map(row => [...row]);
    
    const stack = [[x, y]];
    while (stack.length) {
      const [currentX, currentY] = stack.pop();
      if (currentX < 0 || currentX >= newGrid[0].length || currentY < 0 || currentY >= newGrid.length) continue;
      if (newGrid[currentY][currentX] !== targetColor) continue;

      newGrid[currentY][currentX] = replacementColor;

      stack.push([currentX + 1, currentY]);
      stack.push([currentX - 1, currentY]);
      stack.push([currentX, currentY + 1]);
      stack.push([currentX, currentY - 1]);
    }

    return newGrid;
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;

    setIsDragging(true);
    setLastPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const dx = e.clientX - lastPosition.x;
    const dy = e.clientY - lastPosition.y;

    setCameraOffset(prevOffset => ({
      x: prevOffset.x - dx / zoom,
      y: prevOffset.y - dy / zoom,
    }));

    setLastPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    zoom = Math.min(Math.max(zoom * zoomFactor, 0.1), 10);
    drawLayers(canvasRef.current.getContext('2d'));
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const distance = Math.sqrt(
        (e.touches[0].clientX - e.touches[1].clientX) ** 2 +
        (e.touches[0].clientY - e.touches[1].clientY) ** 2
      );
      setTouchStartDistance(distance);
    } else {
      setIsDragging(true);
      setLastPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && touchStartDistance) {
      const distance = Math.sqrt(
        (e.touches[0].clientX - e.touches[1].clientX) ** 2 +
        (e.touches[0].clientY - e.touches[1].clientY) ** 2
      );
      const zoomFactor = distance / touchStartDistance;
      zoom = Math.min(Math.max(zoom * zoomFactor, 0.1), 10);
      drawLayers(canvasRef.current.getContext('2d'));
      setTouchStartDistance(distance);
    } else if (isDragging) {
      const dx = e.touches[0].clientX - lastPosition.x;
      const dy = e.touches[0].clientY - lastPosition.y;

      setCameraOffset(prevOffset => ({
        x: prevOffset.x - dx / zoom,
        y: prevOffset.y - dy / zoom,
      }));

      setLastPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTouchStartDistance(null);
  };

  return (
    <div 
      ref={containerRef} 
      style={{ 
        position: 'relative', 
        width: '100%', 
        height: '100%', 
        overflow: 'hidden',
        backgroundColor: '#1a202c' // Asegura que el contenedor también tenga fondo oscuro
      }}
    >
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ 
          cursor: tool === 'eyedropper' ? 'crosshair' : 'grab', 
          display: 'block', 
          margin: '0 auto',
          backgroundColor: '#1a202c' // Asegura que el canvas también tenga fondo oscuro
        }}
      />
    </div>
  );
}

export default Canvas;