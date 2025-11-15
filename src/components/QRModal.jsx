// src/components/QRModal.jsx
import React from 'react';
import qrImage from '../assets/static-qr.png';

export default function QRModal({ open, product, onClose }) {
  if (!open || !product) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>
          {product.category === "Donation" ? "Thank you for donating!" : `Redeemed: ${product.name}`}
        </h3>
        <p>Vendor: {product.vendor}</p>

        {product.category !== "Donation" && (
          <div style={{ margin: '16px 0' }}>
            <img src={qrImage} alt="Static QR Code" style={{ width: '128px', height: '128px' }} />
          </div>
        )}

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
