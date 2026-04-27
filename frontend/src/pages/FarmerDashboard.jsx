import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = "https://agrilink-backend.onrender.com";

// ✅ input style
const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  outline: "none"
};

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

      <button
        onClick={() => setShowAddModal(true)}
        style={{
          padding: "10px 15px",
          background: "#0a8f3d",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer"
        }}
      >
        + Add Product
      </button>

      <h3 style={{ marginTop: "20px" }}>Your Products</h3>
      {products.map(p => (
        <div key={p.id}>
          {p.name} - ₹{p.price}
        </div>
      ))}

      {/* ✅ MODAL */}
      {showAddModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "12px",
            width: "400px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            position: "relative"
          }}>

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setShowAddModal(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "15px",
                border: "none",
                background: "none",
                fontSize: "20px",
                cursor: "pointer"
              }}
            >
              ✕
            </button>

            <h2 style={{ marginBottom: "15px" }}>Add New Product</h2>

            <form onSubmit={handleAddProduct}>

              <input
                placeholder="Product Name"
                value={newProduct.name}
                onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                style={inputStyle}
              />

              <input
                placeholder="Category"
                value={newProduct.category}
                onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                style={inputStyle}
              />

              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="number"
                  placeholder="Price ₹"
                  value={newProduct.price}
                  onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                  style={{ ...inputStyle, flex: 1 }}
                />

                <input
                  type="number"
                  placeholder="Quantity"
                  value={newProduct.quantity}
                  onChange={e => setNewProduct({...newProduct, quantity: e.target.value})}
                  style={{ ...inputStyle, flex: 1 }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  marginTop: "10px",
                  padding: "10px",
                  background: "#0a8f3d",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Publish Product
              </button>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
