import { useState, useEffect } from 'react';
import { ShoppingBag, Clock, Heart, Truck, Package } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = "https://agrilink-backend-dhvp.onrender.com";

export default function ConsumerDashboard() {
  const [recommendations, setRecommendations] = useState([]);
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();

  useEffect(() => {

    // ✅ FIXED API
    axios.get(`${API}/api/ai/recommendations/consumer/1`)
      .then(res => setRecommendations(res.data))
      .catch(err => console.log(err));

    if (user) {
      axios.get(`${API}/api/orders/consumer/${user.id}`)
        .then(res => setOrders(res.data))
        .catch(err => console.log('Error fetching orders:', err));
    }

  }, [user]);

  return (
    <div style={{ background: '#f4f7f4', minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container">

        <h1>Welcome back, {user ? user.name : 'Guest'}!</h1>

        <h2>Your Orders</h2>
        {orders.map(order => (
          <div key={order.id}>
            {order.product_name} - ₹{order.total_price}
          </div>
        ))}

        <h2>AI Recommendations</h2>
        {recommendations.map((item, idx) => (
          <div key={idx}>
            {item.name} - ₹{item.price}
          </div>
        ))}

      </div>
    </div>
  );
}
