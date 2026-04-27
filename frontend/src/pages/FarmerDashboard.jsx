import { useState, useEffect } from 'react';
import { Package, TrendingUp, DollarSign, Brain, Plus, X } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = "https://agrilink-backend.onrender.com";

export default function FarmerDashboard() {
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const { user } = useAuth();

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    quantity: ''
  });

  useEffect(() => {
    if (user) {
      axios.get(`${API}/api/products/farmer/${user.id}`)
        .then(res => setProducts(res.data))
        .catch(err => console.log(err));
    }
  }, [user]);

  const handleAddProduct = (e) => {
    e.preventDefault();

    axios.post(`${API}/api/products`, {
      ...newProduct,
      farmer_id: user.id
    })
      .then(() => {
        setShowAddModal(false);
        window.location.reload();
      })
      .catch(() => alert("Failed to add product"));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Farmer Dashboard</h1>

      <button onClick={() => setShowAddModal(true)}>
        Add Product
      </button>

      {products.map(product => (
        <div key={product.id}>
          {product.name} - ₹{product.price}
        </div>
      ))}

      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <form onSubmit={handleAddProduct} style={{
            background: '#fff',
            padding: '20px',
            borderRadius: '10px'
          }}>
            <h2>Add Product</h2>

            <input placeholder="Name" required
              onChange={e => setNewProduct({...newProduct, name: e.target.value})}
            />

            <input placeholder="Category" required
              onChange={e => setNewProduct({...newProduct, category: e.target.value})}
            />

            <input type="number" placeholder="Price" required
              onChange={e => setNewProduct({...newProduct, price: e.target.value})}
            />

            <input type="number" placeholder="Quantity" required
              onChange={e => setNewProduct({...newProduct, quantity: e.target.value})}
            />

            <br /><br />

            <button type="submit">Submit</button>
            <button type="button" onClick={() => setShowAddModal(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
}
