import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { ShoppingCart, ArrowLeft, ShieldCheck } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const API = "https://agrilink-backend-dhvp.onrender.com";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    // ✅ FIXED PRODUCT API
    axios.get(`${API}/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => {
        console.log('Error fetching product:', err);
      })
      .finally(() => setLoading(false));

    // ✅ FIXED AI API
    axios.get(`${API}/api/ai/recommendations/consumer/1`)
      .then(res => {
        const mockRecs = res.data.map((r, idx) => ({
          id: 100 + idx,
          name: r.name,
          price: r.price,
          unit: 'kg',
          farmer_name: 'Local Network',
          farmer_location: 'Nearby',
          organic: true
        }));
        setRecommendations(mockRecs);
      })
      .catch(err => console.log(err));

  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div>

      <button onClick={() => navigate(-1)}>Back</button>

      <h1>{product.name}</h1>
      <h2>₹{product.price}</h2>

      <p>Farmer: {product.farmer_name}</p>
      <p>Location: {product.farmer_location}</p>

      <button onClick={() => addToCart(product)}>
        Add to Cart
      </button>

      <h3>AI Suggestions</h3>
      {recommendations.map(rec => (
        <div key={rec.id}>
          {rec.name} - ₹{rec.price}
        </div>
      ))}

    </div>
  );
}
