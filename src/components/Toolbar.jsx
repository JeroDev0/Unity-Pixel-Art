import React, { useState } from 'react';
import {
  Box,
  Flex,
  IconButton,
  Tooltip,
  Icon,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Link
} from '@chakra-ui/react';
import {
  FaPencilAlt,
  FaEraser,
  FaFillDrip,
  FaEyeDropper,
  FaMousePointer,
  FaArrowAltCircleRight,
  FaCircle,
  FaSquare,
  FaCopy,
  FaPaste,
  FaUndo,
  FaRedo,
  FaSave,
  FaFileExport,
  FaTrashAlt,
  FaSearchPlus,
  FaSearchMinus,
  FaInfoCircle
} from 'react-icons/fa';

function Toolbar({
  tool,
  setTool,
  onUndo,
  onRedo,
  onSave,
  onExport,
  onClear,
  onZoomIn,
  onZoomOut,
  onCopy,
  onPaste,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showToolGroup, setShowToolGroup] = useState(false);

  return (
    <Box
      bg="#4fd1c5"
      borderBottom="1px solid #ccc"
      overflowX="auto"
      py={2}
      whiteSpace="nowrap"
    >
      <Flex
        align="center"
        justify="flex-start"
        minW="100%"
        px={4}
      >
        {/* Tool Group */}
        <Menu>
          <MenuButton as={IconButton}
            color="black"
            icon={<FaPencilAlt />}
            onClick={() => setShowToolGroup(!showToolGroup)}
            aria-label="Tool Group"
            isActive={showToolGroup}
            variant="ghost"
            mr={2}
          />
          <MenuList zIndex="popover"> {/* Ensure menu appears above other components */}
            <MenuItem
              icon={<FaPencilAlt />}
              onClick={() => {
                setTool('pencil');
                setShowToolGroup(false);
              }}
            />
            <MenuItem
              icon={<FaFillDrip />}
              onClick={() => {
                setTool('fill');
                setShowToolGroup(false);
              }}
            />
            <MenuItem
              icon={<FaEraser />}
              onClick={() => {
                setTool('eraser');
                setShowToolGroup(false);
              }}
            />
            <MenuItem
              icon={<FaEyeDropper />}
              onClick={() => {
                setTool('eyedropper');
                setShowToolGroup(false);
              }}
            />
            <MenuItem
              icon={<FaMousePointer />}
              onClick={() => {
                setTool('select');
                setShowToolGroup(false);
              }}
            />
            <MenuDivider />
            <MenuItem
              icon={<FaArrowAltCircleRight />}
              onClick={() => {
                setTool('line');
                setShowToolGroup(false);
              }}
            />
            <MenuItem
              icon={<FaCircle />}
              onClick={() => {
                setTool('circle');
                setShowToolGroup(false);
              }}
            />
            <MenuItem
              icon={<FaSquare />}
              onClick={() => {
                setTool('square');
                setShowToolGroup(false);
              }}
            />
          </MenuList>
        </Menu>

        {/* Otros iconos */}
        <Tooltip label="Copy" aria-label="Copy tooltip">
          <IconButton
            color="black"
            icon={<FaCopy />}
            onClick={onCopy}
            aria-label="Copy"
            variant="ghost"
            mr={2}
          />
        </Tooltip>
        <Tooltip label="Paste" aria-label="Paste tooltip">
          <IconButton
            color="black"
            icon={<FaPaste />}
            onClick={onPaste}
            aria-label="Paste"
            variant="ghost"
            mr={2}
          />
        </Tooltip>
        <Tooltip label="Undo" aria-label="Undo tooltip">
          <IconButton color="black" icon={<FaUndo />} onClick={onUndo} aria-label="Undo" variant="ghost" mr={2} />
        </Tooltip>
        <Tooltip label="Redo" aria-label="Redo tooltip">
          <IconButton color="black" icon={<FaRedo />} onClick={onRedo} aria-label="Redo" variant="ghost" mr={2} />
        </Tooltip>
        <Tooltip label="Save" aria-label="Save tooltip">
          <IconButton color="black" icon={<FaSave />} onClick={onSave} aria-label="Save" variant="ghost" mr={2} />
        </Tooltip>
        <Tooltip label="Export" aria-label="Export tooltip">
          <IconButton color="black" icon={<FaFileExport />} onClick={onExport} aria-label="Export" variant="ghost" mr={2} />
        </Tooltip>
        <Tooltip label="Clear" aria-label="Clear tooltip">
          <IconButton color="black" icon={<FaTrashAlt />} onClick={onClear} aria-label="Clear" variant="ghost" mr={2} />
        </Tooltip>
        <Tooltip label="Zoom In" aria-label="Zoom In tooltip">
          <IconButton color="black" icon={<FaSearchPlus />} onClick={onZoomIn} aria-label="Zoom In" variant="ghost" mr={2} />
        </Tooltip>
        <Tooltip label="Zoom Out" aria-label="Zoom Out tooltip">
          <IconButton color="black" icon={<FaSearchMinus />} onClick={onZoomOut} aria-label="Zoom Out" variant="ghost" />
        </Tooltip>
        <Tooltip label="Info" aria-label="Info tooltip">
          <IconButton color="black" icon={<FaInfoCircle />} onClick={onOpen} aria-label="Info" variant="ghost" ml={2} />
        </Tooltip>
      </Flex>
      
      {/* Modal Component */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Información</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p><strong>Desarrollado por JeroDev</strong></p>
            <p>Contacto: <a href="tel:+573205820930">+573205820930</a></p>
            <p>
              Portafolio: <Link href="https://jerodev.tech" isExternal color="teal.500">jerodev.tech</Link>
            </p>
            <p>
              Colaboración de arte: <Link href="https://www.deviantart.com/fungidev/gallery" isExternal color="teal.500">fungidev</Link>
            </p>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Toolbar;
