const express = require('express');
const cors = require('cors');
const path = require('path');

const reservationsRouter = require('./routes/reservations');
const menuRouter = require('./routes/menu');
const newsletterRouter = require('./routes/newsletter');
const inquiriesRouter = require('./routes/inquiries');
const statsRouter = require('./routes/stats');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..', 'public')));

// API Routes
app.use('/api/reservations', reservationsRouter);
app.use('/api/menu', menuRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/inquiries', inquiriesRouter);
app.use('/api/stats', statsRouter);

// Page Routes (separate navigation pages)
app.get(['/menu', '/menu.html'], (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'menu.html'));
});
app.get(['/cellar', '/cellar.html'], (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'cellar.html'));
});
app.get(['/atmosphere', '/atmosphere.html'], (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'atmosphere.html'));
});
app.get(['/reservations', '/reservations.html'], (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'reservations.html'));
});
app.get(['/private-dining', '/private-dining.html'], (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'private-dining.html'));
});

// Staff admin portal friendly route
app.get(['/admin', '/admin.html'], (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'admin.html'));
});

// Root API overview
app.get('/api', (req, res) => {
  res.json({
    restaurant: 'Maison Ember — Open-Hearth Cooking & Natural Cellar',
    location: '14 Rue des Tournelles, 75004 Paris',
    version: '1.0.0',
    endpoints: {
      menu: '/api/menu',
      reservations: '/api/reservations',
      availability: '/api/reservations/availability?date=YYYY-MM-DD&area=Main%20Dining%20Room&party=2',
      newsletter: '/api/newsletter',
      inquiries: '/api/inquiries',
      stats: '/api/stats'
    }
  });
});

// Fallback for SPA or unknown client paths
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Start server if executed directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log('====================================================');
    console.log(`🔥 Maison Ember Restaurant Server running!`);
    console.log(`📍 Web Experience:  http://localhost:${PORT}/`);
    console.log(`📋 Staff Atelier:   http://localhost:${PORT}/admin`);
    console.log(`⚡ REST API Status: http://localhost:${PORT}/api`);
    console.log('====================================================');
  });
}

module.exports = app;
