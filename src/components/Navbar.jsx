// src/components/Navbar.jsx
import React from 'react';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-logo">DopaShield Marketplace</div>
      <ul className="nav-links">
        <li><a href="#dashboard">Dashboard</a></li>
        <li><a href="#marketplace">Marketplace</a></li>
        <li><a href="#about">About Us</a></li>
      </ul>
    </nav>
  );
}
