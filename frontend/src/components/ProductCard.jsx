import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="card flex flex-col" style={{ height: '100%', cursor: 'pointer', transition: 'transform 0.2s ease', '&:hover': { transform: 'translateY(-5px)' } }} onClick={() => navigate(`/product/${product.id}`)}>
      <div style={{ position: 'relative', height: '200px', backgroundColor: '#eef6ec' }}>
        <img 
          src={product.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=2e7d32&color=fff&size=400`} 
          alt={product.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {product.organic && (
          <span className="badge badge-green" style={{ position: 'absolute', top: '10px', left: '10px', boxShadow: 'var(--shadow-sm)' }}>
            🌱 Organic
          </span>
        )}
      </div>
      
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div className="flex justify-between items-center mb-2">
          <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)' }}>{product.name}</h3>
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-secondary)' }}>₹{product.price}/{product.unit}</span>
        </div>
        
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1rem', flex: 1 }}>
          From: {product.farmer_name} • {product.farmer_location}
        </p>
        
        <button 
          className="btn btn-primary" 
          style={{ width: '100%', marginTop: 'auto' }} 
          onClick={(e) => { e.stopPropagation(); addToCart(product); }}
        >
          <ShoppingCart size={18} style={{ marginRight: '0.5rem' }} /> Add to Cart
        </button>
      </div>
    </div>
  );
}
