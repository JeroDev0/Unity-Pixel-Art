import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  Button,
  useDisclosure
} from '@chakra-ui/react';

function FileNameModal({ onSave, onExport, isOpen, onClose, actionType }) {
  const [fileName, setFileName] = useState('');

  const handleConfirm = () => {
    if (fileName) {
      if (actionType === 'save') {
        onSave(fileName);
      } else if (actionType === 'export') {
        onExport(fileName);
      }
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{actionType === 'save' ? 'Save Project' : 'Export Image'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            placeholder={`Enter ${actionType === 'save' ? 'project' : 'image'} name`}
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            mb={4}
          />
          <Button colorScheme="blue" onClick={handleConfirm}>
            {actionType === 'save' ? 'Save' : 'Export'}
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default FileNameModal;
