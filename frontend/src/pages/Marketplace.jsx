import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

export default function Marketplace() {
  const [products, setProducts] = useState([
    // Mock initial state before connection
    { id: 1, name: 'Fresh Tomatoes', price: 2.50, unit: 'kg', farmer_name: 'John Doe', farmer_location: 'Greenville', organic: true, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400' },
    { id: 2, name: 'Organic Potatoes', price: 1.20, unit: 'kg', farmer_name: 'Sarah Smith', farmer_location: 'Valley Farm', organic: true, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=400' },
    { id: 3, name: 'Sweet Corn', price: 0.80, unit: 'piece', farmer_name: 'Mike Johnson', farmer_location: 'Sunny Acres', organic: false, image: 'https://images.unsplash.com/photo-1550828553-3b6d27464010?auto=format&fit=crop&q=80&w=400' },
    { id: 4, name: 'Crisp Lettuce', price: 1.50, unit: 'head', farmer_name: 'John Doe', farmer_location: 'Greenville', organic: true, image: 'https://images.unsplash.com/photo-1622204555811-1dafb67e3a6a?auto=format&fit=crop&q=80&w=400' },
  ]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Attempt to fetch from backend if running
    setLoading(true);
    axios.get('http://localhost:5000/api/products')
      .then(res => {
        if(res.data && res.data.length > 0) setProducts(res.data);
      })
      .catch(err => console.log("Using mock data, backend not populated yet:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter(p => {
    if (filter === 'organic') return p.organic;
    return true;
  });

  return (
    <div style={{ background: 'var(--color-surface)', minHeight: '100vh', paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>Fresh Marketplace</h1>
            <p style={{ color: 'var(--color-text-muted)' }}>Buy directly from verified local farmers.</p>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="input-group" style={{ flex: 1, position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--color-text-muted)' }} />
              <input type="text" placeholder="Search vegetables, fruits..." className="input" style={{ paddingLeft: '2.5rem', minWidth: '250px' }} />
            </div>
            <button className="btn btn-outline flex items-center gap-2">
              <Filter size={18} /> Filter
            </button>
          </div>
        </div>
        
        {/* Category Pills */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {['all', 'organic', 'vegetables', 'fruits', 'grains'].map(cat => (
            <button 
              key={cat}
              className={`badge ${filter === cat ? 'badge-green' : ''}`}
              style={{ 
                border: filter === cat ? '2px solid var(--color-primary)' : '1px solid var(--color-border)', 
                background: filter === cat ? '#e8f5e9' : 'transparent',
                color: filter === cat ? 'var(--color-primary-dark)' : 'inherit',
                cursor: 'pointer', padding: '0.5rem 1rem', fontSize: '1rem', textTransform: 'capitalize'
              }}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center" style={{ padding: '4rem 0' }}>Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
