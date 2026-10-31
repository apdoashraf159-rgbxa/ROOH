/**
 * ROOH | رُوح — Business Management System & Admin Ecosystem Controller
 * Full RBAC Permissions, ROOH Delivery Fleet Logistics, Inventory, Finance, Orders
 */

class RoohAdminEcosystem {
  constructor() {
    this.store = window.roohStore;
    this.activeTab = 'dashboard';
    this.currentRole = 'admin'; // 'admin', 'manager', 'inventory', 'support', 'courier'
    this.orderFilter = 'all';
    this.inventorySearch = '';
  }

  init() {
    this.bindEvents();
    this.applyRoleRestrictions();
    this.switchTab('dashboard');
    this.renderActiveRoleUI();

    // Subscribe to state updates
    this.store.subscribe(() => {
      this.refreshCurrentView();
    });
  }

  bindEvents() {
    // Navigation Tabs
    document.querySelectorAll('.admin-nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.getAttribute('data-tab');
        if (this.canAccessTab(tab)) {
          this.switchTab(tab);
        } else {
          alert('عذراً، هذا القسم غير مصرح به لصلاحيتك الحالية في نظام رُوح.');
        }
      });
    });

    // Role Switcher Select
    const roleSelect = document.getElementById('adminRoleSwitcherSelect');
    if (roleSelect) {
      roleSelect.value = this.currentRole;
      roleSelect.addEventListener('change', (e) => {
        this.currentRole = e.target.value;
        this.applyRoleRestrictions();
        this.renderActiveRoleUI();
        this.switchTab(this.getDefaultTabForRole(this.currentRole));
      });
    }

    // Modal close buttons
    document.querySelectorAll('.admin-modal-close-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
      });
    });
  }

  // RBAC Permission Logic
  canAccessTab(tab) {
    if (this.currentRole === 'admin') return true;
    if (this.currentRole === 'manager') return ['dashboard', 'orders', 'delivery', 'inventory', 'reports', 'partners'].includes(tab);
    if (this.currentRole === 'inventory') return ['inventory', 'products', 'partners'].includes(tab);
    if (this.currentRole === 'support') return ['dashboard', 'orders', 'delivery'].includes(tab);
    if (this.currentRole === 'courier') return ['delivery', 'orders'].includes(tab);
    return false;
  }

  getDefaultTabForRole(role) {
    if (role === 'courier') return 'delivery';
    if (role === 'inventory') return 'inventory';
    return 'dashboard';
  }

  applyRoleRestrictions() {
    document.querySelectorAll('.admin-nav-btn').forEach(btn => {
      const tab = btn.getAttribute('data-tab');
      const allowed = this.canAccessTab(tab);
      btn.style.opacity = allowed ? '1' : '0.4';
      btn.style.pointerEvents = allowed ? 'auto' : 'none';
    });
  }

  renderActiveRoleUI() {
    const roleDisplay = document.getElementById('adminCurrentRoleTitle');
    const roleBadges = {
      admin: 'المدير العام والرئيس التنفيذي (Full Access)',
      manager: 'مدير العمليات وسلاسل الإمداد (Operations)',
      inventory: 'مسؤول المستودع والمخازن (Inventory Supervisor)',
      support: 'خدمة العملاء واستشارات التجميل (Customer Concierge)',
      courier: 'مندوب أسطول شحن رُوح (Delivery Courier)'
    };
    if (roleDisplay) roleDisplay.textContent = roleBadges[this.currentRole] || this.currentRole;
  }

  switchTab(tabId) {
    this.activeTab = tabId;
    document.querySelectorAll('.admin-nav-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-tab') === tabId);
    });

    const contentArea = document.getElementById('adminTabContentArea');
    if (!contentArea) return;

    switch (tabId) {
      case 'dashboard':
        this.renderDashboardView(contentArea);
        break;
      case 'orders':
        this.renderOrdersView(contentArea);
        break;
      case 'delivery':
        this.renderDeliveryLogisticsView(contentArea);
        break;
      case 'inventory':
        this.renderInventoryView(contentArea);
        break;
      case 'products':
        this.renderProductsView(contentArea);
        break;
      case 'reports':
        this.renderFinancialReportsView(contentArea);
        break;
      case 'partners':
        this.renderPartnersView(contentArea);
        break;
      case 'staff':
        this.renderStaffView(contentArea);
        break;
      default:
        this.renderDashboardView(contentArea);
    }
  }

  refreshCurrentView() {
    this.switchTab(this.activeTab);
  }

  // ==========================================================================
  // TAB 1: Dashboard & Analytics
  // ==========================================================================
  renderDashboardView(container) {
    const fin = this.store.getFinancialSummary();
    const couriers = this.store.data.shipping.couriers;
    const lowStock = this.store.data.products.filter(p => p.stock <= p.lowStockThreshold);

    container.innerHTML = `
      <!-- KPI Cards -->
      <div class="kpi-cards-grid">
        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-title">إجمالي المبيعات والإيرادات</span>
            <div class="kpi-icon-wrap">💰</div>
          </div>
          <div class="kpi-value">${fin.totalRevenue.toLocaleString()} ج.م</div>
          <div class="kpi-trend positive">▲ +24.8% مقارنة بالشهر السابق</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-title">إجمالي الطلبات المسجلة</span>
            <div class="kpi-icon-wrap">📦</div>
          </div>
          <div class="kpi-value">${fin.totalOrders} طلب</div>
          <div class="kpi-trend positive">✓ ${fin.completedOrdersCount} مكتمل عبر شحن رُوح</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-title">متوسط قيمة الطلب (AOV)</span>
            <div class="kpi-icon-wrap">💎</div>
          </div>
          <div class="kpi-value">${fin.averageOrderValue.toLocaleString()} ج.م</div>
          <div class="kpi-trend positive">▲ طلبات فاخرة VIP</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-title">متحصلات COD في عهدة المناديب</span>
            <div class="kpi-icon-wrap">🚗</div>
          </div>
          <div class="kpi-value">${fin.collectedCod.toLocaleString()} ج.م</div>
          <div class="kpi-trend warning">⏳ جاري توريدها للخزينة</div>
        </div>
      </div>

      <!-- Financial Chart & Governorates Grid -->
      <div class="financial-summary-grid">
        <div class="admin-card-section">
          <div class="card-section-header">
            <h3>📈 منحنى الإيرادات والمبيعات الشهرية (EGP)</h3>
            <span style="font-size: 0.82rem; color: var(--admin-gold);">تحديث لحظي</span>
          </div>
          <div class="chart-wrapper">
            <canvas id="salesTrendCanvas" class="canvas-chart"></canvas>
          </div>
        </div>

        <div class="admin-card-section">
          <div class="card-section-header">
            <h3>💳 توزيع وسائل الدفع المصرية</h3>
          </div>
          <div class="chart-wrapper">
            <canvas id="paymentMethodsCanvas" class="canvas-chart"></canvas>
          </div>
        </div>
      </div>

      <!-- Low Stock Alerts -->
      ${lowStock.length > 0 ? `
        <div class="low-stock-alert-box">
          <div class="low-stock-info">
            <span style="font-size: 1.4rem;">⚠️</span>
            <div>
              <strong>تنبيه المستودع: يوجد ${lowStock.length} منتجات تقترب من النفاد!</strong>
              <div style="font-size: 0.8rem; color: var(--admin-text-muted);">
                ${lowStock.map(p => `${p.nameAr} (${p.stock} متبقي)`).join(' • ')}
              </div>
            </div>
          </div>
          <button class="btn-admin-gold" onclick="window.roohAdmin.switchTab('inventory')">
            إعادة تزويد المخزون الآن
          </button>
        </div>
      ` : ''}

      <!-- Recent Orders Table -->
      <div class="admin-card-section">
        <div class="card-section-header">
          <h3>🕒 أحدث طلبات المتجر الفاخر</h3>
          <button class="btn-admin-outline" onclick="window.roohAdmin.switchTab('orders')">عرض كافة الطلبات ←</button>
        </div>
        ${this.buildOrdersTableHtml(this.store.data.orders.slice(0, 5))}
      </div>
    `;

    setTimeout(() => {
      this.drawSalesTrendChart();
      this.drawPaymentMethodsChart();
    }, 50);
  }

  // Draw Line Chart on Canvas
  drawSalesTrendChart() {
    const canvas = document.getElementById('salesTrendCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.clientWidth;
    const height = 300;
    canvas.width = width;
    canvas.height = height;

    const data = [18500, 24200, 29800, 36400, 42100, 58900];
    const labels = ['مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر'];
    const max = Math.max(...data) * 1.15;

    ctx.clearRect(0, 0, width, height);

    // Draw Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) {
      const y = (height / 5) * i;
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(width - 20, y);
      ctx.stroke();
    }

    // Draw Area Gradient
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, 'rgba(212, 175, 55, 0.35)');
    grad.addColorStop(1, 'rgba(88, 17, 26, 0.0)');

    const points = data.map((val, idx) => {
      const x = 50 + (idx * ((width - 80) / (data.length - 1)));
      const y = height - 40 - ((val / max) * (height - 80));
      return { x, y, val, label: labels[idx] };
    });

    // Fill Curve
    ctx.beginPath();
    ctx.moveTo(points[0].x, height - 30);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, height - 30);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Draw Line
    ctx.beginPath();
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 3;
    points.forEach((p, idx) => {
      if (idx === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    // Draw Points & Labels
    points.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFF';
      ctx.fill();
      ctx.strokeStyle = '#58111A';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#9E918B';
      ctx.font = '12px Cairo';
      ctx.textAlign = 'center';
      ctx.fillText(p.label, p.x, height - 10);
      ctx.fillStyle = '#D4AF37';
      ctx.fillText(`${p.val.toLocaleString()} ج.م`, p.x, p.y - 12);
    });
  }

  // Draw Pie / Donut Chart
  drawPaymentMethodsChart() {
    const canvas = document.getElementById('paymentMethodsCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.clientWidth;
    const height = 300;
    canvas.width = width;
    canvas.height = height;

    const data = [
      { label: 'إنستاباي (InstaPay)', value: 42, color: '#9C27B0' },
      { label: 'محافظ كاش (Vodafone/Orange)', value: 28, color: '#4CAF50' },
      { label: 'بطاقات بنكية (Visa/Meeza)', value: 18, color: '#1976D2' },
      { label: 'الدفع عند الاستلام (COD)', value: 12, color: '#D4AF37' }
    ];

    const centerX = width / 2;
    const centerY = height / 2 - 25;
    const radius = 80;
    let startAngle = 0;

    data.forEach(slice => {
      const sliceAngle = (slice.value / 100) * (Math.PI * 2);
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.arc(centerX, centerY, radius - 35, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = slice.color;
      ctx.fill();
      startAngle += sliceAngle;
    });

    // Legend
    let legendY = height - 55;
    ctx.font = '11px Cairo';
    ctx.textAlign = 'right';
    data.forEach((slice, idx) => {
      const x = idx < 2 ? width - 20 : width / 2 - 10;
      const y = idx % 2 === 0 ? legendY : legendY + 22;
      ctx.fillStyle = slice.color;
      ctx.fillRect(x - 12, y - 9, 10, 10);
      ctx.fillStyle = '#E8D8CE';
      ctx.fillText(`${slice.label} (${slice.value}%)`, x - 20, y);
    });
  }

  // ==========================================================================
  // TAB 2: Orders & Dispatch Management
  // ==========================================================================
  renderOrdersView(container) {
    let orders = this.store.data.orders;
    if (this.orderFilter !== 'all') {
      orders = orders.filter(o => o.status === this.orderFilter);
    }

    container.innerHTML = `
      <div class="admin-card-section">
        <div class="card-section-header">
          <h3>📦 إدارة وتجهيز طلبات العملاء (${orders.length})</h3>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button class="btn-admin-outline ${this.orderFilter === 'all' ? 'active' : ''}" onclick="window.roohAdmin.setOrderFilter('all')">الكل</button>
            <button class="btn-admin-outline ${this.orderFilter === 'processing' ? 'active' : ''}" onclick="window.roohAdmin.setOrderFilter('processing')">قيد التجهيز</button>
            <button class="btn-admin-outline ${this.orderFilter === 'dispatched' ? 'active' : ''}" onclick="window.roohAdmin.setOrderFilter('dispatched')">خرجت للشحن</button>
            <button class="btn-admin-outline ${this.orderFilter === 'out_for_delivery' ? 'active' : ''}" onclick="window.roohAdmin.setOrderFilter('out_for_delivery')">مع المندوب</button>
            <button class="btn-admin-outline ${this.orderFilter === 'delivered' ? 'active' : ''}" onclick="window.roohAdmin.setOrderFilter('delivered')">تم التوصيل</button>
          </div>
        </div>

        ${this.buildOrdersTableHtml(orders, true)}
      </div>
    `;
  }

  setOrderFilter(status) {
    this.orderFilter = status;
    this.refreshCurrentView();
  }

  buildOrdersTableHtml(orders, showFullActions = false) {
    if (orders.length === 0) {
      return `<div style="text-align: center; padding: 3rem 1rem; color: var(--admin-text-muted);">لا توجد طلبات مطابقة.</div>`;
    }

    const couriers = this.store.data.shipping.couriers;

    return `
      <div class="admin-table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>رقم الشحنة</th>
              <th>العميل والمحافظة</th>
              <th>المنتجات المطلوبة</th>
              <th>طريقة الدفع</th>
              <th>الإجمالي (EGP)</th>
              <th>حالة الشحن</th>
              ${showFullActions ? '<th>المندوب والإجراءات</th>' : ''}
            </tr>
          </thead>
          <tbody>
            ${orders.map(order => `
              <tr>
                <td>
                  <strong style="color: var(--admin-gold); font-family: monospace;">${order.id}</strong>
                  <div style="font-size: 0.75rem; color: var(--admin-text-muted);">${new Date(order.orderDate).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</div>
                </td>
                <td>
                  <div style="font-weight: 700; color: #FFF;">${order.customerName}</div>
                  <div style="font-size: 0.8rem; color: var(--admin-text-muted);">${order.governorate} • ${order.customerPhone}</div>
                </td>
                <td>
                  <div style="font-size: 0.85rem;">
                    ${order.items.map(i => `${i.nameAr} (${i.quantity}x)`).join('<br>')}
                  </div>
                </td>
                <td>
                  <span style="font-size: 0.82rem; font-weight: 700; color: #FFF; background: rgba(255,255,255,0.06); padding: 0.2rem 0.5rem; border-radius: 4px;">
                    ${order.paymentMethod.toUpperCase()}
                  </span>
                  <div style="font-size: 0.74rem; color: ${order.paymentStatus === 'paid' ? '#4CAF50' : '#FFA726'};">
                    ${order.paymentStatus === 'paid' ? 'تم الدفع' : 'تحصيل نقدي عند الاستلام'}
                  </div>
                </td>
                <td>
                  <strong style="color: #FFF; font-size: 1.05rem;">${order.total.toLocaleString()} ج.م</strong>
                </td>
                <td>
                  <span class="badge-status ${order.status}">
                    ${order.status}
                  </span>
                </td>
                ${showFullActions ? `
                  <td>
                    <div style="display: flex; gap: 0.4rem; align-items: center;">
                      <select onchange="window.roohAdmin.handleAssignCourier('${order.id}', this.value)" style="background: var(--admin-card); color: #FFF; border: 1px solid var(--admin-border-light); font-size: 0.78rem; padding: 0.35rem 0.5rem; border-radius: 4px;">
                        ${couriers.map(c => `
                          <option value="${c.id}" ${c.id === order.courierId ? 'selected' : ''}>${c.nameAr}</option>
                        `).join('')}
                      </select>

                      <select onchange="window.roohAdmin.handleUpdateStatus('${order.id}', this.value)" style="background: var(--admin-card); color: var(--admin-gold); border: 1px solid var(--admin-border); font-size: 0.78rem; padding: 0.35rem 0.5rem; border-radius: 4px; font-weight: 700;">
                        <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>قيد التجهيز</option>
                        <option value="dispatched" ${order.status === 'dispatched' ? 'selected' : ''}>تم الشحن</option>
                        <option value="out_for_delivery" ${order.status === 'out_for_delivery' ? 'selected' : ''}>مع المندوب</option>
                        <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>تم التوصيل</option>
                        <option value="returned" ${order.status === 'returned' ? 'selected' : ''}>مرتجع</option>
                      </select>

                      <button class="btn-admin-outline" style="padding: 0.35rem 0.6rem; font-size: 0.75rem;" onclick="window.roohAdmin.printInvoice('${order.id}')" title="طباعة بوليصة الشحن الفاخرة">
                        🖨️
                      </button>
                    </div>
                  </td>
                ` : ''}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  handleAssignCourier(orderId, courierId) {
    window.roohDelivery.assignCourier(orderId, courierId);
    alert('تم إسناد الشحنة للمندوب بنجاح.');
    this.refreshCurrentView();
  }

  handleUpdateStatus(orderId, status) {
    window.roohDelivery.updateDeliveryStatus(orderId, status);
    alert('تم تحديث حالة الشحنة بنجاح في أسطول شحن رُوح.');
    this.refreshCurrentView();
  }

  // Print Official Luxury Invoice
  printInvoice(orderId) {
    const order = this.store.data.orders.find(o => o.id === orderId);
    if (!order) return;

    const win = window.open('', '_blank');
    win.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <title>فاتورة رُوح الفاخرة — ${order.id}</title>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Cinzel:wght@700&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Cairo', sans-serif; padding: 2rem; color: #1A0407; max-width: 800px; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #D4AF37; padding-bottom: 1rem; margin-bottom: 1.5rem; }
          .brand { font-size: 1.8rem; font-weight: 800; color: #4A0E17; }
          .table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
          .table th { background: #FAF6F0; padding: 0.75rem; border-bottom: 2px solid #D4AF37; text-align: right; }
          .table td { padding: 0.75rem; border-bottom: 1px solid #E8DCCB; }
          .total-box { margin-top: 1rem; text-align: left; }
          .stamp { margin-top: 2rem; text-align: center; border: 2px dashed #4A0E17; padding: 1rem; border-radius: 8px; color: #4A0E17; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">ROOH | رُوح</div>
            <div style="font-size: 0.9rem; color: #721C24;">مستحضرات تجميل وعطور ملكية فاخرة</div>
            <div style="font-size: 0.8rem;">س.ت: 984210 • ب.ض: 420-918-100</div>
          </div>
          <div style="text-align: left;">
            <h2 style="margin: 0; color: #D4AF37;">بوليصة شحن وفاتورة ضريبية</h2>
            <div style="font-family: monospace; font-weight: 800; font-size: 1.2rem;">${order.id}</div>
            <div style="font-size: 0.85rem;">التاريخ: ${new Date(order.orderDate).toLocaleDateString('ar-EG')}</div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; background: #FAF6F0; padding: 1rem; border-radius: 8px;">
          <div>
            <strong>بيانات العميلة الفاخرة:</strong><br>
            الاسم: ${order.customerName}<br>
            الهاتف: ${order.customerPhone}<br>
            المحافظة: ${order.governorate}<br>
            العنوان: ${order.shippingAddress}
          </div>
          <div>
            <strong>تفاصيل أسطول شحن رُوح:</strong><br>
            شركة الشحن: <strong>شحن رُوح | ROOH Delivery</strong><br>
            مندوب التوصيل: ${order.courierName || 'أحمد عبد الرحمن'}<br>
            هاتف المندوب: ${order.courierPhone || '01011223344'}<br>
            طريقة الدفع: ${order.paymentMethod.toUpperCase()} (${order.paymentStatus === 'paid' ? 'مدفوع إلكترونياً' : 'تحصيل نقدي عند الاستلام'})
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>المنتج</th>
              <th>الكمية</th>
              <th>السعر (EGP)</th>
              <th>الإجمالي (EGP)</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(i => `
              <tr>
                <td>${i.nameAr}</td>
                <td>${i.quantity}</td>
                <td>${i.price.toLocaleString()} ج.م</td>
                <td>${(i.price * i.quantity).toLocaleString()} ج.م</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="total-box">
          <div>المجموع الفرعي: <strong>${order.subtotal.toLocaleString()} ج.م</strong></div>
          <div>ضريبة القيمة المضافة (14%): <strong>${Math.round(order.vat).toLocaleString()} ج.م</strong></div>
          <div>رسوم شحن رُوح: <strong>${order.shippingFee === 0 ? 'شحن مجاني' : `${order.shippingFee} ج.م`}</strong></div>
          ${order.codFee ? `<div>رسوم الدفع عند الاستلام: <strong>${order.codFee} ج.م</strong></div>` : ''}
          <div style="font-size: 1.4rem; color: #4A0E17; margin-top: 0.5rem; font-weight: 800;">
            المبلغ الإجمالي المستحق: ${order.total.toLocaleString()} ج.م
          </div>
        </div>

        <div class="stamp">
          ✓ معتمد وموثق من دار رُوح للتجميل والعطور • شحن رُوح السريع 19842
        </div>
      </body>
      </html>
    `);
    win.document.close();
    win.print();
  }

  // ==========================================================================
  // TAB 3: ROOH Delivery — Independent Logistics Hub
  // ==========================================================================
  renderDeliveryLogisticsView(container) {
    const couriers = this.store.data.shipping.couriers;
    const govs = this.store.data.shipping.governorates;

    container.innerHTML = `
      <!-- Logistics Header -->
      <div class="admin-card-section" style="background: linear-gradient(135deg, rgba(88, 17, 26, 0.4), rgba(26, 4, 7, 0.8)); border-color: var(--admin-gold);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.4rem;">
              <span style="font-size: 1.8rem;">🚗</span>
              <h2 style="color: #FFF; font-size: 1.5rem; font-weight: 800;">أسطول شحن رُوح المستقل (ROOH Delivery Express)</h2>
            </div>
            <p style="color: var(--admin-text-muted); font-size: 0.92rem;">
              نظام إدارة الشحن اللوجستي الخاص بدار رُوح بدون وسيط خارجي — تغطية 27 محافظة مصرية بسيارات مكيفة ومبردة.
            </p>
          </div>
          <button class="btn-admin-gold" onclick="window.roohAdmin.openAddCourierModal()">
            + إضافة مندوب توصيل جديد للأسطول
          </button>
        </div>
      </div>

      <!-- Couriers Fleet Grid -->
      <h3 style="color: var(--admin-gold); font-size: 1.2rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
        <span>👥</span> مناديب أسطول شحن رُوح والعهد النقدية المحصلة
      </h3>
      <div class="courier-fleet-grid">
        ${couriers.map(c => `
          <div class="courier-card">
            <div class="courier-header">
              <div class="courier-avatar">${c.nameAr.charAt(0)}</div>
              <div>
                <div class="courier-name">${c.nameAr}</div>
                <div class="courier-phone">📞 ${c.phone}</div>
              </div>
            </div>

            <div class="courier-stat-row">
              <span style="color: var(--admin-text-muted);">المركبة:</span>
              <strong style="color: #FFF;">${c.vehicleAr}</strong>
            </div>

            <div class="courier-stat-row">
              <span style="color: var(--admin-text-muted);">نطاق التغطية:</span>
              <strong style="color: var(--admin-gold);">${c.assignedZones.join(', ')}</strong>
            </div>

            <div class="courier-stat-row">
              <span style="color: var(--admin-text-muted);">الشحنات النشطة:</span>
              <strong style="color: #4CAF50;">${c.activeOrdersCount || 0} شحنة</strong>
            </div>

            <div class="courier-stat-row">
              <span style="color: var(--admin-text-muted);">إجمالي التوصيلات:</span>
              <strong style="color: #FFF;">${c.totalDelivered} طرد</strong>
            </div>

            <!-- COD Custody Box -->
            <div class="courier-cod-box">
              <div class="courier-cod-title">العهدة النقدية المحصلة (COD) في ذمة المندوب:</div>
              <div class="courier-cod-amount">${(c.codBalanceCollected || 0).toLocaleString()} ج.م</div>
              ${c.codBalanceCollected > 0 ? `
                <button class="btn-admin-gold" style="margin-top: 0.6rem; width: 100%; font-size: 0.82rem; padding: 0.4rem;" onclick="window.roohAdmin.settleCourierCash('${c.id}')">
                  تسوية العهدة وإيداع بالخزينة
                </button>
              ` : '<div style="font-size: 0.75rem; color: #4CAF50; margin-top: 0.4rem;">✓ العهدة مسواة بالكامل</div>'}
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Governorates Shipping Rates & Transit Times -->
      <div class="admin-card-section">
        <div class="card-section-header">
          <h3>📍 تسعير وتوقيتات شحن رُوح بالمحافظات المصرية</h3>
          <span style="font-size: 0.85rem; color: var(--admin-text-muted);">يمكنكِ تعديل تكلفة الشحن وموعد التوصيل لأي محافظة</span>
        </div>
        <div class="admin-table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>المحافظة</th>
                <th>الإقليم الجغرافي</th>
                <th>تكلفة الشحن (EGP)</th>
                <th>مدة التوصيل التقديرية</th>
                <th>حالة التغطية</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              ${govs.map(g => `
                <tr>
                  <td><strong style="color: #FFF;">${g.nameAr}</strong> (${g.nameEn})</td>
                  <td style="color: var(--admin-gold);">${g.zone}</td>
                  <td>
                    <input type="number" value="${g.fee}" id="gov_fee_${g.id}" style="width: 80px; background: var(--admin-card); color: #FFF; border: 1px solid var(--admin-border); padding: 0.35rem 0.6rem; border-radius: 4px; font-weight: 700;"> ج.م
                  </td>
                  <td>
                    <input type="text" value="${g.transitTime}" id="gov_time_${g.id}" style="width: 140px; background: var(--admin-card); color: #FFF; border: 1px solid var(--admin-border); padding: 0.35rem 0.6rem; border-radius: 4px;">
                  </td>
                  <td>
                    <span style="color: #4CAF50; font-weight: 700;">✓ أسطول رُوح مباشر</span>
                  </td>
                  <td>
                    <button class="btn-admin-gold" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;" onclick="window.roohAdmin.saveGovRate('${g.id}')">
                      حفظ التعديل
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  settleCourierCash(courierId) {
    const courier = window.roohDelivery.getCourier(courierId);
    if (!courier) return;
    const confirm = window.confirm(`هل أنتِ متأكدة من تسوية واستلام مبلغ ${courier.codBalanceCollected.toLocaleString()} ج.م من المندوب ${courier.nameAr} وتوريده لخزينة رُوح؟`);
    if (confirm) {
      window.roohDelivery.settleCourierCash(courierId);
      alert('تمت تسوية العهدة النقدية بنجاح وتسجيل سند إيداع بالخزينة.');
      this.refreshCurrentView();
    }
  }

  saveGovRate(govId) {
    const feeInput = document.getElementById(`gov_fee_${govId}`);
    const timeInput = document.getElementById(`gov_time_${govId}`);
    const gov = this.store.data.shipping.governorates.find(g => g.id === govId);
    if (gov && feeInput && timeInput) {
      gov.fee = Number(feeInput.value);
      gov.transitTime = timeInput.value.trim();
      this.store.saveState();
      alert(`تم تحديث تسعيرة شحن ${gov.nameAr} بنجاح إلى ${gov.fee} ج.م.`);
    }
  }

  // ==========================================================================
  // TAB 4: Inventory & Warehouse Management
  // ==========================================================================
  renderInventoryView(container) {
    const products = this.store.data.products;

    container.innerHTML = `
      <div class="admin-card-section">
        <div class="card-section-header">
          <h3>🏬 إدارة المستودعات ومستويات المخزون</h3>
          <div style="display: flex; gap: 0.6rem;">
            <input type="text" placeholder="بحث بالاسم أو SKU..." id="inventorySearchInput" 
                   oninput="window.roohAdmin.filterInventoryTable(this.value)"
                   style="background: var(--admin-sidebar); color: #FFF; border: 1px solid var(--admin-border); padding: 0.45rem 1rem; border-radius: 6px; font-size: 0.88rem;">
            <button class="btn-admin-gold" onclick="window.roohAdmin.openRestockModal()">
              + تزويد شحنة توريد جديدة
            </button>
          </div>
        </div>

        <div class="admin-table-container">
          <table class="admin-table" id="inventoryTable">
            <thead>
              <tr>
                <th>كود المنتج (SKU)</th>
                <th>اسم المستحضر</th>
                <th>القسم الفاخر</th>
                <th>الحجم</th>
                <th>المخزون الحالي</th>
                <th>مستوى الأمان</th>
                <th>الحالة</th>
                <th>إجراءات المستودع</th>
              </tr>
            </thead>
            <tbody>
              ${products.map(p => {
                const isLow = p.stock <= p.lowStockThreshold;
                const pct = Math.min(100, Math.round((p.stock / 60) * 100));
                return `
                  <tr>
                    <td><strong style="color: var(--admin-gold); font-family: monospace;">${p.sku}</strong></td>
                    <td>
                      <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <img src="${p.image}" style="width: 36px; height: 36px; object-fit: contain;">
                        <strong style="color: #FFF;">${p.nameAr}</strong>
                      </div>
                    </td>
                    <td>${p.category}</td>
                    <td>${p.volume}</td>
                    <td>
                      <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <strong style="font-size: 1.1rem; color: ${isLow ? '#EF5350' : '#FFF'};">${p.stock} قطعة</strong>
                        <div style="width: 60px; height: 6px; background: rgba(255,255,255,0.1); border-radius: 99px; overflow: hidden;">
                          <div style="width: ${pct}%; height: 100%; background: ${isLow ? '#EF5350' : '#4CAF50'};"></div>
                        </div>
                      </div>
                    </td>
                    <td>${p.lowStockThreshold} قطع</td>
                    <td>
                      <span class="badge-status ${isLow ? 'returned' : 'delivered'}" style="font-size: 0.75rem;">
                        ${isLow ? '⚠️ منخفض جداً' : '✓ متوفر وآمن'}
                      </span>
                    </td>
                    <td>
                      <button class="btn-admin-outline" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;" onclick="window.roohAdmin.quickRestockProduct(${p.id})">
                        + إضافة 20 قطعة
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  quickRestockProduct(prodId) {
    this.store.restockProduct(prodId, 20);
    alert('تم توريد 20 قطعة للمستودع وتحديث المخزون بنجاح.');
    this.refreshCurrentView();
  }

  filterInventoryTable(query) {
    const q = query.toLowerCase();
    document.querySelectorAll('#inventoryTable tbody tr').forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(q) ? '' : 'none';
    });
  }

  // ==========================================================================
  // TAB 5: Products & Categories CRUD
  // ==========================================================================
  renderProductsView(container) {
    const products = this.store.data.products;

    container.innerHTML = `
      <div class="admin-card-section">
        <div class="card-section-header">
          <h3>✨ كتالوج مستحضرات تجميل وعطور رُوح (${products.length})</h3>
          <button class="btn-admin-gold" onclick="window.roohAdmin.openAddProductModal()">
            + إضافة منتج فاخر جديد للكتالوج
          </button>
        </div>

        <div class="admin-table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>الصورة</th>
                <th>اسم المنتج والـ SKU</th>
                <th>القسم والفرع</th>
                <th>سعر البيع (EGP)</th>
                <th>سعر التكلفة</th>
                <th>هامش الربح</th>
                <th>المخزون</th>
                <th>إجراءات الإدارة</th>
              </tr>
            </thead>
            <tbody>
              ${products.map(p => {
                const profit = p.price - (p.costPrice || p.price * 0.35);
                const margin = ((profit / p.price) * 100).toFixed(0);
                return `
                  <tr>
                    <td><img src="${p.image}" style="width: 44px; height: 44px; object-fit: contain;"></td>
                    <td>
                      <strong style="color: #FFF;">${p.nameAr}</strong>
                      <div style="font-size: 0.78rem; color: var(--admin-text-muted);">${p.nameEn} • ${p.sku}</div>
                    </td>
                    <td>${p.category}</td>
                    <td><strong style="color: var(--admin-gold);">${p.price.toLocaleString()} ج.م</strong></td>
                    <td style="color: var(--admin-text-muted);">${(p.costPrice || 250).toLocaleString()} ج.م</td>
                    <td><span style="color: #4CAF50; font-weight: 700;">+${profit.toLocaleString()} ج.م (${margin}%)</span></td>
                    <td><strong>${p.stock}</strong></td>
                    <td>
                      <div style="display: flex; gap: 0.4rem;">
                        <button class="btn-admin-outline" style="padding: 0.35rem 0.65rem; font-size: 0.8rem;" onclick="window.roohAdmin.openEditProductModal(${p.id})">تعديل</button>
                        <button class="btn-admin-danger" onclick="window.roohAdmin.handleDeleteProduct(${p.id})">حذف</button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  handleDeleteProduct(id) {
    if (window.confirm('هل أنتِ متأكدة من حذف هذا المنتج نهائياً من منصة رُوح؟')) {
      this.store.deleteProduct(id);
      alert('تم حذف المنتج بنجاح.');
      this.refreshCurrentView();
    }
  }

  openAddProductModal() {
    this.openProductEditDialog(null);
  }

  openEditProductModal(id) {
    const prod = this.store.getProductById(id);
    if (prod) this.openProductEditDialog(prod);
  }

  openProductEditDialog(prod = null) {
    const isEdit = !!prod;
    const dialog = document.getElementById('adminGenericModalContainer');
    if (!dialog) return;

    dialog.innerHTML = `
      <div class="admin-modal-dialog">
        <button class="modal-close-btn admin-modal-close-btn" onclick="document.getElementById('adminGenericModalBackdrop').classList.remove('active')">✕</button>
        <h3 style="color: var(--admin-gold); margin-bottom: 1.5rem;">
          ${isEdit ? `تعديل بيانات المنتج: ${prod.nameAr}` : 'إضافة مستحضر فاخر جديد لدار رُوح'}
        </h3>

        <form id="adminProductForm" onsubmit="event.preventDefault(); window.roohAdmin.saveProductFormData(${isEdit ? prod.id : 'null'});">
          <div class="admin-form-group">
            <label class="admin-form-label">الاسم بالعربية:</label>
            <input type="text" id="pFormNameAr" class="admin-form-input" required value="${isEdit ? prod.nameAr : ''}">
          </div>

          <div class="admin-form-group">
            <label class="admin-form-label">الاسم بالإنجليزية:</label>
            <input type="text" id="pFormNameEn" class="admin-form-input" required value="${isEdit ? prod.nameEn : ''}">
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="admin-form-group">
              <label class="admin-form-label">القسم الرئيسي:</label>
              <select id="pFormCategory" class="admin-form-select">
                <option value="skincare" ${isEdit && prod.category === 'skincare' ? 'selected' : ''}>العناية بالبشرة</option>
                <option value="haircare" ${isEdit && prod.category === 'haircare' ? 'selected' : ''}>العناية بالشعر</option>
                <option value="body" ${isEdit && prod.category === 'body' ? 'selected' : ''}>العناية بالجسم</option>
                <option value="makeup" ${isEdit && prod.category === 'makeup' ? 'selected' : ''}>المكياج الفاخر</option>
                <option value="fragrances" ${isEdit && prod.category === 'fragrances' ? 'selected' : ''}>العطور الفاخرة</option>
                <option value="men" ${isEdit && prod.category === 'men' ? 'selected' : ''}>العناية بالرجل</option>
              </select>
            </div>

            <div class="admin-form-group">
              <label class="admin-form-label">الحجم / السعة:</label>
              <input type="text" id="pFormVolume" class="admin-form-input" placeholder="مثال: 50 مل" value="${isEdit ? prod.volume : '50 مل'}">
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
            <div class="admin-form-group">
              <label class="admin-form-label">سعر البيع (EGP):</label>
              <input type="number" id="pFormPrice" class="admin-form-input" required value="${isEdit ? prod.price : 850}">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">السعر قبل الخصم (EGP):</label>
              <input type="number" id="pFormOrigPrice" class="admin-form-input" required value="${isEdit ? prod.originalPrice : 1100}">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">تكلفة التوريد (EGP):</label>
              <input type="number" id="pFormCost" class="admin-form-input" required value="${isEdit ? (prod.costPrice || 300) : 300}">
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="admin-form-group">
              <label class="admin-form-label">المخزون المتوفر:</label>
              <input type="number" id="pFormStock" class="admin-form-input" required value="${isEdit ? prod.stock : 25}">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">الشارة الترويجية (Badge):</label>
              <input type="text" id="pFormBadge" class="admin-form-input" placeholder="مثال: حصري" value="${isEdit ? prod.badge : 'حصري'}">
            </div>
          </div>

          <div class="admin-form-group">
            <label class="admin-form-label">الوصف التفصيلي:</label>
            <textarea id="pFormDesc" class="admin-form-textarea" rows="3">${isEdit ? prod.descriptionAr : ''}</textarea>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.8rem; margin-top: 1.5rem;">
            <button type="button" class="btn-admin-outline" onclick="document.getElementById('adminGenericModalBackdrop').classList.remove('active')">إلغاء</button>
            <button type="submit" class="btn-admin-gold">حفظ المنتج</button>
          </div>
        </form>
      </div>
    `;

    document.getElementById('adminGenericModalBackdrop').classList.add('active');
  }

  saveProductFormData(prodId) {
    const payload = {
      id: prodId,
      nameAr: document.getElementById('pFormNameAr').value.trim(),
      nameEn: document.getElementById('pFormNameEn').value.trim(),
      category: document.getElementById('pFormCategory').value,
      volume: document.getElementById('pFormVolume').value.trim(),
      price: Number(document.getElementById('pFormPrice').value),
      originalPrice: Number(document.getElementById('pFormOrigPrice').value),
      costPrice: Number(document.getElementById('pFormCost').value),
      stock: Number(document.getElementById('pFormStock').value),
      badge: document.getElementById('pFormBadge').value.trim(),
      descriptionAr: document.getElementById('pFormDesc').value.trim()
    };

    this.store.saveProduct(payload);
    document.getElementById('adminGenericModalBackdrop').classList.remove('active');
    alert('تم حفظ بيانات المنتج بنجاح.');
    this.refreshCurrentView();
  }

  // ==========================================================================
  // TAB 6: Financial Reports & Egyptian Tax Ledger
  // ==========================================================================
  renderFinancialReportsView(container) {
    const fin = this.store.getFinancialSummary();
    const orders = this.store.data.orders;
    const vatRate = this.store.data.settings.vatRate;
    const totalVat = orders.reduce((sum, o) => sum + (o.vat || 0), 0);

    container.innerHTML = `
      <div class="admin-card-section">
        <div class="card-section-header">
          <h3>📊 الإقرار المالي والضريبي الرسمي (EGP)</h3>
          <div style="display: flex; gap: 0.6rem;">
            <button class="btn-admin-outline" onclick="window.roohAdmin.exportFinancialCsv()">
              ⬇️ تصدير تقرير الإكسيل (CSV)
            </button>
            <button class="btn-admin-gold" onclick="window.print()">
              🖨️ طباعة القوائم المالية
            </button>
          </div>
        </div>

        <div class="kpi-cards-grid" style="margin-bottom: 2rem;">
          <div class="kpi-card">
            <div class="kpi-title">إجمالي المبيعات الإجمالية</div>
            <div class="kpi-value">${fin.totalRevenue.toLocaleString()} ج.م</div>
            <div style="font-size: 0.8rem; color: #4CAF50;">مبيعات معتمدة بالجنيه المصري</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-title">تكلفة البضاعة المباعة (COGS)</div>
            <div class="kpi-value" style="color: #FFA726;">${Math.round(fin.totalCogs).toLocaleString()} ج.م</div>
            <div style="font-size: 0.8rem; color: var(--admin-text-muted);">تكلفة المكونات والتصنيع</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-title">مجمل الربح الصافي (Gross Profit)</div>
            <div class="kpi-value" style="color: #4CAF50;">${Math.round(fin.grossProfit).toLocaleString()} ج.م</div>
            <div style="font-size: 0.8rem; color: #4CAF50;">هامش ربح ${fin.profitMargin}%</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-title">ضريبة القيمة المضافة المحصلة (14%)</div>
            <div class="kpi-value" style="color: var(--admin-gold);">${Math.round(totalVat).toLocaleString()} ج.م</div>
            <div style="font-size: 0.8rem; color: var(--admin-text-muted);">مستحقة لمصلحة الضرائب المصرية</div>
          </div>
        </div>

        <h4 style="color: #FFF; margin-bottom: 1rem;">سجل المعاملات والمدفوعات المفصل</h4>
        <div class="admin-table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>رقم الطلب والتاريخ</th>
                <th>طريقة الدفع والمرجع</th>
                <th>قيمة المنتجات</th>
                <th>ضريبة 14%</th>
                <th>شحن رُوح</th>
                <th>إجمالي التحصيل</th>
                <th>حالة التسوية</th>
              </tr>
            </thead>
            <tbody>
              ${orders.map(o => `
                <tr>
                  <td><strong>${o.id}</strong><br><span style="font-size: 0.75rem; color: var(--admin-text-muted);">${new Date(o.orderDate).toLocaleDateString('ar-EG')}</span></td>
                  <td><strong style="color: var(--admin-gold);">${o.paymentMethod.toUpperCase()}</strong><br><span style="font-size: 0.75rem; color: var(--admin-text-muted);">${o.paymentRef || 'N/A'}</span></td>
                  <td>${o.subtotal.toLocaleString()} ج.م</td>
                  <td>${Math.round(o.vat || 0).toLocaleString()} ج.م</td>
                  <td>${(o.shippingFee || 0).toLocaleString()} ج.م</td>
                  <td><strong style="color: #FFF;">${o.total.toLocaleString()} ج.م</strong></td>
                  <td>
                    <span style="color: ${o.paymentStatus === 'paid' ? '#4CAF50' : '#FFA726'}; font-weight: 700;">
                      ${o.paymentStatus === 'paid' ? '✓ تم التحصيل والتسوية' : '⏳ معلق (COD تحصيل عند الباب)'}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  exportFinancialCsv() {
    const orders = this.store.data.orders;
    let csv = "Order ID,Date,Customer,Governorate,Payment Method,Subtotal,VAT,Shipping,Total,Status\n";
    orders.forEach(o => {
      csv += `"${o.id}","${o.orderDate}","${o.customerName}","${o.governorate}","${o.paymentMethod}",${o.subtotal},${o.vat},${o.shippingFee},${o.total},"${o.status}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ROOH_Financial_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  // ==========================================================================
  // TAB 7: Brand Partners & Suppliers Ecosystem
  // ==========================================================================
  renderPartnersView(container) {
    const partners = this.store.data.partners;

    container.innerHTML = `
      <div class="admin-card-section">
        <div class="card-section-header">
          <h3>🤝 إدارة الشركاء الاستراتيجيين والموردين (${partners.length})</h3>
          <button class="btn-admin-gold" onclick="alert('خاصية إضافة عقد شريك جديد')">
            + إضافة شريك توريد أو توزيع
          </button>
        </div>

        <div class="courier-fleet-grid">
          ${partners.map(p => `
            <div class="courier-card" style="border-color: rgba(212, 175, 55, 0.3);">
              <div style="font-size: 0.75rem; color: var(--admin-gold); font-weight: 700; margin-bottom: 0.4rem;">
                ${p.contractTier}
              </div>
              <h4 style="color: #FFF; font-size: 1.15rem; margin-bottom: 0.4rem;">${p.nameAr}</h4>
              <p style="font-size: 0.82rem; color: var(--admin-text-muted); margin-bottom: 1rem;">${p.categoryAr}</p>
              
              <div class="courier-stat-row">
                <span style="color: var(--admin-text-muted);">المسؤول:</span>
                <strong style="color: #FFF;">${p.contactPerson}</strong>
              </div>
              <div class="courier-stat-row">
                <span style="color: var(--admin-text-muted);">الهاتف:</span>
                <strong style="color: var(--admin-gold);">${p.phone}</strong>
              </div>
              <div class="courier-stat-row">
                <span style="color: var(--admin-text-muted);">عدد الدفعات الموردة:</span>
                <strong style="color: #FFF;">${p.deliveriesCount} توريدات</strong>
              </div>

              <div class="courier-cod-box" style="margin-top: 1rem;">
                <div class="courier-cod-title">${p.balanceDue >= 0 ? 'مستحقات الشريك لدى رُوح:' : 'مستحقات رُوح لدى الشريك:'}</div>
                <div class="courier-cod-amount" style="color: ${p.balanceDue >= 0 ? '#FFA726' : '#4CAF50'};">
                  ${Math.abs(p.balanceDue).toLocaleString()} ج.م
                </div>
                <button class="btn-admin-outline" style="margin-top: 0.6rem; width: 100%; font-size: 0.8rem;" onclick="alert('تسوية الحساب مع ${p.nameAr}')">
                  إجراء تسوية مالية
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // TAB 8: Staff & Permissions (RBAC)
  // ==========================================================================
  renderStaffView(container) {
    const staff = this.store.data.staff;

    container.innerHTML = `
      <div class="admin-card-section">
        <div class="card-section-header">
          <h3>👥 منظومة صلاحيات الموظفين وكوادر دار رُوح</h3>
          <button class="btn-admin-gold" onclick="alert('خاصية إضافة موظف جديد')">
            + إضافة موظف جديد وتحديد الصلاحيات
          </button>
        </div>

        <div class="admin-table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>كود الموظف</th>
                <th>الاسم وبيانات الاتصال</th>
                <th>الدور الوظيفي في رُوح</th>
                <th>الصلاحيات الممنوحة</th>
                <th>الحالة</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              ${staff.map(s => `
                <tr>
                  <td><strong style="color: var(--admin-gold);">${s.id}</strong></td>
                  <td>
                    <strong style="color: #FFF;">${s.name}</strong>
                    <div style="font-size: 0.8rem; color: var(--admin-text-muted);">${s.email} • ${s.phone}</div>
                  </td>
                  <td>
                    <span style="background: rgba(212, 175, 55, 0.12); color: var(--admin-gold); padding: 0.25rem 0.65rem; border-radius: 4px; font-weight: 700; font-size: 0.85rem;">
                      ${s.roleTitleAr}
                    </span>
                  </td>
                  <td>
                    <div style="font-size: 0.8rem; color: var(--admin-text-muted);">
                      ${s.permissions.join(' • ')}
                    </div>
                  </td>
                  <td>
                    <span style="color: #4CAF50; font-weight: 700;">✓ نشط</span>
                  </td>
                  <td>
                    <button class="btn-admin-outline" style="padding: 0.35rem 0.65rem; font-size: 0.78rem;" onclick="alert('تعديل صلاحيات ${s.name}')">
                      تعديل الصلاحيات
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
}

window.roohAdmin = new RoohAdminEcosystem();
document.addEventListener('DOMContentLoaded', () => {
  if (document.body.classList.contains('admin-body')) {
    window.roohAdmin.init();
  }
});

