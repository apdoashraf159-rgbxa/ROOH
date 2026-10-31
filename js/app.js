/**
 * ROOH | رُوح — Storefront Controller & Customer Experience
 * Full E-Commerce operations, Arabic RTL / English LTR, EGP Currency
 */

class RoohStorefrontApp {
  constructor() {
    this.store = window.roohStore;
    this.currentCategory = 'all';
    this.currentSubcategory = 'all';
    this.searchQuery = '';
    this.selectedGovernorate = 'cairo';
    this.selectedPaymentMethod = 'cod';
    this.activeProductModalId = null;
    this.activeModalTab = 'desc';
    this.activeModalQty = 1;
  }

  init() {
    this.bindEvents();
    this.applyLanguage();
    this.renderCatalog();
    this.updateCartBadge();
    this.updateWishlistBadge();
    if (window.roohConcierge) window.roohConcierge.initUI();

    // Subscribe to state changes
    this.store.subscribe(() => {
      this.updateCartBadge();
      this.updateWishlistBadge();
    });
  }

  bindEvents() {
    // Language Switcher
    const langBtn = document.getElementById('langSwitchBtn');
    if (langBtn) {
      langBtn.addEventListener('click', () => this.toggleLanguage());
    }

    // Role Switcher Pill
    const rolePill = document.getElementById('roleSelectorPill');
    if (rolePill) {
      rolePill.addEventListener('click', () => {
        window.location.href = 'admin.html';
      });
    }

    // Search bar
    const searchInput = document.getElementById('mainSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim();
        this.renderCatalog();
      });
    }

    // Category filter pills
    document.querySelectorAll('.filter-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-tab-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.currentCategory = e.currentTarget.getAttribute('data-category') || 'all';
        this.currentSubcategory = 'all';
        this.renderCatalog();
      });
    });

    // Category Navigation Menu links
    document.querySelectorAll('.category-nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = e.currentTarget.getAttribute('data-category');
        this.currentCategory = cat;
        this.currentSubcategory = 'all';
        
        // Update filter tabs
        document.querySelectorAll('.filter-tab-btn').forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-category') === cat);
        });

        this.renderCatalog();
        const catalogEl = document.getElementById('catalogSection');
        if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
      });
    });

    // Cart Drawer Toggle
    const cartToggleBtn = document.getElementById('cartDrawerOpenBtn');
    const cartCloseBtn = document.getElementById('cartDrawerCloseBtn');
    const cartBackdrop = document.getElementById('cartDrawerBackdrop');

    if (cartToggleBtn) cartToggleBtn.addEventListener('click', () => this.openCartDrawer());
    if (cartCloseBtn) cartCloseBtn.addEventListener('click', () => this.closeCartDrawer());
    if (cartBackdrop) {
      cartBackdrop.addEventListener('click', (e) => {
        if (e.target === cartBackdrop) this.closeCartDrawer();
      });
    }

    // Product Modal Backdrop Close
    const prodModalBackdrop = document.getElementById('productDetailModalBackdrop');
    const prodModalClose = document.getElementById('productDetailModalCloseBtn');
    if (prodModalClose) prodModalClose.addEventListener('click', () => this.closeProductModal());
    if (prodModalBackdrop) {
      prodModalBackdrop.addEventListener('click', (e) => {
        if (e.target === prodModalBackdrop) this.closeProductModal();
      });
    }

    // Checkout Modal Backdrop & Close
    const checkoutBackdrop = document.getElementById('checkoutModalBackdrop');
    const checkoutClose = document.getElementById('checkoutModalCloseBtn');
    const checkoutOpenBtn = document.getElementById('proceedToCheckoutBtn');

    if (checkoutOpenBtn) checkoutOpenBtn.addEventListener('click', () => this.openCheckoutModal());
    if (checkoutClose) checkoutClose.addEventListener('click', () => this.closeCheckoutModal());
    if (checkoutBackdrop) {
      checkoutBackdrop.addEventListener('click', (e) => {
        if (e.target === checkoutBackdrop) this.closeCheckoutModal();
      });
    }

    // Quick Tracking Search Form on Homepage
    const trackForm = document.getElementById('homepageTrackingForm');
    if (trackForm) {
      trackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('homepageTrackCodeInput');
        if (input && input.value.trim()) {
          this.openTrackingModal(input.value.trim());
        }
      });
    }

    // Tracking Modal Close
    const trackModalBackdrop = document.getElementById('trackingModalBackdrop');
    const trackModalClose = document.getElementById('trackingModalCloseBtn');
    if (trackModalClose) trackModalClose.addEventListener('click', () => this.closeTrackingModal());
    if (trackModalBackdrop) {
      trackModalBackdrop.addEventListener('click', (e) => {
        if (e.target === trackModalBackdrop) this.closeTrackingModal();
      });
    }

    // Wishlist Drawer / Open
    const wishlistBtn = document.getElementById('wishlistOpenBtn');
    if (wishlistBtn) {
      wishlistBtn.addEventListener('click', () => this.openWishlistModal());
    }

    const wishlistBackdrop = document.getElementById('wishlistModalBackdrop');
    const wishlistClose = document.getElementById('wishlistModalCloseBtn');
    if (wishlistClose) wishlistClose.addEventListener('click', () => this.closeWishlistModal());
    if (wishlistBackdrop) {
      wishlistBackdrop.addEventListener('click', (e) => {
        if (e.target === wishlistBackdrop) this.closeWishlistModal();
      });
    }
  }

  // Toggle Language between Arabic and English
  toggleLanguage() {
    const newLang = this.store.data.settings.currentLang === 'ar' ? 'en' : 'ar';
    this.store.data.settings.currentLang = newLang;
    this.store.saveState();
    this.applyLanguage();
    this.renderCatalog();
    this.renderCartItems();
    if (this.activeProductModalId) this.openProductModal(this.activeProductModalId);
  }

  applyLanguage() {
    const isAr = this.store.data.settings.currentLang === 'ar';
    document.body.classList.toggle('ltr', !isAr);
    document.documentElement.lang = isAr ? 'ar' : 'en';
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';

    const langBtnText = document.getElementById('langSwitchBtnText');
    if (langBtnText) langBtnText.textContent = isAr ? 'English' : 'العربية';

    // Update static i18n text tags
    document.querySelectorAll('[data-i18n-ar]').forEach(el => {
      const textAr = el.getAttribute('data-i18n-ar');
      const textEn = el.getAttribute('data-i18n-en') || textAr;
      el.textContent = isAr ? textAr : textEn;
    });

    document.querySelectorAll('[data-i18n-placeholder-ar]').forEach(el => {
      const plAr = el.getAttribute('data-i18n-placeholder-ar');
      const plEn = el.getAttribute('data-i18n-placeholder-en') || plAr;
      el.placeholder = isAr ? plAr : plEn;
    });
  }

  // --- Catalog Rendering ---
  renderCatalog() {
    const grid = document.getElementById('productsGridContainer');
    if (!grid) return;

    const isAr = this.store.data.settings.currentLang === 'ar';
    const currency = isAr ? this.store.data.settings.currencyAr : this.store.data.settings.currencyEn;
    
    let products = this.store.searchProducts(this.searchQuery, this.currentCategory);
    if (this.currentSubcategory !== 'all') {
      products = products.filter(p => p.subcategory === this.currentSubcategory);
    }

    if (products.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">✨</div>
          <h3 style="font-size: 1.4rem; color: var(--rooh-burgundy-deep); margin-bottom: 0.5rem;">
            ${isAr ? 'لم نعثر على نتائج مطابقة لبحثكِ' : 'No matching products found'}
          </h3>
          <p style="color: var(--rooh-text-muted);">
            ${isAr ? 'جرّبي البحث باسم منتج آخر أو تصفح كل المجموعات الفاخرة.' : 'Try a different keyword or browse all luxury collections.'}
          </p>
        </div>
      `;
      return;
    }

    grid.innerHTML = products.map(prod => {
      const title = isAr ? prod.nameAr : prod.nameEn;
      const catObj = this.store.data.categories.find(c => c.id === prod.category);
      const catName = catObj ? (isAr ? catObj.nameAr : catObj.nameEn) : prod.category;
      const badge = isAr ? prod.badge : (prod.badgeEn || prod.badge);
      const discount = Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100);
      const isWishlisted = this.store.isInWishlist(prod.id);

      return `
        <div class="product-card" data-product-id="${prod.id}">
          ${badge ? `<span class="product-card-badge">${badge}</span>` : ''}
          <button class="product-card-wishlist-btn ${isWishlisted ? 'active' : ''}" 
                  onclick="event.stopPropagation(); window.roohApp.toggleWishlist(${prod.id}, this)">
            ${isWishlisted ? '♥' : '♡'}
          </button>
          
          <div class="product-card-img-wrap" onclick="window.roohApp.openProductModal(${prod.id})">
            <img class="product-card-img" src="${prod.image}" alt="${title}" loading="lazy">
            <div class="product-quick-view-overlay">
              <span class="btn-quick-view">
                <span>👁</span> ${isAr ? 'نظرة سريعة' : 'Quick View'}
              </span>
            </div>
          </div>

          <div class="product-card-content">
            <span class="product-card-category">${catName}</span>
            <h3 class="product-card-title" onclick="window.roohApp.openProductModal(${prod.id})">${title}</h3>
            
            <div class="product-card-rating">
              <div class="rating-stars">★★★★★</div>
              <span>${prod.rating}</span>
              <span>(${prod.reviewCount})</span>
            </div>

            <div class="product-card-price-row">
              <span class="price-current">${prod.price.toLocaleString()} ${currency}</span>
              ${prod.originalPrice > prod.price ? `
                <span class="price-original">${prod.originalPrice.toLocaleString()} ${currency}</span>
                <span class="price-discount-pill">-${discount}%</span>
              ` : ''}
            </div>

            <div class="product-card-actions">
              <button class="btn-add-to-cart" onclick="window.roohApp.addToCart(${prod.id})">
                <span>🛍</span> ${isAr ? 'أضيفي للسلة' : 'Add to Cart'}
              </button>
              <button class="btn-buy-now" onclick="window.roohApp.buyNow(${prod.id})">
                ${isAr ? 'شراء فوري' : 'Buy Now'}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // --- Product Detail Modal ---
  openProductModal(productId) {
    const prod = this.store.getProductById(productId);
    if (!prod) return;

    this.activeProductModalId = productId;
    this.activeModalTab = 'desc';
    this.activeModalQty = 1;

    const isAr = this.store.data.settings.currentLang === 'ar';
    const currency = isAr ? this.store.data.settings.currencyAr : this.store.data.settings.currencyEn;
    const title = isAr ? prod.nameAr : prod.nameEn;
    const badge = isAr ? prod.badge : (prod.badgeEn || prod.badge);
    const volume = isAr ? prod.volume : (prod.volumeEn || prod.volume);
    const discount = Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100);

    const dialog = document.getElementById('productDetailModalDialog');
    if (!dialog) return;

    dialog.innerHTML = `
      <button class="modal-close-btn" id="productDetailModalCloseBtn" onclick="window.roohApp.closeProductModal()">✕</button>
      <div class="product-detail-modal-grid">
        <div class="modal-gallery-wrap">
          <div class="modal-main-img-wrap">
            <img class="modal-main-img" src="${prod.image}" alt="${title}">
          </div>
          <div style="display: flex; gap: 0.75rem;">
            <div style="width: 70px; height: 70px; background: var(--rooh-cream); border: 2px solid var(--rooh-gold); border-radius: 8px; padding: 0.4rem; display: flex; align-items: center; justify-content: center;">
              <img src="${prod.image}" style="max-height: 100%; object-fit: contain;">
            </div>
          </div>
        </div>

        <div class="modal-product-info">
          ${badge ? `<span class="modal-product-badge">${badge}</span>` : ''}
          <h2 class="modal-product-title">${title}</h2>
          <div class="modal-product-sku">
            SKU: <strong style="color: var(--rooh-burgundy);">${prod.sku}</strong> • ${volume}
          </div>

          <div class="modal-price-wrap">
            <span class="modal-price-current">${prod.price.toLocaleString()} ${currency}</span>
            ${prod.originalPrice > prod.price ? `
              <span class="modal-price-original">${prod.originalPrice.toLocaleString()} ${currency}</span>
              <span class="price-discount-pill" style="font-size: 0.85rem; padding: 0.2rem 0.6rem;">-${discount}%</span>
            ` : ''}
          </div>

          <!-- Stock Indicator -->
          <div class="modal-stock-indicator">
            <span class="stock-pulse-dot" style="background: ${prod.stock < 10 ? '#EF6C00' : '#2E7D32'};"></span>
            <span style="color: ${prod.stock < 10 ? '#E65100' : '#2E7D32'};">
              ${isAr 
                ? (prod.stock < 10 ? `سارعي بالطلب: متبقي ${prod.stock} قطع فقط في المستودع!` : `متوفر في المستودع (${prod.stock} قطعة)`)
                : (prod.stock < 10 ? `Hurry: Only ${prod.stock} items left in stock!` : `In Stock (${prod.stock} items)`)}
            </span>
          </div>

          <!-- Tabs -->
          <div class="modal-tabs-header">
            <button class="modal-tab-btn ${this.activeModalTab === 'desc' ? 'active' : ''}" 
                    onclick="window.roohApp.switchModalTab('desc')">
              ${isAr ? 'الوصف الفاخر' : 'Description'}
            </button>
            <button class="modal-tab-btn ${this.activeModalTab === 'ingredients' ? 'active' : ''}" 
                    onclick="window.roohApp.switchModalTab('ingredients')">
              ${isAr ? 'المكونات النشطة' : 'Ingredients'}
            </button>
            <button class="modal-tab-btn ${this.activeModalTab === 'howToUse' ? 'active' : ''}" 
                    onclick="window.roohApp.switchModalTab('howToUse')">
              ${isAr ? 'طريقة الاستخدام' : 'How to Use'}
            </button>
            <button class="modal-tab-btn ${this.activeModalTab === 'suitability' ? 'active' : ''}" 
                    onclick="window.roohApp.switchModalTab('suitability')">
              ${isAr ? 'الملاءمة' : 'Suitability'}
            </button>
          </div>

          <div class="modal-tab-content" id="modalDynamicTabContent">
            ${this.getModalTabContent(prod, this.activeModalTab, isAr)}
          </div>

          <!-- Quantity Stepper & Actions -->
          <div class="modal-action-row">
            <div class="quantity-stepper">
              <button class="qty-btn" onclick="window.roohApp.stepModalQty(-1)">−</button>
              <input type="text" class="qty-input" id="modalQtyDisplay" value="1" readonly>
              <button class="qty-btn" onclick="window.roohApp.stepModalQty(1)">+</button>
            </div>

            <button class="btn-burgundy" style="flex: 1;" onclick="window.roohApp.addModalToCart()">
              <span>🛍</span> ${isAr ? 'أضيفي للسلة' : 'Add to Cart'}
            </button>

            <button class="btn-gold" onclick="window.roohApp.buyModalNow()">
              ${isAr ? 'شراء فوري' : 'Buy Now'}
            </button>
          </div>
        </div>
      </div>
    `;

    const backdrop = document.getElementById('productDetailModalBackdrop');
    if (backdrop) backdrop.classList.add('active');
  }

  switchModalTab(tabKey) {
    this.activeModalTab = tabKey;
    const prod = this.store.getProductById(this.activeProductModalId);
    if (!prod) return;
    const isAr = this.store.data.settings.currentLang === 'ar';
    const contentEl = document.getElementById('modalDynamicTabContent');
    if (contentEl) {
      contentEl.innerHTML = this.getModalTabContent(prod, tabKey, isAr);
    }
    document.querySelectorAll('.modal-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('onclick').includes(tabKey));
    });
  }

  getModalTabContent(prod, tabKey, isAr) {
    switch (tabKey) {
      case 'ingredients':
        return `<p>✨ <strong>${isAr ? 'تركيبة غنية وموثقة:' : 'Certified Actives:'}</strong> ${isAr ? prod.ingredientsAr : prod.ingredientsEn}</p>`;
      case 'howToUse':
        return `<p>🕊️ <strong>${isAr ? 'خطوات الروتين اليومي:' : 'Daily Routine Steps:'}</strong> ${isAr ? prod.howToUseAr : prod.howToUseEn}</p>`;
      case 'suitability':
        return `<p>🌿 <strong>${isAr ? 'ملاءمة البشرة والشعر:' : 'Skin & Hair Suitability:'}</strong> ${isAr ? prod.suitabilityAr : prod.suitabilityEn}</p>`;
      default:
        return `<p>${isAr ? prod.descriptionAr : prod.descriptionEn}</p>`;
    }
  }

  stepModalQty(delta) {
    const prod = this.store.getProductById(this.activeProductModalId);
    if (!prod) return;
    this.activeModalQty = Math.max(1, Math.min(prod.stock, this.activeModalQty + delta));
    const input = document.getElementById('modalQtyDisplay');
    if (input) input.value = this.activeModalQty;
  }

  addModalToCart() {
    if (this.activeProductModalId) {
      this.store.addToCart(this.activeProductModalId, this.activeModalQty);
      this.closeProductModal();
      this.openCartDrawer();
      this.showToast(this.store.data.settings.currentLang === 'ar' ? 'تمت إضافة المنتج إلى حقيبة التسوق بنجاح' : 'Product added to bag');
    }
  }

  buyModalNow() {
    if (this.activeProductModalId) {
      this.store.addToCart(this.activeProductModalId, this.activeModalQty);
      this.closeProductModal();
      this.openCheckoutModal();
    }
  }

  closeProductModal() {
    const backdrop = document.getElementById('productDetailModalBackdrop');
    if (backdrop) backdrop.classList.remove('active');
    this.activeProductModalId = null;
  }

  // --- Cart Operations ---
  addToCart(productId) {
    this.store.addToCart(productId, 1);
    this.openCartDrawer();
    this.showToast(this.store.data.settings.currentLang === 'ar' ? 'تمت إضافة المنتج إلى حقيبة التسوق بنجاح' : 'Product added to bag');
  }

  buyNow(productId) {
    this.store.addToCart(productId, 1);
    this.openCheckoutModal();
  }

  openCartDrawer() {
    this.renderCartItems();
    const backdrop = document.getElementById('cartDrawerBackdrop');
    if (backdrop) backdrop.classList.add('active');
  }

  closeCartDrawer() {
    const backdrop = document.getElementById('cartDrawerBackdrop');
    if (backdrop) backdrop.classList.remove('active');
  }

  renderCartItems() {
    const container = document.getElementById('cartDrawerItemsList');
    if (!container) return;

    const items = this.store.getCartItems();
    const isAr = this.store.data.settings.currentLang === 'ar';
    const currency = isAr ? this.store.data.settings.currencyAr : this.store.data.settings.currencyEn;

    if (items.length === 0) {
      container.innerHTML = `
        <div class="cart-empty-message">
          <div class="cart-empty-icon">🛍️</div>
          <h4 style="color: var(--rooh-burgundy-deep); margin-bottom: 0.5rem; font-size: 1.15rem;">
            ${isAr ? 'حقيبة التسوق فارغة حالياً' : 'Your Shopping Bag is Empty'}
          </h4>
          <p style="font-size: 0.88rem;">
            ${isAr ? 'تصفحي مجموعات رُوح الفاخرة واختاري ما يلامس جمالكِ.' : 'Explore ROOH luxury collections to begin.'}
          </p>
        </div>
      `;
      this.updateCartSummaryFooter(0, 0, 0, 0);
      return;
    }

    container.innerHTML = items.map(item => {
      const prod = item.product;
      const title = isAr ? prod.nameAr : prod.nameEn;
      return `
        <div class="cart-item-card">
          <img class="cart-item-img" src="${prod.image}" alt="${title}">
          <div class="cart-item-info">
            <h4 class="cart-item-title">${title}</h4>
            <div class="cart-item-price">${(prod.price * item.quantity).toLocaleString()} ${currency}</div>
            
            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 0.5rem;">
              <div class="quantity-stepper" style="height: 32px;">
                <button class="qty-btn" style="width: 28px;" onclick="window.roohStore.updateCartQuantity(${prod.id}, ${item.quantity - 1}); window.roohApp.renderCartItems();">−</button>
                <input type="text" class="qty-input" style="width: 32px; font-size: 0.85rem;" value="${item.quantity}" readonly>
                <button class="qty-btn" style="width: 28px;" onclick="window.roohStore.updateCartQuantity(${prod.id}, ${item.quantity + 1}); window.roohApp.renderCartItems();">+</button>
              </div>

              <button class="cart-item-remove-btn" onclick="window.roohStore.removeFromCart(${prod.id}); window.roohApp.renderCartItems();">
                🗑
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    const totals = this.store.getCartTotals(this.selectedGovernorate);
    this.updateCartSummaryFooter(totals.subtotal, totals.vat, totals.shippingFee, totals.total);
  }

  updateCartSummaryFooter(subtotal, vat, shipping, total) {
    const isAr = this.store.data.settings.currentLang === 'ar';
    const currency = isAr ? this.store.data.settings.currencyAr : this.store.data.settings.currencyEn;
    const threshold = this.store.data.settings.freeShippingThreshold;

    const subEl = document.getElementById('cartSubtotalDisplay');
    const vatEl = document.getElementById('cartVatDisplay');
    const shipEl = document.getElementById('cartShippingDisplay');
    const totEl = document.getElementById('cartTotalDisplay');

    if (subEl) subEl.textContent = `${subtotal.toLocaleString()} ${currency}`;
    if (vatEl) vatEl.textContent = `${Math.round(vat).toLocaleString()} ${currency}`;
    if (shipEl) shipEl.textContent = shipping === 0 ? (isAr ? 'مجاني (عرض رُوح)' : 'Free') : `${shipping} ${currency}`;
    if (totEl) totEl.textContent = `${Math.round(total).toLocaleString()} ${currency}`;

    // Free Shipping Progress
    const progText = document.getElementById('freeShippingProgressText');
    const progBar = document.getElementById('freeShippingProgressBar');
    if (progBar && progText) {
      const pct = Math.min(100, Math.round((subtotal / threshold) * 100));
      progBar.style.width = `${pct}%`;
      if (subtotal >= threshold) {
        progText.innerHTML = `🎉 ${isAr ? 'تهانينا! حصلتِ على <strong>شحن مجاني فاخر</strong> عبر أسطول شحن رُوح.' : 'Congrats! You unlocked <strong>Free Luxury Shipping</strong> via ROOH Delivery.'}`;
      } else {
        const remaining = threshold - subtotal;
        progText.innerHTML = `🚚 ${isAr ? `أضيفي منتجات بقيمة <strong>${remaining.toLocaleString()} ${currency}</strong> للحصول على شحن مجاني.` : `Add <strong>${remaining.toLocaleString()} ${currency}</strong> more for Free Shipping.`}`;
      }
    }
  }

  updateCartBadge() {
    const badge = document.getElementById('headerCartCountBadge');
    if (badge) {
      const items = this.store.getCartItems();
      const count = items.reduce((sum, i) => sum + i.quantity, 0);
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  }

  updateWishlistBadge() {
    const badge = document.getElementById('headerWishlistCountBadge');
    if (badge) {
      const count = this.store.data.wishlist.length;
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  }

  toggleWishlist(productId, btnEl) {
    const isIn = this.store.toggleWishlist(productId);
    if (btnEl) {
      btnEl.classList.toggle('active', isIn);
      btnEl.textContent = isIn ? '♥' : '♡';
    }
    const isAr = this.store.data.settings.currentLang === 'ar';
    this.showToast(isIn 
      ? (isAr ? 'تمت إضافة المنتج لقائمة الرغبات الملكية' : 'Added to wishlist')
      : (isAr ? 'تمت الإزالة من قائمة الرغبات' : 'Removed from wishlist'));
  }

  // --- Wishlist Modal ---
  openWishlistModal() {
    const container = document.getElementById('wishlistItemsContainer');
    if (!container) return;
    const isAr = this.store.data.settings.currentLang === 'ar';
    const currency = isAr ? this.store.data.settings.currencyAr : this.store.data.settings.currencyEn;
    const ids = this.store.data.wishlist;

    if (ids.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--rooh-text-muted);">
          <div style="font-size: 3rem; margin-bottom: 0.8rem;">♡</div>
          <h4>${isAr ? 'قائمة الرغبات فارغة' : 'Wishlist is empty'}</h4>
        </div>
      `;
    } else {
      container.innerHTML = ids.map(id => {
        const prod = this.store.getProductById(id);
        if (!prod) return '';
        const title = isAr ? prod.nameAr : prod.nameEn;
        return `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 1rem; border-bottom: 1px solid var(--rooh-sand);">
            <div style="display: flex; align-items: center; gap: 1rem;">
              <img src="${prod.image}" style="width: 56px; height: 56px; object-fit: contain;">
              <div>
                <strong style="color: var(--rooh-burgundy-deep); font-size: 0.95rem;">${title}</strong>
                <div style="color: var(--rooh-burgundy); font-weight: 700;">${prod.price.toLocaleString()} ${currency}</div>
              </div>
            </div>
            <button class="btn-burgundy" style="padding: 0.45rem 1rem; font-size: 0.85rem;" onclick="window.roohApp.addToCart(${prod.id}); window.roohApp.closeWishlistModal();">
              ${isAr ? 'أضيفي للسلة' : 'Add to Cart'}
            </button>
          </div>
        `;
      }).join('');
    }

    const backdrop = document.getElementById('wishlistModalBackdrop');
    if (backdrop) backdrop.classList.add('active');
  }

  closeWishlistModal() {
    const backdrop = document.getElementById('wishlistModalBackdrop');
    if (backdrop) backdrop.classList.remove('active');
  }

  // --- Checkout Operations ---
  openCheckoutModal() {
    this.closeCartDrawer();
    const items = this.store.getCartItems();
    if (items.length === 0) {
      alert(this.store.data.settings.currentLang === 'ar' ? 'حقيبة التسوق فارغة!' : 'Your bag is empty!');
      return;
    }

    this.renderCheckoutForm();
    const backdrop = document.getElementById('checkoutModalBackdrop');
    if (backdrop) backdrop.classList.add('active');
  }

  closeCheckoutModal() {
    const backdrop = document.getElementById('checkoutModalBackdrop');
    if (backdrop) backdrop.classList.remove('active');
  }

  renderCheckoutForm() {
    const isAr = this.store.data.settings.currentLang === 'ar';
    const currency = isAr ? this.store.data.settings.currencyAr : this.store.data.settings.currencyEn;
    const user = this.store.data.currentUser;
    const govs = this.store.data.shipping.governorates;

    const govSelect = document.getElementById('checkoutGovernorateSelect');
    if (govSelect) {
      govSelect.innerHTML = govs.map(g => `
        <option value="${g.id}" ${g.id === this.selectedGovernorate ? 'selected' : ''}>
          ${isAr ? g.nameAr : g.nameEn} (${g.fee} ${currency} • ${g.transitTime})
        </option>
      `).join('');

      govSelect.onchange = (e) => {
        this.selectedGovernorate = e.target.value;
        this.updateCheckoutTotals();
      };
    }

    // Customer fields default values
    const nameInput = document.getElementById('checkoutCustomerName');
    const phoneInput = document.getElementById('checkoutCustomerPhone');
    const addressInput = document.getElementById('checkoutCustomerAddress');

    if (nameInput) nameInput.value = isAr ? user.name : user.nameEn;
    if (phoneInput) phoneInput.value = user.phone;
    if (addressInput && user.addresses.length > 0) {
      addressInput.value = user.addresses[0].details;
    }

    // Bind payment method cards
    document.querySelectorAll('.payment-method-card').forEach(card => {
      card.onclick = (e) => {
        document.querySelectorAll('.payment-method-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.selectedPaymentMethod = card.getAttribute('data-method');
        this.updateCheckoutTotals();
      };
    });

    this.updateCheckoutTotals();
  }

  updateCheckoutTotals() {
    const isCod = this.selectedPaymentMethod === 'cod';
    const totals = this.store.getCartTotals(this.selectedGovernorate, isCod);
    const isAr = this.store.data.settings.currentLang === 'ar';
    const currency = isAr ? this.store.data.settings.currencyAr : this.store.data.settings.currencyEn;

    const subEl = document.getElementById('checkoutSubtotal');
    const vatEl = document.getElementById('checkoutVat');
    const shipEl = document.getElementById('checkoutShipping');
    const codEl = document.getElementById('checkoutCodFeeRow');
    const totEl = document.getElementById('checkoutTotal');

    if (subEl) subEl.textContent = `${totals.subtotal.toLocaleString()} ${currency}`;
    if (vatEl) vatEl.textContent = `${Math.round(totals.vat).toLocaleString()} ${currency}`;
    if (shipEl) shipEl.textContent = totals.shippingFee === 0 ? (isAr ? 'شحن مجاني' : 'Free Shipping') : `${totals.shippingFee} ${currency}`;
    if (totEl) totEl.textContent = `${Math.round(totals.total).toLocaleString()} ${currency}`;

    if (codEl) {
      codEl.style.display = isCod ? 'flex' : 'none';
      const codVal = document.getElementById('checkoutCodFeeVal');
      if (codVal) codVal.textContent = `${this.store.data.settings.codFee} ${currency}`;
    }

    // Render active payment details UI
    const payContainer = document.getElementById('checkoutPaymentDetailsContainer');
    if (payContainer && window.roohPayment) {
      window.roohPayment.renderPaymentMethodUI(
        this.selectedPaymentMethod,
        totals.total,
        payContainer,
        this.store.data.settings.currentLang
      );
    }
  }

  submitOrder() {
    const isAr = this.store.data.settings.currentLang === 'ar';
    const nameInput = document.getElementById('checkoutCustomerName');
    const phoneInput = document.getElementById('checkoutCustomerPhone');
    const addressInput = document.getElementById('checkoutCustomerAddress');

    const customerName = nameInput ? nameInput.value.trim() : 'عميل رُوح';
    const customerPhone = phoneInput ? phoneInput.value.trim() : '010XXXXXXXX';
    const shippingAddress = addressInput ? addressInput.value.trim() : 'العنوان';

    if (!customerPhone || customerPhone.length < 9) {
      alert(isAr ? 'يرجى إدخال رقم هاتف مصري صحيح للتواصل مع مندوب شحن رُوح.' : 'Please enter a valid phone number for the courier.');
      return;
    }

    const isCod = this.selectedPaymentMethod === 'cod';
    const totals = this.store.getCartTotals(this.selectedGovernorate, isCod);
    const govObj = this.store.data.shipping.governorates.find(g => g.id === this.selectedGovernorate) || this.store.data.shipping.governorates[0];

    const orderPayload = {
      customerName,
      customerPhone,
      governorate: govObj.nameAr,
      shippingAddress,
      paymentMethod: this.selectedPaymentMethod,
      paymentStatus: this.selectedPaymentMethod === 'cod' ? 'pending_collection' : 'paid',
      paymentRef: this.selectedPaymentMethod === 'fawry' 
        ? `FAWRY-${document.getElementById('fawryGeneratedCode')?.textContent.trim() || '982-120'}`
        : (this.selectedPaymentMethod === 'instapay' ? window.roohPayment.generateInstapayRef() : window.roohPayment.generateWalletRef()),
      subtotal: totals.subtotal,
      vat: totals.vat,
      shippingFee: totals.shippingFee,
      codFee: totals.codFee,
      total: totals.total,
      items: this.store.getCartItems().map(i => ({
        productId: i.product.id,
        nameAr: i.product.nameAr,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.image
      }))
    };

    const createdOrder = this.store.createOrder(orderPayload);
    this.closeCheckoutModal();

    // Show luxury confirmation screen
    this.openTrackingModal(createdOrder.id, true);
    this.showToast(isAr ? 'تم تأكيد طلبكِ بنجاح وتسليمه لأسطول شحن رُوح!' : 'Order placed successfully & sent to ROOH Delivery!');
  }

  // --- Tracking Modal ---
  openTrackingModal(orderId, isJustCreated = false) {
    const order = window.roohDelivery.trackOrder(orderId);
    const container = document.getElementById('trackingModalContentContainer');
    const isAr = this.store.data.settings.currentLang === 'ar';

    if (!container) return;

    if (!order) {
      container.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
          <h3 style="color: var(--rooh-burgundy-deep); margin-bottom: 0.5rem;">
            ${isAr ? 'لم يتم العثور على الشحنة' : 'Order Not Found'}
          </h3>
          <p style="color: var(--rooh-text-muted);">
            ${isAr ? `تأكدي من صحة رقم التتبع المدخل: <strong>${orderId}</strong>` : `Please check the tracking number: <strong>${orderId}</strong>`}
          </p>
        </div>
      `;
    } else {
      window.roohDelivery.renderTrackingTimelineUI(order, container, this.store.data.settings.currentLang);
    }

    const backdrop = document.getElementById('trackingModalBackdrop');
    if (backdrop) backdrop.classList.add('active');
  }

  closeTrackingModal() {
    const backdrop = document.getElementById('trackingModalBackdrop');
    if (backdrop) backdrop.classList.remove('active');
  }

  // --- Toast Notification ---
  showToast(message) {
    const container = document.getElementById('toastNotificationContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>✨</span> <div>${message}</div>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}

window.roohApp = new RoohStorefrontApp();
document.addEventListener('DOMContentLoaded', () => {
  window.roohApp.init();
});

