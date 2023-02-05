import React, { FC, useState } from "react";

interface ModalUploadFeaturesProps {
  visible: boolean;
}

const ModalUploadFeatures: FC<ModalUploadFeaturesProps> = ({ visible }) => {
  const [open, setOpen] = useState(false);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  return (
    <div>
      <button onClick={onOpenModal}>Open modal</button>
    </div>
  );
};

export default ModalUploadFeatures;
