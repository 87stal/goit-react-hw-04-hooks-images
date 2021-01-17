import React, { useEffect } from 'react';
import styles from './Modal.module.css';
import PropTypes from 'prop-types';

function Modal({ onClose, children }) {
  const eventAction = e => {
    if (e.code === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', eventAction);
    return () => window.removeEventListener('keydown', eventAction);
  }, []);

  return (
    <div className={styles.Overlay}>
      <div className={styles.Modal}>{children}</div>
    </div>
  );
}

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
};
export default Modal;
