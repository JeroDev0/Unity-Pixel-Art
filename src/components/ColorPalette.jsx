import React from 'react';
import { Box, Button, Input, VStack, useTheme } from '@chakra-ui/react';

const defaultColors = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', 
  '#FFFF00', '#00FFFF', '#808080',
  '#FFC67D', '#8BC34A',
];

function ColorPalette({ color, setColor }) {
  const theme = useTheme();
  
  return (
    <Box
      width="50px" // Ancho fijo
      p={4}
      bg="#4fd1c5"
      borderRadius="lg"
      boxShadow="xl"
      position="absolute"
      top="70px"
      left="10px"
      zIndex={10}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <VStack spacing={3} align="center" mb={4}>
        {defaultColors.map((c) => (
          <Button
            key={c}
            bg={c}
            width="30px" // Tamaño un poco más grande
            height="30px" // Tamaño un poco más grande
            borderRadius="full" // Botones redondos
            variant="solid" // Cambio a botones sólidos
            boxShadow="md" // Agrego sombra para dar profundidad
            _hover={{ transform: 'scale(1.2)', boxShadow: 'lg' }}
            onClick={() => setColor(c)}
          />
        ))}
      </VStack>
      <Input
        type="color"
        width="50px" // Tamaño un poco más grande
        height="50px" // Tamaño un poco más grande
        borderRadius="100px" // Botones redondos
        value={color}
        onChange={(e) => setColor(e.target.value)}
        variant="unstyled"
        size="lg" // Tamaño de letra un poco más grande
        mt={4}
      />
    </Box>
  );
}

export default ColorPalette;
