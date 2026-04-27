import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

const API = "https://agrilink-backend-dhvp.onrender.com";

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setLoading(true);

    axios.get(`${API}/api/products`)
      .then(res => {
        console.log("PRODUCTS:", res.data);
        setProducts(res.data);
      })
      .catch(err => {
        console.log("ERROR:", err);
      })
      .finally(() => setLoading(false));

  }, []);

  const filteredProducts = products.filter(p => {
    if (filter === 'organic') return p.organic;
    if (filter === 'vegetables') return p.category === 'vegetables';
    if (filter === 'fruits') return p.category === 'fruits';
    if (filter === 'grains') return p.category === 'grains';
    return true;
  });

  return (
    <div style={{ background: 'var(--color-surface)', minHeight: '100vh', paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div className="container">

        <h1>Fresh Marketplace</h1>

        {/* Filters */}
        <div className="flex gap-2 mb-4">
          {['all', 'organic', 'vegetables', 'fruits', 'grains'].map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}>
              {cat}
            </button>
          ))}
        </div>

        {/* Products */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {filteredProducts.map(product => (
              <div key={product.id}>
                {product.name} - ₹{product.price}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
