import React from 'react';
import { Box, IconButton, Input, Slider, SliderTrack, SliderFilledTrack, SliderThumb } from '@chakra-ui/react';
import { FaTrashAlt, FaLayerGroup } from 'react-icons/fa';

function LayerManager({ layers, setLayers, currentLayer, setCurrentLayer, updateLayer }) {
  const addLayer = () => {
    const newLayer = { id: layers.length, grid: Array(layers[0].grid.length).fill().map(() => Array(layers[0].grid[0].length).fill('white')), opacity: 1.0 };
    setLayers([...layers, newLayer]);
    setCurrentLayer(layers.length);
  };

  const deleteLayer = (index) => {
    if (layers.length > 1) {
      const newLayers = layers.filter((_, i) => i !== index);
      setLayers(newLayers);
      setCurrentLayer(index === currentLayer ? 0 : currentLayer);
    }
  };

  const handleOpacityChange = (index, value) => {
    const newLayer = { ...layers[index], opacity: value / 100 };
    updateLayer(index, newLayer);
  };

  return (
    <Box
      position="absolute"
      bottom="100px"
      right="20px"
      bg="gray.700"
      p={4}
      borderRadius="md"
      boxShadow="lg"
      zIndex={10}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <IconButton
          icon={<FaTrashAlt />}
          onClick={() => deleteLayer(currentLayer)}
          aria-label="Delete Layer"
          size="sm"
          colorScheme="red"
          isDisabled={layers.length === 1}
        />
      </Box>
      <Box>
        {layers.map((layer, index) => (
          <Box
            key={layer.id}
            p={2}
            mb={2}
            bg={index === currentLayer ? 'gray.600' : 'gray.800'}
            borderRadius="md"
            onClick={() => setCurrentLayer(index)}
            cursor="pointer"
          >
            <Box display="flex" alignItems="center">
              <IconButton
                icon={<FaLayerGroup />}
                aria-label="Layer Icon"
                size="sm"
                colorScheme="gray"
                mr={2}
              />
              <Input
                size="sm"
                variant="unstyled"
                value={`Layer ${index + 1}`}
                readOnly
              />
            </Box>
            <Slider
              aria-label="Layer Opacity"
              defaultValue={layer.opacity * 100}
              onChange={(value) => handleOpacityChange(index, value)}
              min={0}
              max={100}
              step={1}
            >
              <SliderTrack bg="gray.400">
                <SliderFilledTrack bg="teal.400" />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Box>
        ))}
      </Box>
      <IconButton
        icon={<FaLayerGroup />}
        onClick={addLayer}
        aria-label="Add Layer"
        size="sm"
        colorScheme="teal"
        mt={2}
      />
    </Box>
  );
}

export default LayerManager;