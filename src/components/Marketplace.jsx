// src/components/Marketplace.jsx
import React, { useState } from 'react';
import ProductCard from './ProductCard';
import QRModal from './QRModal';
import SearchBar from './SearchBar';
import { products } from '../data/products';

export default function Marketplace({ points, setPoints }) {
  const [redeemedProduct, setRedeemedProduct] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const handleRedeem = (prod) => {
    if (points >= prod.pointsCost) {
      setPoints(prev => prev - prod.pointsCost);
      setRedeemedProduct(prod);
      setShowQR(true);
    }
  };

  const filteredProducts = products
    .filter(p =>
      (categoryFilter === "All" || p.category === categoryFilter) &&
      (p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  return (
    <div id="marketplace" className="marketplace">
      <h2>Marketplace</h2>

      {/* Category Filters */}
      <div className="category-filters">
        {["All", "Voucher", "Donation"].map(cat => (
          <button
            key={cat}
            className={`filter-btn ${categoryFilter === cat ? "active" : ""}`}
            onClick={() => setCategoryFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Product Grid */}
      <div className="product-grid">
        {filteredProducts.map(prod => (
          <ProductCard
            key={prod.id}
            product={prod}
            points={points}
            onRedeem={handleRedeem}
          />
        ))}
      </div>

      {/* QR Modal */}
      <QRModal
        open={showQR}
        product={redeemedProduct}
        onClose={() => setShowQR(false)}
      />
    </div>
  );
}
