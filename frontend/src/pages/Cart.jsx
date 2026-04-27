const express = require('express');


<<<<<<< HEAD
const router = express.Router();
=======
  const DELIVERY_FEE = 2.00;
>>>>>>> ce5ecb8 (fix cart db error)


// ✅ GET ALL PRODUCTS (same as yours)
router.get('/', (req, res) => {
    try {
        let query = `
            SELECT p.*, u.name as farmer_name, u.location as farmer_location 
            FROM products p 
            JOIN users u ON p.farmer_id = u.id
        `;
        const params = [];

        if (req.query.category) {
            query += ` WHERE p.category = ?`;
            params.push(req.query.category);
        }

        if (req.query.organic) {
            query += params.length > 0 ? ` AND` : ` WHERE`;
            query += ` p.organic = ?`;
            params.push(req.query.organic === 'true' ? 1 : 0);
        }

        const rows = db.prepare(query).all(...params);
        res.json(rows);

    } catch (err) {
        console.error("GET ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
<<<<<<< HEAD
});


// ✅ GET PRODUCTS BY FARMER
router.get('/farmer/:id', (req, res) => {
    try {
        const farmerId = req.params.id;

        const rows = db
            .prepare(`SELECT * FROM products WHERE farmer_id = ?`)
            .all(farmerId);

        res.json(rows);

    } catch (err) {
        console.error("FARMER GET ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});


// ✅ ADD PRODUCT (YOUR FULL VERSION FIXED)
router.post('/', (req, res) => {
    try {
        console.log("POST BODY:", req.body);

        const {
            farmer_id,
            name,
            category,
            price,
            quantity,
            unit,
            image,
            organic,
            cultivated_date
        } = req.body;

        if (!farmer_id || !name || !category || !price) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const query = `
            INSERT INTO products 
            (farmer_id, name, category, price, quantity, unit, image, organic, cultivated_date) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const stmt = db.prepare(query);

        const result = stmt.run(
            farmer_id,
            name,
            category,
            price,
            quantity || 0,
            unit || 'kg',
            image || '',
            organic ? 1 : 0,
            cultivated_date || ''
        );

        res.status(201).json({
            message: 'Product added successfully',
            productId: result.lastInsertRowid
        });

    } catch (err) {
        console.error("POST ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});


// ✅ GET SINGLE PRODUCT
router.get('/:id', (req, res) => {
    try {
        const productId = req.params.id;

        const query = `
            SELECT p.*, u.name as farmer_name, u.location as farmer_location 
            FROM products p 
            JOIN users u ON p.farmer_id = u.id
            WHERE p.id = ?
        `;

        const row = db.prepare(query).get(productId);

        if (!row) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(row);

    } catch (err) {
        console.error("GET ONE ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});


// ✅ UPDATE PRODUCT (YOUR VERSION FIXED)
router.put('/:id', (req, res) => {
    try {
        const productId = req.params.id;

        const {
            name,
            category,
            price,
            quantity,
            unit,
            image,
            organic,
            cultivated_date
        } = req.body;

        const query = `
            UPDATE products 
            SET name=?, category=?, price=?, quantity=?, unit=?, image=?, organic=?, cultivated_date=? 
            WHERE id=?
        `;

        db.prepare(query).run(
            name,
            category,
            price,
            quantity,
            unit,
            image,
            organic ? 1 : 0,
            cultivated_date || '',
            productId
        );

        res.json({ message: 'Product updated successfully' });

    } catch (err) {
        console.error("UPDATE ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
=======

    setPlacingOrder(true);

    const orderPayload = {
      consumer_id: user.id,
      items: cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      })),
      total_price: cartTotal + DELIVERY_FEE
    };

    // ✅ FIXED URL (IMPORTANT)
    axios.post('https://agrilink-backend-dhvp.onrender.com/api/orders', orderPayload)
      .then(res => {
        alert("Order successfully placed!");
        clearCart();
        navigate('/consumer-dashboard');
      })
      .catch(err => {
        console.error(err);
        alert(err.response?.data?.error || "Failed to place order.");
      })
      .finally(() => setPlacingOrder(false));
  };

  if (cart.length === 0) {
    return (
      <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--color-primary-dark)', marginBottom: '1rem' }}>
          Your Cart is Empty
        </h2>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Browse the marketplace to support local farmers.
        </p>
        <button
          className="btn btn-primary"
          style={{ marginTop: '2rem' }}
          onClick={() => navigate('/marketplace')}
        >
          Go to Marketplace
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--color-surface)', minHeight: '100vh', paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div className="container">
        <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary-dark)', marginBottom: '2rem' }}>
          Checkout
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Cart Items */}
          <div className="md:col-span-2">
            <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                  <img
                    src={item.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=2e7d32&color=fff&size=100`}
                    alt={item.name}
                    style={{ width: '80px', height: '80px', borderRadius: '0.5rem', objectFit: 'cover' }}
                  />

                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-primary-dark)' }}>
                      {item.name}
                    </h3>
                    <p style={{ color: 'var(--color-secondary)', fontWeight: 'bold' }}>
                      ₹{item.price} / {item.unit}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      From: {item.farmer_name}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="number"
                      className="input"
                      style={{ width: '70px', padding: '0.5rem' }}
                      value={item.quantity}
                      min="1"
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    />
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{ background: 'none', border: 'none', color: '#ff5252', cursor: 'pointer', padding: '0.5rem' }}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="card" style={{ padding: '1.5rem', position: 'sticky', top: '100px' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                Transparent Summary
              </h3>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span>Products Total</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span>Delivery Fee</span>
                <span>₹{DELIVERY_FEE.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold' }}>
                <span>Total</span>
                <span>₹{(cartTotal + DELIVERY_FEE).toFixed(2)}</span>
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1.5rem' }}
                onClick={handleCheckout}
                disabled={placingOrder}
              >
                <CreditCard size={20} /> {placingOrder ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
>>>>>>> ce5ecb8 (fix cart db error)
