// src/components/ReceiptModal.jsx
import React, { useState, useCallback } from 'react';
import html2canvas from 'html2canvas';
import Receipt from './Receipt';
import '../styles/ReceiptModal.css';

const ReceiptModal = ({ isOpen, onClose, receiptData }) => {
  // 1. HOOKS MUST BE CALLED HERE (at the top level)
  const [receiptElement, setReceiptElement] = useState(null);
  const [orderId, setOrderId] = useState(null);

  const handleElementReady = useCallback((element, id) => {
    setReceiptElement(element);
    setOrderId(id);
  }, []);

  // DOWNLOAD FUNCTION
  const downloadReceiptImage = () => {
      if (!receiptElement || !orderId) {
          console.error("Receipt element or Order ID not available for download.");
          return;
      }

      html2canvas(receiptElement, {
          scale: 2,
          allowTaint: true,
          useCORS: true,
          backgroundColor: '#FFFFFF',
      }).then(canvas => {
          const imageURL = canvas.toDataURL('image/png');
          const link = document.createElement('a');

          link.href = imageURL;
          link.download = `receipt-${orderId}.png`;

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      });
  };

  // 2. CONDITIONAL RETURN CAN GO HERE (after the hooks)
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

        <button className="modal-close-btn" onClick={onClose}>
          &times;
        </button>

        <Receipt
            receiptData={receiptData}
            onElementReady={handleElementReady}
        />

        <div className="modal-actions">
          <button
            className="btn-download"
            onClick={downloadReceiptImage}
            disabled={!receiptElement}
          >
            Download Receipt (PNG)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;