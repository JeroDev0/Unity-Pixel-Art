import React, { useState, useCallback } from 'react';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import ColorPalette from './components/ColorPalette';
import StartScreen from './components/StartScreen';
import LayerManager from './components/LayerManager';
import FileNameModal from './components/FileNameModal';
import './App.css';
import { ChakraProvider, IconButton, useDisclosure } from '@chakra-ui/react';
import { FaLayerGroup } from 'react-icons/fa';

function App() {
  const [color, setColor] = useState('#000000');
  const [tool, setTool] = useState('pencil');
  const [zoom, setZoom] = useState(1);
  const [layers, setLayers] = useState([{ id: 0, grid: [], opacity: 1.0 }]);
  const [currentLayer, setCurrentLayer] = useState(0);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [canvasSize, setCanvasSize] = useState(null);
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [showLayerManager, setShowLayerManager] = useState(false);
  const [modalType, setModalType] = useState(null); // 'save' or 'export'
  const [fileName, setFileName] = useState(''); // Guardar el nombre del archivo

  const { isOpen, onOpen, onClose } = useDisclosure();

  const DB_NAME = 'PixelArtDB';
  const DB_STORE_NAME = 'projects';

  const openIndexedDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(DB_STORE_NAME)) {
          db.createObjectStore(DB_STORE_NAME, { keyPath: 'id', autoIncrement: true });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject('Error opening IndexedDB');
      };
    });
  };

  const addToHistory = useCallback((newLayers) => {
    setHistory(prevHistory => [...prevHistory.slice(0, historyIndex + 1), newLayers]);
    setHistoryIndex(prevIndex => prevIndex + 1);
  }, [historyIndex]);

  const handleNewProject = (size) => {
    setCanvasSize(size);
    const newGrid = Array(size).fill().map(() => Array(size).fill('white'));
    setLayers([{ id: 0, grid: newGrid, opacity: 1.0 }]);
    addToHistory([{ id: 0, grid: newGrid, opacity: 1.0 }]);
    setShowStartScreen(false);
    setFileName(''); // Reiniciar el nombre del archivo para nuevos proyectos
  };

  const handleSaveToDB = async () => {
    const db = await openIndexedDB();
    const transaction = db.transaction([DB_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(DB_STORE_NAME);

    const project = {
      fileName: fileName || 'Unnamed Project',
      layers,
      canvasSize,
    };

    const request = store.add(project);

    request.onsuccess = () => {
      console.log('Project saved to IndexedDB');
    };

    request.onerror = () => {
      console.log('Error saving project to IndexedDB');
    };
  };

  const handleLoadFromDB = async (id) => {
    const db = await openIndexedDB();
    const transaction = db.transaction([DB_STORE_NAME], 'readonly');
    const store = transaction.objectStore(DB_STORE_NAME);

    const request = store.get(id);

    request.onsuccess = (event) => {
      const loadedProject = event.target.result;
      if (loadedProject) {
        setLayers(loadedProject.layers);
        setCanvasSize(loadedProject.canvasSize);
        addToHistory(loadedProject.layers);
        setShowStartScreen(false);
        setFileName(loadedProject.fileName);
      }
    };

    request.onerror = () => {
      console.log('Error loading project from IndexedDB');
    };
  };

  const handleOpenProject = () => {
    // Aquí puedes agregar un menú o modal para seleccionar proyectos desde IndexedDB
    // Por ahora, llamaremos a handleLoadFromDB con un ID de proyecto predeterminado.
    handleLoadFromDB(1); // Carga el proyecto con ID 1 (esto es un ejemplo, puedes cambiarlo)
  };

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prevIndex => prevIndex - 1);
      setLayers(history[historyIndex - 1]);
    }
  }, [historyIndex, history]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prevIndex => prevIndex + 1);
      setLayers(history[historyIndex + 1]);
    }
  }, [historyIndex, history]);

  const handleSave = useCallback((newFileName) => {
    const finalFileName = newFileName || fileName || 'pixel-art-project.json';
    const projectData = JSON.stringify({ layers, size: canvasSize });
    const blob = new Blob([projectData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = finalFileName;
    link.click();
    URL.revokeObjectURL(url);
    setFileName(finalFileName); // Establecer o actualizar el nombre del archivo

    // Guardar en IndexedDB
    handleSaveToDB();
  }, [layers, canvasSize, fileName]);

  const handleExport = useCallback((exportFileName) => {
    const canvas = document.querySelector('canvas');
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');

    tempCanvas.width = canvasSize * 10; // Ajusta este valor según el tamaño de píxel real en tu canvas
    tempCanvas.height = canvasSize * 10;

    ctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

    const selectedLayer = layers[currentLayer];
    if (selectedLayer) {
      selectedLayer.grid.forEach((row, y) => {
        row.forEach((pixelColor, x) => {
          if (pixelColor !== 'white') {
            ctx.fillStyle = pixelColor;
            ctx.fillRect(x * 10, y * 10, 10, 10); // Ajusta también este valor
          }
        });
      });
    }

    const dataURL = tempCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = exportFileName || 'pixel-art.png';
    link.href = dataURL;
    link.click();
  }, [canvasSize, layers, currentLayer]);

  const handleClear = useCallback(() => {
    const newLayers = layers.map(layer => ({
      ...layer,
      grid: layer.grid.map(row => row.map(() => 'white'))
    }));
    setLayers(newLayers);
    addToHistory(newLayers);
  }, [layers, addToHistory]);

  const handleZoom = (zoomFactor) => {
    setZoom(prevZoom => Math.min(Math.max(prevZoom * zoomFactor, 0.1), 10));
  };

  const updateLayer = (layerIndex, newLayer) => {
    const newLayers = layers.map((layer, index) => index === layerIndex ? newLayer : layer);
    setLayers(newLayers);
    addToHistory(newLayers);
  };

  const openSaveModal = () => {
    if (fileName) {
      handleSave(); // Guardar directamente si ya hay un nombre de archivo
    } else {
      setModalType('save');
      onOpen(); // Abrir el modal si no hay nombre de archivo
    }
  };

  const openExportModal = () => {
    setModalType('export');
    onOpen();
  };

  if (showStartScreen) {
    return <StartScreen onNewProject={handleNewProject} onOpenProject={handleOpenProject} />;
  }

  return (
    <ChakraProvider>
      <div className="App">
        <Toolbar
          tool={tool}
          setTool={setTool}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onSave={openSaveModal}
          onExport={openExportModal}
          onClear={handleClear}
          onZoomIn={() => handleZoom(1.1)}
          onZoomOut={() => handleZoom(0.9)}
        />
        <div className="main-content">
          <ColorPalette color={color} setColor={setColor} />
          <Canvas
            setColor={setColor}
            color={color}
            tool={tool}
            zoom={zoom}
            layers={layers}
            setLayers={setLayers}
            currentLayer={currentLayer}
            setCurrentLayer={setCurrentLayer}
            addToHistory={addToHistory}
            canvasSize={canvasSize}
            updateLayer={updateLayer}
          />
          <IconButton
            icon={<FaLayerGroup />}
            onClick={() => setShowLayerManager(!showLayerManager)}
            aria-label="Layer Manager"
            position="absolute"
            top={4}
            right={4}
          />
          {showLayerManager && (
            <LayerManager
              layers={layers}
              setLayers={setLayers}
              currentLayer={currentLayer}
              setCurrentLayer={setCurrentLayer}
              updateLayer={updateLayer}
            />
          )}
        </div>
        {isOpen && (
          <FileNameModal
            isOpen={isOpen}
            onClose={onClose}
            onSave={modalType === 'save' ? handleSave : handleExport}
            modalType={modalType}
          />
        )}
      </div>
    </ChakraProvider>
  );
}

export default App;
