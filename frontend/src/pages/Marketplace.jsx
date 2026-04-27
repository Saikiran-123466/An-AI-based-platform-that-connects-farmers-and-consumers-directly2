import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

const API = "https://agrilink-backend-dhvp.onrender.com";

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);

<<<<<<< HEAD
    axios.get(`${API}/api/products`)
      .then(res => {
        console.log("PRODUCTS:", res.data);
        setProducts(res.data);
      })
      .catch(err => {
        console.log("ERROR:", err);
=======
    // ✅ Fetch products from backend
    axios.get('/api/products')
      .then(res => {
        setProducts(res.data || []);
      })
      .catch(err => {
        console.error("Error fetching products:", err);
>>>>>>> ce5ecb8 (fix cart db error)
      })
      .finally(() => setLoading(false));

  }, []);

  // ✅ Filter logic
  const filteredProducts = products.filter(p => {
<<<<<<< HEAD
    if (filter === 'organic') return p.organic;
    if (filter === 'vegetables') return p.category === 'vegetables';
    if (filter === 'fruits') return p.category === 'fruits';
    if (filter === 'grains') return p.category === 'grains';
    return true;
=======
    const matchesFilter = filter === 'all' || (filter === 'organic' && p.organic);
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
>>>>>>> ce5ecb8 (fix cart db error)
  });

  return (
    <div style={{ background: 'var(--color-surface)', minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container">

<<<<<<< HEAD
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
=======
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary-dark)' }}>
              Fresh Marketplace
            </h1>
            <p style={{ color: 'var(--color-text-muted)' }}>
              Buy directly from local farmers
            </p>
          </div>

          {/* Search */}
          <div className="flex gap-4 w-full md:w-auto">
            <div style={{ position: 'relative', width: '250px' }}>
              <Search size={18} style={{ position: 'absolute', top: '10px', left: '10px' }} />
              <input
                type="text"
                placeholder="Search..."
                className="input"
                style={{ paddingLeft: '2rem', width: '100%' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button className="btn btn-outline">
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6">
          <button
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>

          <button
            className={`btn ${filter === 'organic' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter('organic')}
          >
            Organic
          </button>
        </div>

        {/* Products */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            Loading products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            No products available. Add from Farmer Dashboard 🚜
          </div>
>>>>>>> ce5ecb8 (fix cart db error)
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