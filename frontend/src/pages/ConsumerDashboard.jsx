import { useState, useEffect } from 'react';
import { ShoppingBag, Clock, Heart, Truck, Package } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function ConsumerDashboard() {
  const [recommendations, setRecommendations] = useState([]);
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    // Fetch mock AI recommendations
    axios.get('http://localhost:5000/api/ai/recommendations/consumer/1')
      .then(res => setRecommendations(res.data))
      .catch(err => console.log(err));

    if (user) {
      axios.get(`http://localhost:5000/api/orders/consumer/${user.id}`)
        .then(res => setOrders(res.data))
        .catch(err => console.log('Error fetching orders:', err));
    }
  }, [user]);

  return (
    <div style={{ background: '#f4f7f4', minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container">
        <div className="mb-8">
          <h1 style={{ fontSize: '2rem', color: 'var(--color-primary-dark)' }}>Welcome back, {user ? user.name : 'Guest'}!</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Here is your fresh produce overview.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <ActionCard icon={<ShoppingBag />} title="Orders" subtitle={`${orders.length} Past Orders`} isActive />
          <ActionCard icon={<Truck />} title="Tracking" subtitle="Active deliveries" />
          <ActionCard icon={<Heart />} title="Favorites" subtitle="Saved farms" />
          <ActionCard icon={<Clock />} title="Subscriptions" subtitle="Manage recurring" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order History */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Your Order History</h2>
            
            {orders.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)' }}>You haven't placed any orders yet. Visit the Marketplace to support local farmers!</p>
            ) : (
              <div className="flex flex-col gap-4">
                {orders.map(order => (
                  <div key={order.id} style={{ background: '#f8fcf5', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                    <div className="flex justify-between items-center mb-2">
                      <span className={`badge ${order.status === 'pending' ? 'badge-yellow' : 'badge-green'}`} style={{ textTransform: 'capitalize' }}>
                        {order.status}
                      </span>
                      <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                        {new Date(order.order_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div style={{ padding: '0.5rem', background: '#e0e0e0', borderRadius: '50%' }}>
                          <Package size={20} color="var(--color-primary-dark)" />
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, color: 'var(--color-primary-dark)' }}>{order.product_name}</p>
                          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>From: {order.farmer_name}</p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontWeight: 'bold', color: 'var(--color-secondary)' }}>₹{order.total_price.toFixed(2)}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Qty: {order.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Recommended for You */}
          <div className="card ai-glow" style={{ padding: '1.5rem', border: '1px solid var(--color-primary-light)' }}>
            <div className="flex justify-between items-center mb-4">
              <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary-dark)' }}>AI Suggested For You</h2>
              <span style={{ fontSize: '0.8rem', background: 'var(--color-primary)', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>Personalized</span>
            </div>
            
            <div className="flex flex-col gap-4">
              {recommendations.length > 0 ? recommendations.map((item, idx) => (
                <div key={idx} className="flex gap-4 p-3" style={{ border: '1px solid #ebebeb', borderRadius: 'var(--radius-md)', background: '#fff' }}>
                  <div style={{ width: '60px', height: '60px', background: '#eee', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=ffb300&color=fff`} alt={item.name} style={{width:'100%', height:'100%'}}/>
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{item.name} <span style={{ color: 'var(--color-secondary)' }}>₹{item.price.toFixed(2)}</span></h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{item.reasoning}</p>
                  </div>
                </div>
              )) : (
                <p>Loading AI recommendations...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionCard({ icon, title, subtitle, isActive }) {
  return (
    <div className="card flex items-center gap-4" style={{ padding: '1.5rem', cursor: 'pointer', border: isActive ? '2px solid var(--color-primary)' : '' }}>
      <div style={{ background: isActive ? 'var(--color-primary)' : '#e8f5e9', color: isActive ? '#fff' : 'var(--color-primary)', padding: '1rem', borderRadius: '50%' }}>
        {icon}
      </div>
      <div>
        <h3 style={{ fontSize: '1.1rem' }}>{title}</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{subtitle}</p>
      </div>
    </div>
  )
}
