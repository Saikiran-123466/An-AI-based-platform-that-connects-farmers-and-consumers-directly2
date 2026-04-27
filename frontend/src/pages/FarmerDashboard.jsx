import { useState, useEffect } from 'react';
import { Package, TrendingUp, DollarSign, Brain, Plus, X } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// ✅ ADD THIS (single place to control backend URL)
const API = "https://agrilink-backend.onrender.com";

export default function FarmerDashboard() {
  const [insights, setInsights] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const { user } = useAuth();

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
    // ✅ FIXED API URL
    axios.get(`${API}/api/ai/insights/farmer/1`)
      .then(res => setInsights(res.data))
      .catch(err => console.log(err));

    if (user) {
      fetchProducts();
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = () => {
    axios.get(`${API}/api/orders/farmer/${user.id}`)
      .then(res => setOrders(res.data))
      .catch(err => console.log(err));
  };

  const fetchProducts = () => {
    axios.get(`${API}/api/products/farmer/${user.id}`)
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  };

  const handleEditClick = (product) => {
    setEditingProductId(product.id);
    setNewProduct({
      name: product.name,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
      unit: product.unit,
      organic: product.organic ? true : false,
      image: product.image || '',
      cultivated_date: product.cultivated_date || ''
    });
    setShowAddModal(true);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();

    if (editingProductId) {
      // ✅ UPDATE PRODUCT
      axios.put(`${API}/api/products/${editingProductId}`, { ...newProduct })
        .then(() => {
          setShowAddModal(false);
          fetchProducts();
          setEditingProductId(null);
        })
        .catch(() => alert("Failed to update product"));
    } else {
      // ✅ ADD PRODUCT
      axios.post(`${API}/api/products`, {
        ...newProduct,
        farmer_id: user.id
      })
        .then(() => {
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
        .catch(() => alert("Failed to add product"));
    }
  };

  return (
    <div style={{ background: '#f4f7f4', minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container">
        <h1>Farmer Dashboard</h1>

        <button onClick={() => setShowAddModal(true)}>
          Add Product
        </button>

        {/* Products */}
        {products.map(product => (
          <div key={product.id}>
            {product.name} - ₹{product.price}
          </div>
        ))}

        {/* Add Product Modal */}
        {showAddModal && (
          <form onSubmit={handleAddProduct}>
            <input placeholder="Name" required
              value={newProduct.name}
              onChange={e => setNewProduct({...newProduct, name: e.target.value})}
            />

            <input placeholder="Category" required
              value={newProduct.category}
              onChange={e => setNewProduct({...newProduct, category: e.target.value})}
            />

            <input type="number" placeholder="Price" required
              onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
            />

            <input type="number" placeholder="Quantity" required
              onChange={e => setNewProduct({...newProduct, quantity: parseInt(e.target.value)})}
            />

            <button type="submit">
              Publish Product Listing
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
