/**
 * ROOH | رُوح — Custom Independent Shipping System: ROOH Delivery (شحن رُوح)
 * Complete Fleet & Logistics Management
 */

class RoohDeliveryEngine {
  constructor() {
    this.store = window.roohStore;
  }

  // Get governorate details by ID or Name
  getGovernorate(govIdOrName) {
    const list = this.store.data.shipping.governorates;
    return list.find(g => g.id === govIdOrName || g.nameAr === govIdOrName || g.nameEn === govIdOrName) || list[0];
  }

  // Calculate delivery fee
  calculateFee(govId, cartSubtotal) {
    if (cartSubtotal >= this.store.data.settings.freeShippingThreshold) {
      return 0; // Free Luxury Delivery
    }
    const gov = this.getGovernorate(govId);
    return gov ? gov.fee : 45;
  }

  // Get estimated delivery date text
  getEstimatedDelivery(govId, lang = 'ar') {
    const gov = this.getGovernorate(govId);
    const isAr = lang === 'ar';
    return isAr ? gov.transitTime : gov.transitTime.replace('خلال', 'within').replace('ساعة', 'hrs').replace('أيام', 'days');
  }

  // Search order tracking by ID
  trackOrder(orderId) {
    if (!orderId) return null;
    const cleanId = orderId.trim().toUpperCase();
    return this.store.data.orders.find(o => o.id.toUpperCase() === cleanId) || null;
  }

  // Get Courier by ID
  getCourier(courierId) {
    return this.store.data.shipping.couriers.find(c => c.id === courierId);
  }

  // Assign Order to Courier
  assignCourier(orderId, courierId) {
    this.store.assignCourierToOrder(orderId, courierId);
    const courier = this.getCourier(courierId);
    if (courier) {
      courier.activeOrdersCount = (courier.activeOrdersCount || 0) + 1;
      this.store.saveState();
    }
  }

  // Update Status & Handle COD Collection
  updateDeliveryStatus(orderId, newStatus, courierId = null, notes = '') {
    const order = this.store.data.orders.find(o => o.id === orderId);
    if (!order) return;

    this.store.updateOrderStatus(orderId, newStatus, notes);

    // If marked delivered and payment is COD, record the cash collected into courier custody
    if (newStatus === 'delivered' && order.paymentMethod === 'cod') {
      order.paymentStatus = 'paid';
      const cid = courierId || order.courierId || 'COU-01';
      const courier = this.getCourier(cid);
      if (courier) {
        courier.codBalanceCollected = (courier.codBalanceCollected || 0) + order.total;
        courier.totalDelivered = (courier.totalDelivered || 0) + 1;
        if (courier.activeOrdersCount > 0) courier.activeOrdersCount -= 1;
        this.store.saveState();
      }
    }
  }

  // Settle Courier Cash Balance (Turn in COD money to finance)
  settleCourierCash(courierId, amountSettled = null) {
    const courier = this.getCourier(courierId);
    if (!courier) return 0;
    const amount = amountSettled !== null ? amountSettled : courier.codBalanceCollected;
    courier.codBalanceCollected = Math.max(0, courier.codBalanceCollected - amount);
    this.store.saveState();
    return amount;
  }

  // Render Visual Tracking Timeline HTML
  renderTrackingTimelineUI(order, containerEl, currentLang = 'ar') {
    const isAr = currentLang === 'ar';
    const statusMap = {
      pending: { label: isAr ? 'تم استلام الطلب' : 'Order Received', step: 1 },
      processing: { label: isAr ? 'قيد التجهيز والتغليف' : 'Processing & Packaging', step: 2 },
      dispatched: { label: isAr ? 'خرجت من مستودع رُوح' : 'Dispatched from Hub', step: 3 },
      out_for_delivery: { label: isAr ? 'مع مندوب شحن رُوح' : 'Out for Delivery', step: 4 },
      delivered: { label: isAr ? 'تم التوصيل بنجاح' : 'Delivered Successfully', step: 5 },
      returned: { label: isAr ? 'مرتجع / مؤجل' : 'Returned / Rescheduled', step: 0 }
    };

    const currentStep = statusMap[order.status] ? statusMap[order.status].step : 2;
    const progressPercent = Math.min(100, Math.max(10, currentStep * 20));

    containerEl.innerHTML = `
      <div style="background: #FFF; border: 1px solid var(--rooh-border); border-radius: 16px; padding: 2rem; box-shadow: var(--shadow-md);">
        <!-- Tracking Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; border-bottom: 1px solid var(--rooh-sand); padding-bottom: 1.2rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem;">
              <span style="background: var(--rooh-burgundy); color: var(--rooh-gold); font-weight: 800; font-size: 0.8rem; padding: 0.2rem 0.6rem; border-radius: 4px;">
                ROOH DELIVERY
              </span>
              <strong style="font-size: 1.3rem; color: var(--rooh-burgundy-deep); font-family: monospace;">${order.id}</strong>
            </div>
            <div style="font-size: 0.85rem; color: var(--rooh-text-muted);">
              ${isAr ? `تاريخ الطلب: ${new Date(order.orderDate).toLocaleDateString('ar-EG')}` : `Date: ${new Date(order.orderDate).toLocaleDateString('en-US')}`}
            </div>
          </div>
          <div style="text-align: ${isAr ? 'left' : 'right'};">
            <span class="badge-status ${order.status}" style="font-size: 0.88rem; padding: 0.4rem 1rem;">
              ${statusMap[order.status] ? statusMap[order.status].label : order.status}
            </span>
            <div style="font-size: 0.82rem; color: var(--rooh-text-muted); margin-top: 0.4rem;">
              ${isAr ? `المحافظة: <strong>${order.governorate}</strong>` : `Governorate: <strong>${order.governorate}</strong>`}
            </div>
          </div>
        </div>

        <!-- Visual Progress Bar -->
        <div style="margin-bottom: 2rem;">
          <div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-weight: 700; color: var(--rooh-burgundy); margin-bottom: 0.6rem;">
            <span>${isAr ? 'تأكيد الطلب' : 'Placed'}</span>
            <span>${isAr ? 'التجهيز' : 'Prepared'}</span>
            <span>${isAr ? 'تم الشحن' : 'Dispatched'}</span>
            <span>${isAr ? 'جاري التوصيل' : 'On The Way'}</span>
            <span>${isAr ? 'تم الاستلام' : 'Delivered'}</span>
          </div>
          <div style="width: 100%; height: 8px; background: var(--rooh-sand); border-radius: 999px; overflow: hidden; position: relative;">
            <div style="width: ${progressPercent}%; height: 100%; background: linear-gradient(90deg, var(--rooh-gold), var(--rooh-crimson)); border-radius: 999px; transition: width 0.5s ease;"></div>
          </div>
        </div>

        <!-- Assigned Courier Card -->
        <div style="background: var(--rooh-cream); border: 1px solid var(--rooh-border-light); border-radius: 12px; padding: 1.2rem; display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.8rem; flex-wrap: wrap; gap: 1rem;">
          <div style="display: flex; align-items: center; gap: 0.85rem;">
            <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--rooh-burgundy); color: var(--rooh-gold); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.1rem; border: 1px solid var(--rooh-gold);">
              🚗
            </div>
            <div>
              <div style="font-size: 0.78rem; color: var(--rooh-text-muted); font-weight: 600;">
                ${isAr ? 'مندوب أسطول شحن رُوح المكلف:' : 'ROOH Delivery Assigned Courier:'}
              </div>
              <strong style="color: var(--rooh-burgundy-deep); font-size: 1rem;">${order.courierName || 'أحمد عبد الرحمن'}</strong>
            </div>
          </div>
          <a href="tel:${order.courierPhone || '01011223344'}" style="background: #FFF; border: 1px solid var(--rooh-sand); color: var(--rooh-burgundy); padding: 0.45rem 1rem; border-radius: 999px; font-size: 0.85rem; font-weight: 700; display: flex; align-items: center; gap: 0.4rem;">
            <span>📞</span> ${order.courierPhone || '01011223344'}
          </a>
        </div>

        <!-- Detailed Timeline Logs -->
        <h4 style="font-size: 1.05rem; color: var(--rooh-burgundy-deep); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
          <span>🕒</span> ${isAr ? 'سجل تتبع الشحنة بالتفصيل' : 'Live Tracking Events'}
        </h4>
        <div style="position: relative; padding-right: 1.5rem; border-right: 2px solid var(--rooh-gold); margin-right: 0.5rem; display: flex; flex-direction: column; gap: 1.2rem;">
          ${order.timeline.map((event, idx) => `
            <div style="position: relative;">
              <div style="position: absolute; right: -1.95rem; top: 3px; width: 12px; height: 12px; border-radius: 50%; background: ${idx === order.timeline.length - 1 ? 'var(--rooh-crimson)' : 'var(--rooh-gold)'}; border: 2px solid #FFF;"></div>
              <div style="font-size: 0.75rem; color: var(--rooh-text-muted); font-weight: 700;">${event.time}</div>
              <div style="font-size: 0.92rem; font-weight: 600; color: var(--rooh-burgundy-deep); margin-top: 0.15rem;">
                ${isAr ? event.titleAr : (event.titleEn || event.titleAr)}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

window.roohDelivery = new RoohDeliveryEngine();

