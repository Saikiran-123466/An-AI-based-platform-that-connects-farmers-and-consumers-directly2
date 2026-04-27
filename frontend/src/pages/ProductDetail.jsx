import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { ShoppingCart, ArrowLeft, ShieldCheck } from 'lucide-react';


const API = "https://agrilink-backend-dhvp.onrender.com";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    // ✅ PRODUCT FETCH
    axios.get(`${API}/api/products/${id}`)
      .then(res => {
        console.log("PRODUCT:", res.data);
        setProduct(res.data);
      })
      .catch(err => {
        console.log('Error fetching product:', err);
      })
      .finally(() => setLoading(false));

    // ✅ AI RECOMMENDATIONS (SAFE VERSION)
    axios.get(`${API}/api/ai/recommendations/consumer/1`)
      .then(res => {
        if (res.data && Array.isArray(res.data)) {
          const mapped = res.data.map((r, idx) => ({
            id: 100 + idx,
            name: r.name || "Recommended Item",
            price: r.price || 0,
            unit: 'kg',
            farmer_name: 'Local Network',
            farmer_location: 'Nearby',
            organic: true,
            image: r.image || ""
          }));
          setRecommendations(mapped);
        }
      })
      .catch(err => {
        console.log("AI ERROR:", err);
      });

  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div style={{ padding: '20px' }}>

      {/* BACK BUTTON */}
      <button onClick={() => navigate(-1)} style={{ marginBottom: '15px' }}>
        <ArrowLeft size={18} /> Back
      </button>

      {/* PRODUCT DETAILS */}
      <h1>{product.name}</h1>
      <h2>₹{product.price} / {product.unit}</h2>

      <p><b>Farmer:</b> {product.farmer_name}</p>
      <p><b>Location:</b> {product.farmer_location}</p>

      {product.organic && (
        <p style={{ color: 'green' }}>
          <ShieldCheck size={16} /> Organic Product
        </p>
      )}

      {/* ADD TO CART */}
      <button
        onClick={() => addToCart(product)}
        style={{
          marginTop: '15px',
          padding: '10px',
          background: '#0a8f3d',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        <ShoppingCart size={18} /> Add to Cart
      </button>

      {/* AI RECOMMENDATIONS */}
      <h3 style={{ marginTop: '30px' }}>AI Suggestions</h3>

      {recommendations.length === 0 ? (
        <p>No recommendations available</p>
      ) : (
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          {recommendations.map(rec => (
            <div key={rec.id} style={{
              border: '1px solid #ddd',
              padding: '10px',
              borderRadius: '8px',
              width: '180px'
            }}>
              <p><b>{rec.name}</b></p>
              <p>₹{rec.price}</p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
