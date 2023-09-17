import React from 'react';
import { useModal } from '../../context/Modal';

function OpenModalButton({
  modalComponent, // component to render inside the modal
  buttonText, // text of the button that opens the modal
  buttonImage, // image of the button that opens the modal
  buttonDiv, // div of the button that opens the modal
  onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
  onModalClose // optional: callback function that will be called once the modal is closed
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (onButtonClick) onButtonClick();
  };

  return (
    <>
      {buttonImage ? (
        <img className='modalimage' src={buttonImage} onClick={onClick}/>
      ) : (
        <>
        {buttonText ? (
          <button className='modal buttons' onClick={onClick}>{buttonText}</button>
          ) : (
            <div className='modaldiv' onClick={onClick}>{buttonDiv}</div>
          )}
        </>
      )}
    </>
  )
}

export default OpenModalButton;
