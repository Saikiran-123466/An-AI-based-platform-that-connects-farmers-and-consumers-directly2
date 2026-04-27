import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = "https://agrilink-backend.onrender.com";

export default function FarmerDashboard() {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    unit: 'kg',
    organic: false,
    image: '',
    cultivated_date: ''
  });

  useEffect(() => {
    if (user) fetchProducts();
  }, [user]);

  const fetchProducts = () => {
    axios.get(`${API}/api/products/farmer/${user.id}`)
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  };

  const handleAddProduct = (e) => {
    e.preventDefault();

    axios.post(`${API}/api/products`, {
      farmer_id: user.id,
      name: newProduct.name,
      category: newProduct.category,
      price: Number(newProduct.price),
      quantity: Number(newProduct.quantity),
      unit: "kg",
      image: "",
      organic: 0,
      cultivated_date: ""
    })
    .then(() => {
      alert("✅ Product added successfully");
      setShowAddModal(false);
      fetchProducts();
      setNewProduct({
        name: '',
        category: '',
        price: '',
        quantity: '',
        unit: 'kg',
        organic: false,
        image: '',
        cultivated_date: ''
      });
    })
    .catch(err => {
      console.log("FULL ERROR:", err);
      console.log("SERVER ERROR:", err.response?.data);
      alert("❌ Failed to add product");
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Farmer Dashboard</h1>

      <button onClick={() => setShowAddModal(true)}>
        Add Product
      </button>

      <h3>Your Products</h3>
      {products.map(p => (
        <div key={p.id}>
          {p.name} - ₹{p.price}
        </div>
      ))}

      {/* MODAL */}
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

            <input
              placeholder="Name"
              value={newProduct.name}
              onChange={e => setNewProduct({...newProduct, name: e.target.value})}
            />

            <input
              placeholder="Category"
              value={newProduct.category}
              onChange={e => setNewProduct({...newProduct, category: e.target.value})}
            />

            <input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={e => setNewProduct({...newProduct, price: e.target.value})}
            />

            <input
              type="number"
              placeholder="Quantity"
              value={newProduct.quantity}
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
