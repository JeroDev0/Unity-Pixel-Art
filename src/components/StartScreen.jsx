import React from 'react';
import { Box, Button, Heading, VStack, Select } from '@chakra-ui/react';

const CANVAS_SIZES = [16, 32, 64, 128, 256];

function StartScreen({ onNewProject, onOpenProject }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      h="100vh"
      p={4}
      position="relative"
      overflow="hidden"
      backgroundImage="url('https://i.postimg.cc/vTpmhFRK/pixel-castle.jpg')"
      backgroundSize="cover"
      backgroundPosition="center"
      w="100vw" // Añadido para asegurar que el contenedor cubra todo el ancho de la ventana
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="100%"
        bg="#4fd1c5"
        opacity="0.6"
        zIndex="0" // Asegurarnos de que esta capa esté detrás de los otros elementos
      />
      <Box position="relative" zIndex="1">
        <Heading mb={8} color="white" fontSize="4xl" fontWeight="bold">
          Unity Pixel Art
        </Heading>
        <VStack spacing={8} align="center" textAlign="center">
          <Box width="100%" maxWidth="600px">
            <Heading size="lg" mb={4} color="white">New Project</Heading>
            <Select
              placeholder="Select Canvas Size"
              size="lg"
              width="full"
              variant="outline"
              colorScheme="teal"
              onChange={(e) => onNewProject(parseInt(e.target.value))}
              bg="white"
              borderColor="teal.300"
              _hover={{ borderColor: "teal.500" }}
              _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px teal.500" }}
            >
              {CANVAS_SIZES.map(size => (
                <option key={size} value={size}>
                  {size}x{size}
                </option>
              ))}
            </Select>
          </Box>
          <Box>
            <Heading size="lg" mb={4} color="white">Open Project</Heading>
            <Button
              onClick={onOpenProject}
              size="lg"
              variant="solid"
              colorScheme="teal"
            >
              Open Saved Project
            </Button>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}

export default StartScreen;
