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
<<<<<<< HEAD

    // ✅ FIXED API
    axios.get(`${API}/api/ai/recommendations/consumer/1`)
=======
    // ✅ FIXED (no localhost)
    axios.get('/api/ai/recommendations/consumer/1')
>>>>>>> ce5ecb8 (fix cart db error)
      .then(res => setRecommendations(res.data))
      .catch(err => console.log(err));

    if (user) {
<<<<<<< HEAD
      axios.get(`${API}/api/orders/consumer/${user.id}`)
=======
      axios.get(`/api/orders/consumer/${user.id}`)
>>>>>>> ce5ecb8 (fix cart db error)
        .then(res => setOrders(res.data))
        .catch(err => console.log('Error fetching orders:', err));
    }

  }, [user]);

  return (
    <div style={{ background: '#f4f7f4', minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container">
<<<<<<< HEAD

        <h1>Welcome back, {user ? user.name : 'Guest'}!</h1>

        <h2>Your Orders</h2>
        {orders.map(order => (
          <div key={order.id}>
            {order.product_name} - ₹{order.total_price}
=======
        
        {/* Header */}
        <div className="mb-8">
          <h1 style={{ fontSize: '2rem', color: 'var(--color-primary-dark)' }}>
            Welcome back, {user ? user.name : 'Guest'}!
          </h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Here is your fresh produce overview.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <ActionCard icon={<ShoppingBag />} title="Orders" subtitle={`${orders.length} Past Orders`} isActive />
          <ActionCard icon={<Truck />} title="Tracking" subtitle="Active deliveries" />
          <ActionCard icon={<Heart />} title="Favorites" subtitle="Saved farms" />
          <ActionCard icon={<Clock />} title="Subscriptions" subtitle="Manage recurring" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Orders */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              Your Order History
            </h2>

            {orders.length === 0 ? (
              <p>You haven't placed any orders yet.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {orders.map(order => (
                  <div key={order.id} className="p-3 border rounded">
                    <p><b>Status:</b> {order.status}</p>
                    <p><b>Date:</b> {new Date(order.order_date).toLocaleDateString()}</p>
                    <p><b>Product:</b> {order.product_name}</p>
                    <p><b>Farmer:</b> {order.farmer_name}</p>
                    <p><b>Amount:</b> ₹{order.total_price}</p>
                    <p><b>Qty:</b> {order.quantity}</p>
                  </div>
                ))}
              </div>
            )}
>>>>>>> ce5ecb8 (fix cart db error)
          </div>
        ))}

<<<<<<< HEAD
        <h2>AI Recommendations</h2>
        {recommendations.map((item, idx) => (
          <div key={idx}>
            {item.name} - ₹{item.price}
          </div>
        ))}

=======
          {/* AI Recommendations */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h2>AI Suggested For You</h2>

            {recommendations.length > 0 ? (
              recommendations.map((item, idx) => (
                <div key={idx} className="p-3 border rounded mb-2">
                  <p><b>{item.name}</b> ₹{item.price}</p>
                  <p>{item.reasoning}</p>
                </div>
              ))
            ) : (
              <p>Loading AI recommendations...</p>
            )}
          </div>

        </div>
>>>>>>> ce5ecb8 (fix cart db error)
      </div>
    </div>
  );
}
<<<<<<< HEAD
=======

function ActionCard({ icon, title, subtitle, isActive }) {
  return (
    <div className="card flex items-center gap-4" style={{ padding: '1.5rem' }}>
      <div>{icon}</div>
      <div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}
>>>>>>> ce5ecb8 (fix cart db error)
