// The Thalis — Static / GitHub Pages Demo API Interceptor
(function installTheThalisDemoApi() {
  if (window.__theThalisDemoApiInstalled) return;
  window.__theThalisDemoApiInstalled = true;

  const STORAGE_KEY = 'the_thalis_demo_store_v1';
  const INITIAL_MENU = [
    { id: 1, category: 'mutton', title: 'Jatra Mutton Thali', title_mr: 'जत्रा मटन थाळी', description: 'Royal festival thali: Succulent Kolhapuri mutton sukka & fry, aromatic mutton kheema bowl, unlimited fiery Tambda Rassa, soothing Pandhra Rassa, 2 hot Jowar or Bajra Bhakris, fragrant Indrayani rice, and fresh onion-lemon.', description_mr: 'शाही जत्रा थाळी: खास कोल्हापुरी मटन सुक्का व फ्राय, मटन खिमा वाटी, अमर्याद झणझणीत तांबडा रस्सा, पांढरा रस्सा, २ गरमागरम ज्वारी/बाजरी भाकरी, इंद्रायणी भात आणि कांदा-लिंबू.', price: 520, price_display: '₹520', badge: 'Signature Bestseller', badge_mr: 'खास जत्रा स्पेशल', is_veg: 0, sort_order: 1 },
    { id: 2, category: 'mutton', title: 'Mutton Chops Thali', title_mr: 'मटन चॉप्स थाळी', description: 'Tender bone-in ribs and chops simmered in stone-ground Kolhapuri spices, with unlimited Tambda & Pandhra Rassa, choice of Bhakri/Chapati, and rice.', description_mr: 'मऊ लुसलुशीत मटन चॉप्स, दगडी पाट्यावर वाटलेल्या मसाल्यात शिजवलेले, अमर्याद तांबडा-पांढरा रस्सा आणि ताजी भाकरी.', price: 550, price_display: '₹550', badge: 'Popular', badge_mr: 'लोकप्रिय', is_veg: 0, sort_order: 2 },
    { id: 3, category: 'mutton', title: 'Ghee Mutton Fry', title_mr: 'तूप मटन फ्राय', description: 'Tender mutton chunks pan-roasted in pure Gir cow desi ghee, infused with dagad phool, dried coconut, and roasted onion paste.', description_mr: 'गीर गायीच्या साजूक तुपात भाजलेले मटन, दगडफूल, सुके खोबरे आणि भाजलेला कांदा-लसूण मसाल्याची अनोखी चव.', price: 460, price_display: '₹460', badge: 'Chef Specialty', badge_mr: 'साजूक तूप स्पेशल', is_veg: 0, sort_order: 3 },
    { id: 4, category: 'mutton', title: 'Mutton Chops Fry Plate', title_mr: 'मटन चॉप्स फ्राय', description: 'Succulent lamb chops pan-seared with fresh crushed garlic, ginger, and signature Kolhapuri kanda-lasun masala.', description_mr: 'ताजा ठेचलेला लसूण, आले आणि अस्सल कोल्हापुरी कांदा-लसूण चटणीमध्ये खरपूस फ्राय केलेले मटन चॉप्स.', price: 420, price_display: '₹420', badge: 'Must Try', badge_mr: 'नक्की ट्राय करा', is_veg: 0, sort_order: 4 },
    { id: 5, category: 'mutton', title: 'Kharda Mutton Plate', title_mr: 'खरडा मटन', description: 'Rustic countryside mutton fry tossed in fire-roasted green chilies, golden garlic, and crushed peanuts.', description_mr: 'गावरान पद्धतीचा तिखट हिरव्या मिरच्यांचा ठेचा (खरडा), खमंग लसूण आणि भाजलेल्या शेंगदाण्यांमध्ये परतून बनवलेले मटन.', price: 440, price_display: '₹440', badge: 'Spicy', badge_mr: 'झणझणीत', is_veg: 0, sort_order: 5 },
    { id: 6, category: 'mutton', title: 'Mutton Masala Thali', title_mr: 'मटन मसाला थाळी', description: 'Traditional thick gravy mutton prepared in an iron kadhai with whole roasted spices, served with unlimited rassa bowls and hot bhakri.', description_mr: 'लोखंडी कढईत मंद आचेवर शिजवलेले दाट ग्रेव्हीचे मटन, अमर्याद रस्सा वाट्या आणि गरमागरम भाकरी.', price: 480, price_display: '₹480', badge: 'Classic', badge_mr: 'पारंपारिक', is_veg: 0, sort_order: 6 },
    { id: 7, category: 'chicken', title: 'Chicken Fry Thali', title_mr: 'चिकन फ्राय थाळी', description: 'Country-style tender chicken fry tossed in roasted spices, served with unlimited Tambda & Pandhra Rassa, 2 Bhakris, and Indrayani rice.', description_mr: 'गावरान चवीचे चिकन फ्राय, अमर्याद तांबडा व पांढरा रस्सा, २ भाकरी आणि सुवासिक इंद्रायणी भात.', price: 380, price_display: '₹380', badge: 'Popular', badge_mr: 'लोकप्रिय', is_veg: 0, sort_order: 1 },
    { id: 8, category: 'chicken', title: 'Chicken Masala Thali', title_mr: 'चिकन मसाला थाळी', description: 'Rich, robust red-gravy chicken masala accompanied by unlimited Tambda & Pandhra Rassa, bhakri, and rice.', description_mr: 'झणझणीत लाल तर्रीचे चिकन मसाला, अमर्याद तांबडा-पांढरा रस्सा, भाकरी आणि भात.', price: 390, price_display: '₹390', badge: 'Bestseller', badge_mr: 'खास पसंती', is_veg: 0, sort_order: 2 },
    { id: 9, category: 'chicken', title: 'Chicken Kharda Plate', title_mr: 'चिकन खरडा', description: 'Boneless & bone-in chicken tossed in spicy green thecha, roasted garlic, and toasted coriander.', description_mr: 'हिरव्या मिरचीच्या झणझणीत खरड्यात परतलेले चिकन, भाजलेला लसूण आणि कोथिंबीर.', price: 340, price_display: '₹340', badge: 'Kolhapuri Tikhat', badge_mr: 'कोल्हापुरी तिखट', is_veg: 0, sort_order: 3 },
    { id: 10, category: 'chicken', title: 'The Thalis Special Chicken', title_mr: 'द थाळीज स्पेशल चिकन', description: 'Marinated overnight in 28 authentic Kolhapuri spices and slow-roasted over low flame.', description_mr: '२८ अस्सल कोल्हापुरी मसाल्यांमध्ये मॅरीनेट करून मंद आचेवर शिजवलेले द थाळीज स्पेशल चिकन.', price: 420, price_display: '₹420', badge: 'House Special', badge_mr: 'द थाळीज स्पेशल', is_veg: 0, sort_order: 4 },
    { id: 11, category: 'seafood', title: 'Surmai Fry Thali', title_mr: 'सुरमई फ्राय थाळी', description: 'Fresh sea Kingfish (Surmai) steak marinated in kokum and red spices, rava-crusted and crisp fried, served with coastal rassa, bhakri, and rice.', description_mr: 'आगळ (कोकम) आणि मसाल्यात घोळवून रव्यामध्ये कुरकुरीत तळलेली ताजी सुरमई, कोल्हापुरी रस्सा आणि भाकरी.', price: 520, price_display: '₹520', badge: 'Fresh Catch', badge_mr: 'ताजी सुरमई', is_veg: 0, sort_order: 1 },
    { id: 12, category: 'seafood', title: 'Prawns Rava Fry', title_mr: 'प्रॉन्स रवा फ्राय', description: 'Juicy fresh prawns coated in spiced semolina batter, golden fried to crunchy perfection with lemon wedges.', description_mr: 'मसालेदार रव्यात घोळवून कुरकुरीत तळलेली रसरशीत कोळंबी (प्रॉन्स), लिंबू आणि हिरवी चटणी.', price: 440, price_display: '₹440', badge: 'Crispy', badge_mr: 'कुरकुरीत', is_veg: 0, sort_order: 2 },
    { id: 13, category: 'veg', title: 'Veg Pithla Bhakari Thali', title_mr: 'पिठलं भाकरी थाळी', description: 'Authentic gram flour pithla cooked with tempered garlic, green chilies, and mustard, served with 2 fresh Jowar/Bajra Bhakris, raw onion, spicy thecha, and cooling curd.', description_mr: 'लसणीची खमंग फोडणी दिलेले गरमागरम पिठलं, २ ताज्या ज्वारी/बाजरीच्या भाकरी, गावरान ठेचा, कांदा आणि ताजे दही.', price: 260, price_display: '₹260', badge: 'Pure Veg Bestseller', badge_mr: 'शाकाहारी स्पेशल', is_veg: 1, sort_order: 1 },
    { id: 14, category: 'veg', title: 'Shev Bhaji Kolhapuri Thali', title_mr: 'शेव भाजी थाळी', description: 'Spicy Kolhapuri red tari gravy topped with crisp Ratlami sev, served with bhakri, veg pandhra rassa, and rice.', description_mr: 'झणझणीत कोल्हापुरी लाल तर्री शेव भाजी, कुरकुरीत शेव, भाकरी, व्हेज पांढरा रस्सा आणि भात.', price: 280, price_display: '₹280', badge: 'Pure Veg', badge_mr: 'शाकाहारी', is_veg: 1, sort_order: 2 },
    { id: 15, category: 'veg', title: 'Paneer Kolhapuri Thali', title_mr: 'पनीर कोल्हापुरी थाळी', description: 'Soft cottage cheese simmered in spicy and tangy Kolhapuri masala, paired with hot chapatis, salad, and veg pulav.', description_mr: 'मऊ पनीरचे तुकडे अस्सल कोल्हापुरी तिखट मसाल्यात, गरमागरम चपाती, कोशिंबीर आणि पुलाव.', price: 320, price_display: '₹320', badge: 'Pure Veg', badge_mr: 'शाकाहारी', is_veg: 1, sort_order: 3 },
    { id: 16, category: 'veg', title: 'Veg Pulav', title_mr: 'व्हेज पुलाव', description: 'Aromatic long-grain basmati rice cooked with fresh seasonal vegetables and whole spices, served with cooling boondi raita.', description_mr: 'ताजा भाजीपाला आणि खडा मसाल्यात बनवलेला सुवासिक बासमती पुलाव आणि बुंदी रायता.', price: 180, price_display: '₹180', badge: 'Pure Veg', badge_mr: 'शाकाहारी', is_veg: 1, sort_order: 4 },
    { id: 17, category: 'rassa_specials', title: 'Tambada Rassa Bowl', title_mr: 'तांबडा रस्सा', description: 'Fiery, thin, soul-warming red broth brewed with mutton bones and signature Kolhapuri red chili blend. Unlimited refills with any thali.', description_mr: 'अस्सल कोल्हापुरी लवंगी व ब्याडगी मिरचीच्या वाटणात उकळलेला जाज्वल्य लाल तांबडा रस्सा. थाळीसोबत अमर्याद मोफत.', price: 80, price_display: '₹80 (Free with Thali)', badge: 'World Famous', badge_mr: 'जगप्रसिद्ध', is_veg: 0, sort_order: 1 },
    { id: 18, category: 'rassa_specials', title: 'Pandhra Rassa Bowl', title_mr: 'पांढरा रस्सा', description: 'Velvety, aromatic white broth brewed with coconut milk, white poppy seeds, cashews, and aromatic spices. Unlimited refills with any thali.', description_mr: 'ताजे नारळाचे दूध, खसखस, काजू आणि खड्या मसाल्यात बनवलेला मखमली सुगंधी पांढरा रस्सा. थाळीसोबत अमर्याद मोफत.', price: 90, price_display: '₹90 (Free with Thali)', badge: 'Heritage Recipe', badge_mr: 'शाही रेसिपी', is_veg: 0, sort_order: 2 },
    { id: 19, category: 'rassa_specials', title: 'Solkadhi', title_mr: 'सोलकढी', description: 'Chilled digestive beverage handcrafted with pure Malvani kokum extract, freshly grated coconut milk, and crushed garlic.', description_mr: 'ताजे नारळाचे दूध, अस्सल कोकम आगळ आणि ठेचलेल्या लसणाची पचनास गुणकारी थंडगार सोलकढी.', price: 70, price_display: '₹70', badge: 'Digestive', badge_mr: 'पाचक', is_veg: 1, sort_order: 3 },
    { id: 20, category: 'rassa_specials', title: 'Mastani Pan', title_mr: 'मस्तानी पान', description: 'Signature sweet paan stuffed with rose gulkand, dried fruits, tutty-fruity, and silver vark.', description_mr: 'गुलाब गुलकंद, सुकामेवा आणि चांदीच्या वर्खाने सजवलेले स्वादिष्ट मस्तानी मीठा पान.', price: 60, price_display: '₹60', badge: 'Sweet Finish', badge_mr: 'गोड पान', is_veg: 1, sort_order: 4 }
  ];

  function getStore() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.items) && parsed.items.length > 0) return parsed;
      }
    } catch (e) {}

    const store = {
      items: INITIAL_MENU,
      orders: [
        { id: 1, order_ref: 'KOL-8841', customer_name: 'Anand Shinde', customer_phone: '09823011223', delivery_type: 'delivery', delivery_address: 'Kadamwadi, Kolhapur', items_json: JSON.stringify([{ title: 'Jatra Mutton Thali', qty: 2, price: 520 }, { title: 'Solkadhi', qty: 2, price: 70 }]), spice_level: 'Kolhapuri Tikhat', bread_choice: 'Jowar Bhakri', total_amount: 1180, payment_method: 'UPI on Delivery', status: 'Preparing', created_at: new Date().toISOString() },
        { id: 2, order_ref: 'KOL-8842', customer_name: 'Priyanka Patil', customer_phone: '09422033445', delivery_type: 'pickup', delivery_address: '', items_json: JSON.stringify([{ title: 'Chicken Fry Thali', qty: 1, price: 380 }, { title: 'Veg Pithla Bhakari Thali', qty: 1, price: 260 }]), spice_level: 'Medium', bread_choice: 'Bajra Bhakri', total_amount: 640, payment_method: 'Cash on Delivery', status: 'Cooking', created_at: new Date().toISOString() }
      ],
      reservations: [
        { id: 1, booking_ref: 'RES-901', guest_name: 'Dr. Rahul Mane', guest_phone: '09890123456', guest_email: 'rahul.mane@gmail.com', party_size: 4, sitting_date: new Date().toISOString().split('T')[0], sitting_time: '20:00', seating_area: 'Family AC Section', notes: 'Anniversary dinner with extra pandhra rassa', status: 'confirmed', created_at: new Date().toISOString() }
      ]
    };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); } catch (e) {}
    return store;
  }

  function saveStore(store) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); } catch (e) {}
  }

  const origFetch = window.fetch.bind(window);
  window.fetch = async function (resource, options = {}) {
    const url = typeof resource === 'string' ? resource : resource.url;
    const isStaticEnv = window.location.protocol === 'file:' || window.location.hostname.includes('github.io') || window.location.port === '';

    if (!isStaticEnv) {
      try {
        return await origFetch(resource, options);
      } catch (err) {
        console.warn('[The Thalis Demo API] Backend unreachable, falling back to local demo mock:', err);
      }
    }

    const method = (options.method || 'GET').toUpperCase();
    const store = getStore();

    function jsonRes(data, status = 200) {
      return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 1. Menu API
    if (url.includes('/api/menu') && method === 'GET') {
      return jsonRes({ success: true, items: store.items });
    }

    // 2. Orders API
    if (url.includes('/api/orders') && method === 'POST') {
      const body = JSON.parse(options.body || '{}');
      const orderRef = 'KOL-' + Math.floor(1000 + Math.random() * 9000);
      const newOrder = {
        id: store.orders.length + 1,
        order_ref: orderRef,
        customer_name: body.customer_name || 'Guest',
        customer_phone: body.customer_phone || '',
        delivery_type: body.delivery_type || 'delivery',
        delivery_address: body.delivery_address || '',
        items_json: typeof body.items === 'string' ? body.items : JSON.stringify(body.items || []),
        spice_level: body.spice_level || 'Medium',
        bread_choice: body.bread_choice || 'Jowar Bhakri',
        total_amount: Number(body.total_amount || 0),
        payment_method: body.payment_method || 'UPI on Delivery',
        status: 'Preparing',
        created_at: new Date().toISOString()
      };
      store.orders.unshift(newOrder);
      saveStore(store);
      return jsonRes({ success: true, order_ref: orderRef, order: newOrder });
    }

    if (url.includes('/api/orders') && method === 'GET') {
      return jsonRes({ success: true, orders: store.orders });
    }

    // 3. Reservations API
    if (url.includes('/api/reservations') && method === 'POST') {
      const body = JSON.parse(options.body || '{}');
      const bookingRef = 'THALI-' + Math.floor(1000 + Math.random() * 9000);
      const newRes = {
        id: store.reservations.length + 1,
        booking_ref: bookingRef,
        guest_name: body.guest_name || 'Guest',
        guest_phone: body.guest_phone || '',
        guest_email: body.guest_email || '',
        party_size: Number(body.party_size || 2),
        sitting_date: body.sitting_date || new Date().toISOString().split('T')[0],
        sitting_time: body.sitting_time || '19:30',
        seating_area: body.seating_area || 'Family AC Section',
        notes: body.notes || '',
        status: 'confirmed',
        created_at: new Date().toISOString()
      };
      store.reservations.unshift(newRes);
      saveStore(store);
      return jsonRes({ success: true, booking_ref: bookingRef, reservation: newRes });
    }

    if (url.includes('/api/reservations') && method === 'GET') {
      return jsonRes({ success: true, reservations: store.reservations });
    }

    // 4. Admin Stats
    if (url.includes('/api/stats') && method === 'GET') {
      const totalRevenue = store.orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
      return jsonRes({
        success: true,
        stats: {
          total_orders: store.orders.length,
          total_reservations: store.reservations.length,
          total_revenue: totalRevenue,
          total_menu_items: store.items.length
        }
      });
    }

    return origFetch(resource, options);
  };
})();

// The Thalis - Kolhapuri Thali Client Controller

document.addEventListener('DOMContentLoaded', () => {
  // 1. Top Dishes Hero Carousel Controller
  const carouselContainer = document.getElementById('hero-carousel-container');
  if (carouselContainer) {
    const slides = carouselContainer.querySelectorAll('.dish-slide');
    const dots = carouselContainer.querySelectorAll('.carousel-dot');
    const prevBtn = document.getElementById('carousel-prev-btn');
    const nextBtn = document.getElementById('carousel-next-btn');
    const counterEl = document.getElementById('carousel-current-index');
    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoPlayTimer = null;

    function showSlide(index) {
      if (totalSlides === 0) return;
      currentIndex = (index + totalSlides) % totalSlides;

      slides.forEach((slide, idx) => {
        if (idx === currentIndex) {
          slide.classList.remove('hidden');
          slide.classList.add('active');
        } else {
          slide.classList.add('hidden');
          slide.classList.remove('active');
        }
      });

      dots.forEach((dot, idx) => {
        if (idx === currentIndex) {
          dot.className = 'carousel-dot h-2 w-5 bg-amber-400 rounded-full transition-all';
        } else {
          dot.className = 'carousel-dot h-2 w-2 bg-stone-700 hover:bg-stone-500 rounded-full transition-all';
        }
      });

      if (counterEl) {
        counterEl.textContent = currentIndex + 1;
      }
    }

    function nextSlide() {
      showSlide(currentIndex + 1);
    }

    function prevSlide() {
      showSlide(currentIndex - 1);
    }

    function startAutoPlay() {
      stopAutoPlay();
      autoPlayTimer = setInterval(nextSlide, 4500);
    }

    function stopAutoPlay() {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoPlay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoPlay(); });

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const slideIdx = parseInt(dot.getAttribute('data-slide'), 10);
        showSlide(slideIdx);
        startAutoPlay();
      });
    });

    carouselContainer.addEventListener('mouseenter', stopAutoPlay);
    carouselContainer.addEventListener('mouseleave', startAutoPlay);

    // Initialize carousel
    showSlide(0);
    startAutoPlay();
  }

  // 2. Menu Fetching, Category Filtering & Language Switcher
  const menuContainer = document.getElementById('thali-menu-grid');
  const categoryBtns = document.querySelectorAll('.category-filter-btn');
  const btnLangEn = document.getElementById('btn-lang-en');
  const btnLangMr = document.getElementById('btn-lang-mr');
  let currentLang = localStorage.getItem('the_thalis_lang') || 'en';
  let currentCat = 'all';
  let cachedMenuItems = [];

  function updateLanguageUI() {
    // Update language toggle buttons
    if (btnLangEn && btnLangMr) {
      if (currentLang === 'en') {
        btnLangEn.className = 'lang-btn px-4 py-1 rounded-full text-xs font-bold transition-all bg-brand-red text-white shadow-sm';
        btnLangMr.className = 'lang-btn px-4 py-1 rounded-full text-xs font-bold transition-all text-stone-800 hover:text-brand-red';
      } else {
        btnLangEn.className = 'lang-btn px-4 py-1 rounded-full text-xs font-bold transition-all text-stone-800 hover:text-brand-red';
        btnLangMr.className = 'lang-btn px-4 py-1 rounded-full text-xs font-bold transition-all bg-brand-red text-white shadow-sm';
      }
    }

    // Update Category Filter Tab Texts
    categoryBtns.forEach(btn => {
      const enText = btn.getAttribute('data-en');
      const mrText = btn.getAttribute('data-mr');
      if (enText && mrText) {
        btn.textContent = currentLang === 'mr' ? mrText : enText;
      }
    });

    // Update Menu Header Texts
    const eyebrowEl = document.getElementById('menu-eyebrow');
    const titleEl = document.getElementById('menu-main-title');
    const descEl = document.getElementById('menu-main-desc');
    const labelEl = document.getElementById('lang-switch-label');

    if (currentLang === 'mr') {
      if (eyebrowEl) eyebrowEl.textContent = 'अस्सल कोल्हापुरी थाळी मेनू';
      if (titleEl) titleEl.textContent = 'शाही कोल्हापुरी थाळी मेनू';
      if (descEl) descEl.innerHTML = 'प्रत्येक थाळीसोबत चुलीवरचा गरमागरम <strong>तांबडा रस्सा</strong> व <strong>पांढरा रस्सा</strong> अमर्याद, तव्यावर भाजलेली ताजी ज्वारी/बाजरी भाकरी आणि सुवासिक इंद्रायणी भात.';
      if (labelEl) labelEl.textContent = 'भाषा निवडा:';
      
      const gTitle = document.getElementById('guarantee-title');
      const gRassaT = document.getElementById('g-rassa-title');
      const gRassaD = document.getElementById('g-rassa-desc');
      const gBreadT = document.getElementById('g-bread-title');
      const gBreadD = document.getElementById('g-bread-desc');
      const gRiceT = document.getElementById('g-rice-title');
      const gRiceD = document.getElementById('g-rice-desc');
      if (gTitle) gTitle.textContent = 'प्रत्येक कोल्हापुरी थाळीमध्ये काय मिळते?';
      if (gRassaT) gRassaT.textContent = '🥘 अमर्याद रस्सा वाट्या';
      if (gRassaD) gRassaD.textContent = 'जेवणासोबत गरमागरम तांबडा रस्सा आणि पांढरा रस्सा अमर्याद फ्री रिफिल्स.';
      if (gBreadT) gBreadT.textContent = '🫓 आवडीची गरमागरम भाकरी';
      if (gBreadD) gBreadD.textContent = 'चुलीवर भाजलेली २ गरमागरम ज्वारी भाकरी, बाजरी भाकरी किंवा चपाती.';
      if (gRiceT) gRiceT.textContent = '🍚 सुवासिक इंद्रायणी भात';
      if (gRiceD) gRiceD.textContent = 'गरम इंद्रायणी भात, रस्सा सूप, कांदा-लिंबू आणि कोल्हापुरी ठेचा.';
    } else {
      if (eyebrowEl) eyebrowEl.textContent = 'AUTHENTIC KOLHAPURI CARTE';
      if (titleEl) titleEl.textContent = 'The Royal Kolhapuri Thali Menu';
      if (descEl) descEl.innerHTML = 'Every thali is served with unlimited bowls of piping-hot <strong>Tambda Rassa</strong> &amp; <strong>Pandhra Rassa</strong>, hot Jowar/Bajra Bhakris baked fresh on iron chulhas, and authentic Indrayani rice.';
      if (labelEl) labelEl.textContent = 'Select Language:';

      const gTitle = document.getElementById('guarantee-title');
      const gRassaT = document.getElementById('g-rassa-title');
      const gRassaD = document.getElementById('g-rassa-desc');
      const gBreadT = document.getElementById('g-bread-title');
      const gBreadD = document.getElementById('g-bread-desc');
      const gRiceT = document.getElementById('g-rice-title');
      const gRiceD = document.getElementById('g-rice-desc');
      if (gTitle) gTitle.textContent = 'What Comes in Every Kolhapuri Thali?';
      if (gRassaT) gRassaT.textContent = '🥘 Unlimited Rassa Bowls';
      if (gRassaD) gRassaD.textContent = 'Endless free refills of piping hot Tambda Rassa and cooling Pandhra Rassa throughout your meal.';
      if (gBreadT) gBreadT.textContent = '🫓 Choice of Hot Bhakri';
      if (gBreadD) gBreadD.textContent = 'Two thick, fresh-off-the-chulha Jowar Bhakris, Bajra Bhakris, or thin Chapatis.';
      if (gRiceT) gRiceT.textContent = '🍚 Indrayani Fragrant Rice';
      if (gRiceD) gRiceD.textContent = 'Steaming Indrayani rice paired with mutton rassa broth, raw sliced red onion, and fresh lemon.';
    }
  }

  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('the_thalis_lang', lang);
    updateLanguageUI();
    loadMenu(currentCat);
  }

  if (btnLangEn) btnLangEn.addEventListener('click', () => setLanguage('en'));
  if (btnLangMr) btnLangMr.addEventListener('click', () => setLanguage('mr'));

  async function loadMenu(cat = 'all') {
    currentCat = cat;
    if (!menuContainer) return;
    try {
      if (cachedMenuItems.length === 0) {
        const res = await fetch('/api/menu');
        const data = await res.json();
        if (data.success) {
          cachedMenuItems = data.items;
        }
      }

      const filtered = cat === 'all'
        ? cachedMenuItems
        : cachedMenuItems.filter(i => i.category === cat);

      if (filtered.length === 0) {
        const emptyMsg = currentLang === 'mr'
          ? 'या विभागात सध्या कोणतेही पदार्थ उपलब्ध नाहीत.'
          : 'No dishes currently listed in this section.';
        menuContainer.innerHTML = `<div class="col-span-full py-8 text-center text-stone-500">${emptyMsg}</div>`;
        return;
      }

      menuContainer.innerHTML = filtered.map(dish => {
        const isMr = currentLang === 'mr';
        const displayTitle = isMr ? (dish.title_mr || dish.title) : dish.title;
        const displayDesc = isMr ? (dish.description_mr || dish.description) : dish.description;
        const displayBadge = isMr ? (dish.badge_mr || dish.badge) : dish.badge;
        const rassaText = isMr ? '🔥 अमर्याद तांबडा-पांढरा रस्सा समाविष्ट' : '🔥 Includes Unlimited Rassa';
        const btnText = isMr ? 'ऑर्डर करा' : 'Add to Feast';

        const badgeIcon = dish.is_veg
          ? `<span class="veg-badge" title="${isMr ? 'शाकाहारी' : 'Pure Vegetarian'}"><span class="veg-badge-dot"></span></span>`
          : `<span class="non-veg-badge" title="${isMr ? 'मांसाहारी' : 'Non-Vegetarian'}"><span class="non-veg-badge-dot"></span></span>`;

        return `
          <div class="bg-amber-50/60 border border-amber-200/80 rounded-lg p-5 hover:border-red-600 transition-all flex flex-col justify-between shadow-sm">
            <div>
              <div class="flex items-start justify-between gap-2">
                <div class="flex items-center gap-2">
                  ${badgeIcon}
                  <h3 class="font-serif text-lg font-bold text-stone-900">${displayTitle}</h3>
                </div>
                <span class="font-bold text-red-700 text-base whitespace-nowrap">${dish.price_display}</span>
              </div>
              <p class="text-xs text-stone-600 mt-2 leading-relaxed">${displayDesc}</p>
              ${displayBadge ? `<span class="inline-block mt-3 text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 px-2 py-0.5 rounded border border-red-200">${displayBadge}</span>` : ''}
            </div>

            <div class="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between">
              <span class="text-[11px] text-amber-900 font-medium">${rassaText}</span>
              <button 
                type="button" 
                onclick="addToCart('${dish.id}', '${escapeJs(dish.title)}', ${dish.price}, ${dish.is_veg})"
                class="bg-red-700 hover:bg-red-800 text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors flex items-center gap-1 shadow-sm"
              >
                <span class="material-symbols-outlined text-sm">add_shopping_cart</span>
                <span>${btnText}</span>
              </button>
            </div>
          </div>
        `;
      }).join('');
    } catch (err) {
      console.error('Menu load error:', err);
    }
  }

  if (categoryBtns.length > 0) {
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        categoryBtns.forEach(b => {
          b.classList.remove('bg-red-700', 'text-white', 'border-red-700');
          b.classList.add('bg-amber-100', 'text-stone-800', 'border-amber-300');
        });
        btn.classList.remove('bg-amber-100', 'text-stone-800', 'border-amber-300');
        btn.classList.add('bg-red-700', 'text-white', 'border-red-700');

        const cat = btn.getAttribute('data-cat') || 'all';
        loadMenu(cat);
      });
    });
  }

  updateLanguageUI();
  loadMenu('all');

  // 3. Online Cart & Ordering Logic
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem('the_thalis_cart') || '[]');
  } catch (e) { cart = []; }

  function saveCart() {
    localStorage.setItem('the_thalis_cart', JSON.stringify(cart));
    updateCartUI();
  }

  window.addToCart = (id, title, price, isVeg) => {
    const existing = cart.find(item => item.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id, title, price: Number(price), qty: 1, is_veg: isVeg });
    }
    saveCart();
    showToast(`Added ${title} to your cart!`, 'success');
  };

  window.updateCartQty = (id, delta) => {
    const item = cart.find(i => i.id === id);
    if (item) {
      item.qty += delta;
      if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== id);
      }
    }
    saveCart();
  };

  function updateCartUI() {
    const countBadge = document.getElementById('cart-badge');
    const totalCount = cart.reduce((sum, i) => sum + i.qty, 0);
    if (countBadge) {
      countBadge.textContent = totalCount;
      countBadge.classList.toggle('hidden', totalCount === 0);
    }

    const itemsContainer = document.getElementById('cart-items-list');
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');

    if (itemsContainer) {
      if (cart.length === 0) {
        itemsContainer.innerHTML = `<p class="py-8 text-center text-sm text-stone-500">Your feast cart is empty. Add authentic Kolhapuri Thalis from our carte!</p>`;
        if (subtotalEl) subtotalEl.textContent = '₹0';
        if (totalEl) totalEl.textContent = '₹0';
        return;
      }

      let subtotal = 0;
      itemsContainer.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;
        return `
          <div class="flex items-center justify-between py-2.5 border-b border-amber-200/60 text-xs">
            <div class="flex-1">
              <span class="font-bold text-stone-900">${item.title}</span>
              <div class="text-[11px] text-stone-500">₹${item.price} each</div>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="updateCartQty('${item.id}', -1)" class="w-6 h-6 rounded bg-amber-200 text-stone-900 font-bold flex items-center justify-center hover:bg-amber-300">-</button>
              <span class="font-bold text-stone-800 w-4 text-center">${item.qty}</span>
              <button onclick="updateCartQty('${item.id}', 1)" class="w-6 h-6 rounded bg-amber-200 text-stone-900 font-bold flex items-center justify-center hover:bg-amber-300">+</button>
            </div>
            <div class="w-16 text-right font-bold text-red-700">₹${itemTotal}</div>
          </div>
        `;
      }).join('');

      if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
      if (totalEl) totalEl.textContent = `₹${subtotal}`;
    }
  }

  updateCartUI();

  // Handle Checkout Order Form
  const checkoutForm = document.getElementById('checkout-order-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (cart.length === 0) {
        showToast('Your cart is empty. Please select thalis first!', 'error');
        return;
      }

      const payload = {
        customer_name: document.getElementById('c-name')?.value,
        customer_phone: document.getElementById('c-phone')?.value,
        delivery_type: document.querySelector('input[name="delivery_type"]:checked')?.value || 'delivery',
        delivery_address: document.getElementById('c-address')?.value || '',
        spice_level: document.getElementById('c-spice')?.value || 'Kolhapuri Jhanjhanit (Spicy)',
        bread_choice: document.getElementById('c-bread')?.value || 'Jowar Bhakri',
        payment_method: document.getElementById('c-payment')?.value || 'UPI on Delivery',
        items: cart
      };

      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (data.success) {
          cart = [];
          saveCart();
          showOrderReceiptModal(data);
        } else {
          showToast(data.error || 'Failed to place order.', 'error');
        }
      } catch (err) {
        showToast('Network error while placing order.', 'error');
      }
    });
  }

  function showOrderReceiptModal(data) {
    const modal = document.getElementById('order-confirmed-modal');
    if (!modal) {
      alert(data.message);
      return;
    }
    document.getElementById('receipt-order-ref').textContent = `#${data.order_ref}`;
    document.getElementById('receipt-order-total').textContent = `₹${data.total_amount}`;
    document.getElementById('receipt-order-spice').textContent = data.spice_level;
    document.getElementById('receipt-order-bread').textContent = data.bread_choice;
    modal.classList.remove('hidden');
  }

  // 4. Table Reservation Submission (on reservations.html)
  const reservationForm = document.getElementById('thali-reservation-form');
  const resDateInput = document.getElementById('res-date');
  const timeSlotContainer = document.getElementById('res-time-slots');

  if (resDateInput) {
    const today = new Date().toISOString().split('T')[0];
    resDateInput.min = today;
    resDateInput.value = today;
    loadReservationSlots(today);

    resDateInput.addEventListener('change', (e) => {
      loadReservationSlots(e.target.value);
    });
  }

  async function loadReservationSlots(date) {
    if (!timeSlotContainer) return;
    try {
      const area = document.getElementById('res-area')?.value || 'Family AC Hall';
      const res = await fetch(`/api/reservations/availability?date=${encodeURIComponent(date)}&area=${encodeURIComponent(area)}`);
      const data = await res.json();

      if (data.success && data.slots) {
        timeSlotContainer.innerHTML = data.slots.map((slot, idx) => `
          <label class="border border-amber-300 rounded p-2 text-center cursor-pointer hover:border-red-600 transition-colors ${!slot.selectable ? 'opacity-40 cursor-not-allowed bg-stone-200' : 'bg-amber-50'}">
            <input type="radio" name="sitting_time" value="${slot.time}" ${slot.selectable && idx === 0 ? 'checked' : ''} ${!slot.selectable ? 'disabled' : ''} class="hidden slot-radio" />
            <span class="block font-bold text-xs text-stone-900">${slot.time}</span>
            <span class="block text-[10px] ${slot.status === 'fast_filling' ? 'text-red-700 font-semibold' : 'text-stone-500'}">${slot.label}</span>
          </label>
        `).join('');

        // Highlight selected
        const radios = timeSlotContainer.querySelectorAll('.slot-radio');
        radios.forEach(r => {
          r.addEventListener('change', () => {
            timeSlotContainer.querySelectorAll('label').forEach(l => l.classList.remove('ring-2', 'ring-red-700', 'bg-red-50'));
            if (r.checked) r.closest('label').classList.add('ring-2', 'ring-red-700', 'bg-red-50');
          });
        });
      }
    } catch (e) {}
  }

  if (reservationForm) {
    reservationForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        guest_name: document.getElementById('res-name')?.value,
        guest_phone: document.getElementById('res-phone')?.value,
        guest_email: document.getElementById('res-email')?.value,
        party_size: document.getElementById('res-party')?.value,
        sitting_date: document.getElementById('res-date')?.value,
        sitting_time: document.querySelector('input[name="sitting_time"]:checked')?.value,
        seating_area: document.getElementById('res-area')?.value,
        notes: document.getElementById('res-notes')?.value
      };

      if (!payload.sitting_time) {
        showToast('Please select a lunch or dinner sitting time slot.', 'error');
        return;
      }

      try {
        const res = await fetch('/api/reservations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          alert(`Dhanyawad! Table booking confirmed with reference: ${data.booking_ref}\nWe look forward to serving you piping hot Kolhapuri Thalis!`);
          reservationForm.reset();
        } else {
          showToast(data.error || 'Failed to book table.', 'error');
        }
      } catch (err) {
        showToast('Network error while booking table.', 'error');
      }
    });
  }

  // 5. Toast Notification
  function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast-notice');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast-notice ${type === 'error' ? 'toast-error' : 'toast-success'} animate-fade-in`;
    toast.innerHTML = `
      <span class="material-symbols-outlined">${type === 'error' ? 'error' : 'check_circle'}</span>
      <span>${message}</span>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  function escapeJs(str) {
    return (str || '').replace(/'/g, "\\'");
  }

  // 6. Copy Address Helper
  window.copyAddress = function() {
    const addressText = "The Thalis — Kolhapuri Thali, 1st Floor, Opp. to Hotel Lisha, Above Life Pharma Medical, Kadamwadi Rd, Laxminarayan Nagar, Tarabai Park, Kolhapur, Maharashtra 416003";
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(addressText).then(() => {
        showToast('Address copied to clipboard!', 'success');
      }).catch(() => {
        showToast('Address: ' + addressText, 'success');
      });
    } else {
      showToast('Address: ' + addressText, 'success');
    }
  };
});
