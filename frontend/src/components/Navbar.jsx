import { Link } from 'react-router-dom';
import { Sprout, ShoppingBasket, User, LogIn, Menu, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  return (
    <nav style={{ 
      background: 'rgba(255, 255, 255, 0.9)', 
      backdropFilter: 'blur(10px)',
      position: 'sticky', 
      top: 0, 
      zIndex: 50,
      borderBottom: '1px solid var(--color-border)',
      padding: '1rem 0'
    }}>
      <div className="container flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2" style={{ color: 'var(--color-primary)' }}>
          <Sprout size={32} />
          <span style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.5px' }}>AgriLink<span style={{ color: 'var(--color-secondary)' }}>.AI</span></span>
        </Link>
        
        {/* Desktop Nav */}
        <div className="flex items-center gap-8" style={{ display: 'none' }} id="desktop-nav">
          <Link to="/" style={{ fontWeight: 500 }}>Home</Link>
          <Link to="/marketplace" style={{ fontWeight: 500 }}>Marketplace</Link>
          {user && user.role === 'farmer' && <Link to="/farmer-dashboard" style={{ fontWeight: 500 }}>Farmers</Link>}
          {user && user.role === 'consumer' && <Link to="/consumer-dashboard" style={{ fontWeight: 500 }}>Consumers</Link>}
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/cart" className="btn btn-outline" style={{ display: 'none', position: 'relative' }} id="desktop-btn">
            <ShoppingBasket size={18} style={{ marginRight: '0.5rem' }}/> Cart
            {cartCount > 0 && (
              <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--color-secondary)', color: 'white', borderRadius: '50%', padding: '0.1rem 0.5rem', fontSize: '0.8rem', fontWeight: 'bold' }}>{cartCount}</span>
            )}
          </Link>
          
          {user ? (
            <button onClick={logout} className="btn btn-primary" style={{ background: '#d32f2f' }}>
              <LogOut size={18} style={{ marginRight: '0.5rem' }} /> Logout
            </button>
          ) : (
            <Link to="/login" className="btn btn-primary">
              <LogIn size={18} style={{ marginRight: '0.5rem' }} /> Login
            </Link>
          )}
          
          <button className="btn btn-secondary" style={{ padding: '0.5rem' }} onClick={() => setIsOpen(!isOpen)} id="mobile-menu-btn">
            <Menu size={24} />
          </button>
        </div>
      </div>
      
      {/* Mobile Nav Dropdown */}
      {isOpen && (
        <div style={{ padding: '1rem', background: '#fff', borderBottom: '1px solid #eee' }}>
          <div className="flex flex-col gap-4">
            <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/marketplace" onClick={() => setIsOpen(false)}>Marketplace</Link>
            <Link to="/farmer-dashboard" onClick={() => setIsOpen(false)}>Farmers Dashboard</Link>
            <Link to="/consumer-dashboard" onClick={() => setIsOpen(false)}>Consumers Dashboard</Link>
            <Link to="/about" onClick={() => setIsOpen(false)}>About Us</Link>
          </div>
        </div>
      )}
      
      <style>{`
        @media (min-width: 768px) {
          #desktop-nav { display: flex !important; }
          #desktop-btn { display: inline-flex !important; }
          #mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
