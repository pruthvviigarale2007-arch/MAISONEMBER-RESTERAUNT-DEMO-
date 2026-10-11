const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'data', 'maison_ember.db');
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let db;
try {
  const { DatabaseSync } = require('node:sqlite');
  db = new DatabaseSync(dbPath);
} catch (err) {
  console.warn('Native node:sqlite not available, using JSON fallback adapter');
  // Simple fallback memory/file store if node:sqlite is absent
  db = createFallbackDb(path.join(dataDir, 'fallback_store.json'));
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      french_subtitle TEXT,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      price_display TEXT NOT NULL,
      badge TEXT,
      is_available INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reference TEXT UNIQUE NOT NULL,
      guest_name TEXT NOT NULL,
      guest_email TEXT NOT NULL,
      guest_phone TEXT NOT NULL,
      guest_notes TEXT,
      party_size INTEGER NOT NULL,
      seating_area TEXT NOT NULL,
      reservation_date TEXT NOT NULL,
      reservation_time TEXT NOT NULL,
      status TEXT DEFAULT 'confirmed',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      subscribed_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      event_type TEXT NOT NULL,
      preferred_date TEXT,
      guest_count INTEGER,
      message TEXT,
      status TEXT DEFAULT 'pending',
      created_at TEXT NOT NULL
    );
  `);

  seedData();
}

function seedData() {
  const countRow = db.prepare('SELECT COUNT(*) as count FROM menu_items').get();
  if (countRow && countRow.count > 0) {
    return; // Already seeded
  }

  const insertMenu = db.prepare(`
    INSERT INTO menu_items (category, title, french_subtitle, description, price, price_display, badge, is_available, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)
  `);

  const initialMenu = [
    // Starters & Crudo
    ['starters', 'Saint-Vaast Oyster over Embers', 'Huîtres aux braises', 'Briefly kissed by beech fire, smoked marrow butter, verjus mignonette, pickled sea fennel.', 22, '€22', 'GF', 1],
    ['starters', 'Brittany Scallop Crudo', 'Crudo de Saint-Jacques', 'Hand-dived, pressed walnut oil, charred blood orange vinegar, winter purslane.', 26, '€26', 'GF', 2],
    ['starters', 'Charred Leeks & Smoked Ricotta', 'Poireaux brûlés & ricotta fumée', 'Roasted whole in oak ash, house-made sheep ricotta, toasted hazelnuts, elderflower capers.', 18, '€18', 'V', 3],
    ['starters', 'Duck Rillettes & Hearth Brioche', 'Rillettes de canard confit', 'Maison-cured duck rillettes, spiced wild fig relish, pickled shallots, wood-fired toasted brioche.', 20, '€20', '', 4],
    ['starters', 'Charred Morel Mushrooms & Sabayon', 'Morilles au feu de bois', 'Wild spring morels sautéed over open iron, vin jaune sabayon, grilled brioche crisps.', 24, '€24', 'V', 5],

    // Wood-Fired Mains
    ['mains', 'Line-Caught Turbot on the Bone', 'Turbot de ligne au feu de bois', 'Slow-grilled over embers, brown butter fumet, glazed young leeks, wild sorrel oil.', 46, '€46', 'GF', 1],
    ['mains', 'Aveyron Lamb Saddle & Merguez', 'Selle d’agneau de l’Aveyron', 'Spit-roasted with rosemary twigs, ember-braised celtuce, smoked pepper jus.', 42, '€42', '', 2],
    ['mains', 'Dry-Aged Normande Ribeye (For Two)', 'Côte de bœuf maturée (Pour deux)', '55 days dry-aged, seared over wild cherry wood, roasted garlic marrow butter, shallot confit.', 115, '€115', '800g', 3],
    ['mains', 'Ash-Baked Delicata Squash', 'Courge Delicata cuite sous la cendre', 'Chestnut emulsion, toasted pumpkin seeds, crisp sage, vin jaune reductions.', 31, '€31', 'V / GF', 4],
    ['mains', 'Wood-Roasted Challans Duck Breast', 'Magret de canard de Challans', 'Smoked honey glaze, roasted late cherries, parsnip purée, crushed juniper jus.', 44, '€44', 'GF', 5],

    // Sides from the Ash
    ['sides', 'Smoked Ratte Potato Purée', 'Purée de pommes Ratte fumées', 'Cultured butter, sea salt flakes, churned hazelnut oil.', 10, '€10', 'V / GF', 1],
    ['sides', 'Ember-Charred Bitter Greens', 'Verdurettes braisées aux cendres', 'Seasonal chicory and brassicas kissed by coal, aged cider vinegar reduction.', 9, '€9', 'V / GF', 2],
    ['sides', 'Natural Levain Bread & Smoked Butter', 'Pain au levain & beurre fumé', '36-hour fermented country boule, butter churned and smoked over hazelnut twigs.', 6, '€6', 'V', 3],
    ['sides', 'Ash-Roasted Heritage Carrots', 'Carottes anciennes confites', 'Charred over Picardy birch, wildflower honey, cracked coriander seeds.', 11, '€11', 'V / GF', 4],

    // Cheeses & Desserts
    ['desserts', 'Fire-Roasted Quince & Bay Leaf Ice Cream', 'Coing rôti au feu & glace laurier', 'Slowly caramelized under embers, bay leaf infused crème glacée, buckwheat sablé.', 14, '€14', 'V', 1],
    ['desserts', 'Smoked Dark Chocolate Mousse (72% Guanaja)', 'Mousse au chocolat fumé', 'Valrhona Guanaja chocolate, cold-smoked Maldon sea salt, raw olive oil drizzle.', 15, '€15', 'V', 2],
    ['desserts', 'Raw Milk Comté (36 mo) Affinage', 'Comté affiné 36 mois', 'From Marcel Petite cellars, sourdough charcoal crackers, seasonal fig paste.', 16, '€16', 'V', 3],
    ['desserts', 'Wood-Baked Apple Tart & Crème Crue', 'Tarte fine tiède au feu de bois', 'Thin caramelized crust baked in hearth ashes, Normandy unpasteurized raw cream.', 14, '€14', 'V', 4],

    // Selected Cellar
    ['cellar', 'Domaine Courbet — Savagnin Maceration (Jura 2021)', 'Orange / Maceration', '3 weeks skin-contact, vibrant dried apricot, walnut smoke, deep living minerality.', 78, '€78 / €16 gls', 'Natural', 1],
    ['cellar', 'Domaine de l’Écu — ‘Orthogneiss’ Muscadet (Loire 2022)', 'Blanc Nature', 'Biodynamic, sur lie aging in subterranean vats, crushed oyster shell, citrus flint.', 58, '€58 / €12 gls', 'Bio', 2],
    ['cellar', 'Domaine Gramenon — ‘La Sagesse’ Côtes du Rhône (2022)', 'Rouge Nature', '60-year-old bush vine Grenache, natural amphora aging, wild garrigue, dark mulberry.', 72, '€72 / €15 gls', 'Biodynamic', 3],
    ['cellar', 'Alice et Olivier de Moor — Chablis ‘Coteau de Rosette’ (2021)', 'Blanc Terroir', 'Unfiltered natural Chardonnay, crystalline limestone tension, wild orchard blossom.', 98, '€98 / €20 gls', 'Rare', 4],
    ['cellar', 'Maison Ember Reserve Wild Ferment Cider (Normandy)', 'Cidre Vivant', 'Ancient heritage orchard apples, natural zero-sulfur bubbles, dry brioche and wood notes.', 32, '€32 / €8 gls', 'Artisanal', 5]
  ];

  for (const item of initialMenu) {
    insertMenu.run(...item);
  }

  // Seed sample reservations for upcoming dates
  const insertRes = db.prepare(`
    INSERT INTO reservations (reference, guest_name, guest_email, guest_phone, guest_notes, party_size, seating_area, reservation_date, reservation_time, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const todayStr = new Date().toISOString().split('T')[0];
  const sampleBookings = [
    ['EMB-8491', 'Éléonore de la Tour', 'eleonore.latour@paris.com', '+33 6 54 89 21 00', 'Anniversary celebration · 1 pescatarian guest', 2, 'Main Dining Room', todayStr, '19:45', 'confirmed', new Date().toISOString()],
    ['EMB-8492', 'Henri Rousseau', 'h.rousseau@marais.fr', '+33 6 12 34 56 78', 'Quiet table preferred', 4, 'Main Dining Room', todayStr, '19:45', 'confirmed', new Date().toISOString()],
    ['EMB-8493', 'Camille Delacroix', 'camille.d@atelier.fr', '+33 6 98 76 54 32', 'Wine pairing voyage requested', 2, 'Hearth Counter', todayStr, '20:30', 'confirmed', new Date().toISOString()],
    ['EMB-8494', 'Julien Moreau', 'j.moreau@presse.com', '+33 6 45 67 89 01', 'Chef Alexandre tasting menu', 6, 'Wine Vault Salon', todayStr, '20:30', 'confirmed', new Date().toISOString()],
    ['EMB-8495', 'Gaston Mercier', 'gaston@vins-nature.org', '+33 6 33 22 11 00', 'Sommelier table booking', 2, 'Hearth Counter', todayStr, '21:45', 'confirmed', new Date().toISOString()],
    ['EMB-8496', 'Sophie Laurent', 'sophie.laurent@sorbonne.fr', '+33 6 88 99 00 11', 'Birthday dinner', 4, 'Hearth Counter', todayStr, '21:45', 'confirmed', new Date().toISOString()],
    ['EMB-8497', 'Pierre Bertin', 'p.bertin@design.fr', '+33 6 77 88 99 00', 'Gluten-free for 1 guest', 2, 'Hearth Counter', todayStr, '21:45', 'confirmed', new Date().toISOString()]
  ];

  for (const b of sampleBookings) {
    try {
      insertRes.run(...b);
    } catch (_) {}
  }

  // Seed newsletter subscribers
  const insertSub = db.prepare(`
    INSERT OR IGNORE INTO newsletter_subscribers (email, subscribed_at)
    VALUES (?, ?)
  `);
  insertSub.run('sommelier.notes@maisonember.com', new Date().toISOString());
  insertSub.run('gastronome@paris-eats.com', new Date().toISOString());

  // Seed sample private inquiry
  const insertInq = db.prepare(`
    INSERT INTO inquiries (name, email, phone, event_type, preferred_date, guest_count, message, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertInq.run(
    'Antoine de Saint-Germain',
    'antoine@lux-foundation.fr',
    '+33 1 44 55 66 77',
    'Private Dining Salon',
    '2026-11-28',
    12,
    'Private 6-course tasting menu with biodynamic wine pairings for our board dinner.',
    'pending',
    new Date().toISOString()
  );
}

// In-memory fallback if node:sqlite is ever missing
function createFallbackDb(storeFile) {
  let state = {
    menu_items: [],
    reservations: [],
    newsletter_subscribers: [],
    inquiries: []
  };
  if (fs.existsSync(storeFile)) {
    try {
      state = JSON.parse(fs.readFileSync(storeFile, 'utf8'));
    } catch (e) {}
  }

  function save() {
    try {
      fs.writeFileSync(storeFile, JSON.stringify(state, null, 2));
    } catch (e) {}
  }

  return {
    exec(sql) {},
    prepare(sql) {
      return {
        get(...params) {
          if (sql.includes('COUNT(*)')) {
            const table = sql.match(/FROM\s+(\w+)/i)?.[1];
            return { count: (state[table] || []).length };
          }
          if (sql.includes('SELECT * FROM reservations WHERE reference = ?')) {
            return (state.reservations || []).find(r => r.reference === params[0]);
          }
          if (sql.includes('SELECT * FROM reservations WHERE id = ?')) {
            return (state.reservations || []).find(r => r.id === Number(params[0]));
          }
          return null;
        },
        all(...params) {
          if (sql.includes('FROM menu_items')) {
            if (sql.includes('WHERE category = ?')) {
              return (state.menu_items || []).filter(m => m.category === params[0]);
            }
            return state.menu_items || [];
          }
          if (sql.includes('FROM reservations')) {
            if (sql.includes('reservation_date = ?')) {
              return (state.reservations || []).filter(r => r.reservation_date === params[0] && r.status !== 'cancelled');
            }
            return state.reservations || [];
          }
          if (sql.includes('FROM newsletter_subscribers')) {
            return state.newsletter_subscribers || [];
          }
          if (sql.includes('FROM inquiries')) {
            return state.inquiries || [];
          }
          return [];
        },
        run(...params) {
          if (sql.includes('INSERT INTO menu_items')) {
            const id = (state.menu_items.length || 0) + 1;
            state.menu_items.push({
              id,
              category: params[0],
              title: params[1],
              french_subtitle: params[2],
              description: params[3],
              price: params[4],
              price_display: params[5],
              badge: params[6],
              is_available: 1,
              sort_order: params[7]
            });
            save();
            return { lastInsertRowid: id };
          }
          if (sql.includes('INSERT INTO reservations')) {
            const id = (state.reservations.length || 0) + 1;
            state.reservations.push({
              id,
              reference: params[0],
              guest_name: params[1],
              guest_email: params[2],
              guest_phone: params[3],
              guest_notes: params[4],
              party_size: params[5],
              seating_area: params[6],
              reservation_date: params[7],
              reservation_time: params[8],
              status: params[9],
              created_at: params[10]
            });
            save();
            return { lastInsertRowid: id };
          }
          if (sql.includes('INSERT') && sql.includes('newsletter_subscribers')) {
            const existing = (state.newsletter_subscribers || []).find(s => s.email === params[0]);
            if (!existing) {
              const id = (state.newsletter_subscribers.length || 0) + 1;
              state.newsletter_subscribers.push({ id, email: params[0], subscribed_at: params[1] });
              save();
              return { lastInsertRowid: id };
            }
            return { lastInsertRowid: existing.id };
          }
          if (sql.includes('INSERT INTO inquiries')) {
            const id = (state.inquiries.length || 0) + 1;
            state.inquiries.push({
              id,
              name: params[0],
              email: params[1],
              phone: params[2],
              event_type: params[3],
              preferred_date: params[4],
              guest_count: params[5],
              message: params[6],
              status: params[7],
              created_at: params[8]
            });
            save();
            return { lastInsertRowid: id };
          }
          if (sql.includes('UPDATE reservations SET status = ? WHERE id = ?')) {
            const res = (state.reservations || []).find(r => r.id === Number(params[1]));
            if (res) { res.status = params[0]; save(); }
            return { changes: 1 };
          }
          if (sql.includes('DELETE FROM reservations WHERE id = ?')) {
            state.reservations = (state.reservations || []).filter(r => r.id !== Number(params[0]));
            save();
            return { changes: 1 };
          }
          return { changes: 0 };
        }
      };
    }
  };
}

initSchema();

module.exports = db;
