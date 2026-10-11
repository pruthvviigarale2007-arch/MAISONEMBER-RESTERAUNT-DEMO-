const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/menu?category=starters
router.get('/', (req, res) => {
  try {
    const { category } = req.query;
    let items;
    if (category && category !== 'all') {
      items = db.prepare(`
        SELECT * FROM menu_items
        WHERE category = ?
        ORDER BY sort_order ASC, id ASC
      `).all(category);
    } else {
      items = db.prepare(`
        SELECT * FROM menu_items
        ORDER BY category ASC, sort_order ASC, id ASC
      `).all();
    }

    // Grouping helper if requested without filter
    const categories = {
      starters: items.filter(i => i.category === 'starters'),
      mains: items.filter(i => i.category === 'mains'),
      sides: items.filter(i => i.category === 'sides'),
      desserts: items.filter(i => i.category === 'desserts'),
      cellar: items.filter(i => i.category === 'cellar')
    };

    res.json({
      success: true,
      total: items.length,
      items,
      grouped: categories
    });
  } catch (err) {
    console.error('Menu fetch error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch menu items.' });
  }
});

// POST /api/menu
router.post('/', (req, res) => {
  try {
    const { category, title, french_subtitle, description, price, price_display, badge, is_available } = req.body;
    if (!category || !title || !description || price === undefined) {
      return res.status(400).json({ success: false, error: 'Category, title, description, and price are required.' });
    }

    const priceNum = parseFloat(price);
    const display = price_display || `€${priceNum}`;
    const insertStmt = db.prepare(`
      INSERT INTO menu_items (category, title, french_subtitle, description, price, price_display, badge, is_available, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 99)
    `);

    const result = insertStmt.run(
      category,
      title.trim(),
      (french_subtitle || '').trim(),
      description.trim(),
      priceNum,
      display,
      (badge || '').trim(),
      is_available !== undefined ? (is_available ? 1 : 0) : 1
    );

    const created = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, item: created });
  } catch (err) {
    console.error('Menu create error:', err);
    res.status(500).json({ success: false, error: 'Failed to add menu item.' });
  }
});

// PATCH /api/menu/:id
router.patch('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const item = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(Number(id));
    if (!item) {
      return res.status(404).json({ success: false, error: 'Dish not found.' });
    }

    const updates = req.body;
    const title = updates.title !== undefined ? updates.title : item.title;
    const french_subtitle = updates.french_subtitle !== undefined ? updates.french_subtitle : item.french_subtitle;
    const description = updates.description !== undefined ? updates.description : item.description;
    const price = updates.price !== undefined ? parseFloat(updates.price) : item.price;
    const price_display = updates.price_display !== undefined ? updates.price_display : (updates.price ? `€${updates.price}` : item.price_display);
    const badge = updates.badge !== undefined ? updates.badge : item.badge;
    const is_available = updates.is_available !== undefined ? (updates.is_available ? 1 : 0) : item.is_available;
    const sort_order = updates.sort_order !== undefined ? parseInt(updates.sort_order, 10) : item.sort_order;

    db.prepare(`
      UPDATE menu_items
      SET title = ?, french_subtitle = ?, description = ?, price = ?, price_display = ?, badge = ?, is_available = ?, sort_order = ?
      WHERE id = ?
    `).run(title, french_subtitle, description, price, price_display, badge, is_available, sort_order, Number(id));

    const updated = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(Number(id));
    res.json({ success: true, item: updated });
  } catch (err) {
    console.error('Menu update error:', err);
    res.status(500).json({ success: false, error: 'Failed to update menu item.' });
  }
});

// DELETE /api/menu/:id
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const result = db.prepare('DELETE FROM menu_items WHERE id = ?').run(Number(id));
    if (result.changes === 0) {
      return res.status(404).json({ success: false, error: 'Dish not found.' });
    }
    res.json({ success: true, message: 'Item deleted.' });
  } catch (err) {
    console.error('Menu delete error:', err);
    res.status(500).json({ success: false, error: 'Failed to delete menu item.' });
  }
});

module.exports = router;
