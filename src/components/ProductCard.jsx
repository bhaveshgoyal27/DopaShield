// src/components/ProductCard.jsx
import React from 'react';

export default function ProductCard({ product, points, onRedeem }) {
  const canRedeem = points >= product.pointsCost;

  const handleClick = () => {
    if (!product.link) {
      onRedeem(product); // Open QR modal if no link
    }
  };

  return (
    <div className={`product-card ${canRedeem ? "can-redeem" : "cannot-redeem"}`}>
      {product.link ? (
        <a href={product.link} target="_blank" rel="noopener noreferrer">
          <img src={product.image} alt={product.name} className="product-image"/>
        </a>
      ) : (
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          onClick={handleClick}
          style={{ cursor: 'pointer' }}
        />
      )}

      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="category">{product.category}</p>
        <p>{product.description}</p>
        <p><strong>Vendor:</strong> {product.vendor}</p>
        <p><strong>Points:</strong> {product.pointsCost}</p>
      </div>

      <button disabled={!canRedeem} onClick={() => onRedeem(product)}>
        {canRedeem ? (product.category === "Donation" ? "Donate Points" : "Redeem") : "Not Enough Points"}
      </button>
    </div>
  );
}
