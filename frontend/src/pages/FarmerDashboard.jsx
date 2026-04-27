import { useState, useEffect } from 'react';
import { Package, TrendingUp, DollarSign, Brain, Plus, X } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// ✅ Added API base URL
const API = "https://agrilink-backend.onrender.com";

export default function FarmerDashboard() {
  const [insights, setInsights] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const { user } = useAuth();

  const [newProduct, setNewProduct] = useState({ name: '', category: '', price: '', quantity: '', unit: 'kg', organic: false, image: '', cultivated_date: '' });

  useEffect(() => {
    // ✅ FIXED
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
      axios.put(`${API}/api/products/${editingProductId}`, { ...newProduct })
        .then(() => {
          setShowAddModal(false);
          fetchProducts();
          setNewProduct({ name: '', category: '', price: '', quantity: '', unit: 'kg', organic: false, image: '', cultivated_date: '' });
          setEditingProductId(null);
        })
        .catch(err => alert("Failed to update product"));
    } else {
      // ✅ FIXED POST
      axios.post(`${API}/api/products`, {
        name: newProduct.name,
        category: newProduct.category,
        price: newProduct.price,
        quantity: newProduct.quantity,
        unit: newProduct.unit || "kg",
        organic: newProduct.organic || false,
        image: newProduct.image || "",
        cultivated_date: newProduct.cultivated_date || "",
        farmer_id: user.id
      })
        .then(() => {
          setShowAddModal(false);
          fetchProducts();
          setNewProduct({ name: '', category: '', price: '', quantity: '', unit: 'kg', organic: false, image: '', cultivated_date: '' });
        })
        .catch(err => {
          console.log(err.response?.data);
          alert("Failed to add product");
        });
    }
  };

  return (
    <div style={{ background: '#f4f7f4', minHeight: '100vh', padding: '2rem 0', position: 'relative' }}>
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 style={{ fontSize: '2rem', color: 'var(--color-primary-dark)' }}>Farmer Dashboard</h1>
            <p style={{ color: 'var(--color-text-muted)' }}>Manage your crops and view AI insights.</p>
          </div>
          <button className="btn btn-primary flex items-center gap-2" onClick={() => {
            setEditingProductId(null);
            setNewProduct({ name: '', category: '', price: '', quantity: '', unit: 'kg', organic: false, image: '', cultivated_date: '' });
            setShowAddModal(true);
          }}>
            <Plus size={18} /> Add Product
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard icon={<DollarSign size={24} />} title="Total Sales" value={`₹${orders.reduce((sum, order) => sum + order.total_price, 0).toFixed(2)}`} trend="Realtime" color="var(--color-primary)" />
          <StatCard icon={<Package size={24} />} title="Active Products" value={products.length.toString()} trend="Live" color="var(--color-secondary)" />
          <StatCard icon={<TrendingUp size={24} />} title="Profile Views" value="342" trend="+18%" color="#0288d1" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6 flex flex-col gap-6">
            <div className="card" style={{ padding: '1.5rem' }}>
              <h2>Your API Listings</h2>
              {products.length === 0 ? (
                <p>No products listed yet.</p>
              ) : (
                products.map(product => (
                  <div key={product.id}>
                    {product.name} - ₹{product.price}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '1rem' }}>
            <form onSubmit={handleAddProduct}>
              <input placeholder="Name" required onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
              <input placeholder="Category" required onChange={e => setNewProduct({...newProduct, category: e.target.value})} />
              <input type="number" placeholder="Price" required onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
              <input type="number" placeholder="Quantity" required onChange={e => setNewProduct({...newProduct, quantity: e.target.value})} />
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, title, value, trend, color }) {
  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <div>{icon}</div>
      <h3>{value}</h3>
      <p>{title}</p>
    </div>
  );
}
