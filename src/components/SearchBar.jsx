// src/components/SearchBar.jsx
import React from 'react';

export default function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <input
      type="text"
      placeholder="Search products..."
      value={searchTerm}
      onChange={e => setSearchTerm(e.target.value)}
      className="search-bar"
    />
  );
}
