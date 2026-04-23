import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Leaf, ShieldCheck, Sun } from 'lucide-react';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section style={{ 
        position: 'relative', 
        padding: '6rem 0', 
        overflow: 'hidden',
        background: 'linear-gradient(to bottom right, #f8fcf5, #e8f5e9)'
      }}>
        <div className="container grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-16">
          <div style={{ zIndex: 1 }}>
            <div className="badge badge-green mb-4" style={{ display: 'inline-block', marginBottom: '1rem' }}>
              ✨ Future of Farming
            </div>
            <h1 style={{ fontSize: '3.5rem', lineHeight: 1.1, marginBottom: '1.5rem', color: 'var(--color-primary-dark)' }}>
              From Farm to Table — <br/>
              <span className="ai-glow" stroke="text" style={{ color: 'var(--color-primary)' }}>Powered by AI</span>
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', marginBottom: '2rem', maxWidth: '500px' }}>
              Eliminate middlemen and get fairer prices. Smart insights for farmers, fresh produce for consumers.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link to="/marketplace" className="btn btn-primary">
                Buy Fresh Produce <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
              </Link>
              <Link to="/farmer-dashboard" className="btn btn-secondary">
                Sell Your Crops 
              </Link>
            </div>
          </div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Dynamic visual representation */}
            <div style={{ 
              background: '#fff', 
              padding: '2rem', 
              borderRadius: 'var(--radius-lg)', 
              boxShadow: 'var(--shadow-lg)',
              position: 'relative'
            }}>
              <img 
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800" 
                alt="Fresh organic vegetables" 
                style={{ borderRadius: 'var(--radius-md)', width: '100%', objectFit: 'cover' }}
              />
              {/* Floating AI badge */}
              <div style={{ 
                position: 'absolute', 
                bottom: '-20px', 
                right: '-20px', 
                background: 'var(--color-surface)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                border: '2px solid var(--color-primary-light)'
              }}>
                <div style={{ background: 'var(--color-primary)', padding: '0.5rem', borderRadius: '50%', color: '#fff' }}>
                  <Brain size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>AI Prediction</div>
                  <div style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>High Demand</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background Decorative blob */}
        <div style={{
          position: 'absolute', top: '-10%', right: '-5%', width: '600px', height: '600px',
          background: 'var(--color-primary-light)', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.1, zIndex: 0
        }}></div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '5rem 0', background: 'var(--color-surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--color-primary-dark)', marginBottom: '1rem' }}>Smart Platform for Everyone</h2>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              Leveraging state-of-the-art AI to ensure an optimized supply chain and premium quality.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Brain size={32} color="var(--color-primary)" />}
              title="AI Price Insights"
              desc="Machine learning algorithms analyze market trends to suggest optimal pricing."
            />
            <FeatureCard 
              icon={<ShieldCheck size={32} color="var(--color-primary)" />}
              title="Verified Farmers"
              desc="Complete transparency. Know exactly where your food comes from."
            />
            <FeatureCard 
              icon={<Sun size={32} color="var(--color-primary)" />}
              title="Real-time Weather"
              desc="Integrated climatic data to help farmers maximize crop yield safely."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="card" style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ 
        width: '80px', height: '80px', borderRadius: '50%', 
        background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', 
        marginBottom: '1.5rem'
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-text-main)' }}>{title}</h3>
      <p style={{ color: 'var(--color-text-muted)' }}>{desc}</p>
    </div>
  )
}
