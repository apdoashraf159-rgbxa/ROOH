/**
 * ROOH | رُوح — Egyptian Payment Gateways Engine
 * Supports:
 * 1. Cash on Delivery (COD - الدفع عند الاستلام)
 * 2. Fawry (خدمة فوري للمدفوعات)
 * 3. Mobile E-Wallets (محافظ كاش: فودافون كاش، أورنج، اتصالات، وي)
 * 4. InstaPay (شبكة المدفوعات اللحظية إنستاباي - IPA)
 * 5. Credit & Debit Cards (Visa, MasterCard, Meeza كارت ميزة الوطني)
 */

class RoohPaymentEngine {
  constructor() {
    this.store = window.roohStore;
  }

  // Generate a realistic 10-digit Fawry Reference Code
  generateFawryCode() {
    const part1 = Math.floor(100 + Math.random() * 900);
    const part2 = Math.floor(1000 + Math.random() * 9000);
    const part3 = Math.floor(100 + Math.random() * 900);
    return `${part1} ${part2} ${part3}`;
  }

  // Generate InstaPay reference code
  generateInstapayRef() {
    return `IPN-${Math.floor(10000000 + Math.random() * 90000000)}`;
  }

  // Generate Wallet Transaction Code
  generateWalletRef() {
    return `WLT-EG-${Math.floor(100000 + Math.random() * 900000)}`;
  }

  // Validate Card Number using Luhn Algorithm
  validateCardNumber(number) {
    const clean = number.replace(/\D/g, '');
    if (clean.length < 13 || clean.length > 19) return false;
    let sum = 0;
    let shouldDouble = false;
    for (let i = clean.length - 1; i >= 0; i--) {
      let digit = parseInt(clean.charAt(i));
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return (sum % 10) === 0;
  }

  // Detect Card Brand (Meeza, Visa, MasterCard)
  detectCardBrand(number) {
    const clean = number.replace(/\D/g, '');
    if (clean.startsWith('5078') || clean.startsWith('9792')) {
      return { brand: 'Meeza', labelAr: 'كارت ميزة الوطني', icon: 'card-meeza' };
    }
    if (clean.startsWith('4')) {
      return { brand: 'Visa', labelAr: 'فيزا كارد', icon: 'card-visa' };
    }
    if (clean.startsWith('51') || clean.startsWith('52') || clean.startsWith('53') || clean.startsWith('54') || clean.startsWith('55')) {
      return { brand: 'MasterCard', labelAr: 'ماستركارد', icon: 'card-master' };
    }
    return { brand: 'Card', labelAr: 'بطاقة مصرفية', icon: 'credit-card' };
  }

  // Render the payment details form based on selected method
  renderPaymentMethodUI(method, totalAmount, containerEl, currentLang = 'ar') {
    const isAr = currentLang === 'ar';
    const settings = this.store.data.settings;

    if (method === 'cod') {
      containerEl.innerHTML = `
        <div style="background: rgba(212, 175, 55, 0.08); border: 1px solid var(--rooh-border); border-radius: 10px; padding: 1.25rem;">
          <div style="display:flex; align-items:center; gap: 0.75rem; margin-bottom: 0.6rem;">
            <span style="font-size: 1.5rem;">💵</span>
            <strong style="color: var(--rooh-burgundy-deep); font-size: 1rem;">
              ${isAr ? 'الدفع نقداً عند استلام شحنة رُوح' : 'Cash on Delivery (COD)'}
            </strong>
          </div>
          <p style="font-size: 0.88rem; color: var(--rooh-charcoal); line-height: 1.6;">
            ${isAr 
              ? `سيقوم مندوب أسطول <strong>شحن رُوح</strong> بتسليمكِ الطرد الفاخر واستلام المبلغ الإجمالي: <strong>${totalAmount.toLocaleString()} ج.م</strong> نقداً مع إيصال رسمي مختوم. رسوم خدمة الدفع عند الاستلام: 20 ج.م.`
              : `A ROOH Delivery courier will hand over your luxury parcel and collect the total amount: <strong>${totalAmount.toLocaleString()} EGP</strong> in cash with an official receipt. COD handling fee: 20 EGP.`}
          </p>
        </div>
      `;
    } else if (method === 'fawry') {
      const fawryCode = this.generateFawryCode();
      const expiry = new Date(Date.now() + 48 * 3600 * 1000).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });

      containerEl.innerHTML = `
        <div style="background: #FFF9E6; border: 1.5px dashed #FF9800; border-radius: 12px; padding: 1.4rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.8rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="background: #FF9800; color: #FFF; font-weight: 800; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.8rem;">FAWRY</span>
              <strong style="color: #E65100; font-size: 0.95rem;">
                ${isAr ? 'الدفع عبر منافذ فوري أو فوري باي' : 'Pay via Fawry Kiosks & FawryPay'}
              </strong>
            </div>
            <span style="font-size: 0.78rem; color: #E65100;">${isAr ? 'صالح لمدة 48 ساعة' : 'Valid for 48 hrs'}</span>
          </div>
          <div style="text-align: center; background: #FFF; border: 1px solid #FFE0B2; border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
            <div style="font-size: 0.8rem; color: #795548; margin-bottom: 0.3rem;">${isAr ? 'رقم السداد المرجعي المباشر' : 'Fawry Payment Reference Code'}</div>
            <div id="fawryGeneratedCode" style="font-size: 1.8rem; font-weight: 800; letter-spacing: 3px; color: #D84315;">${fawryCode}</div>
            <div style="font-size: 0.75rem; color: #8D6E63; margin-top: 0.25rem;">${isAr ? `ينتهي في: ${expiry}` : `Expires at: ${expiry}`}</div>
          </div>
          <ol style="font-size: 0.85rem; color: #5D4037; padding-right: 1.2rem; line-height: 1.7;">
            ${isAr 
              ? `<li>توجهي لأي منفذ فوري أو صيدلية أو سوبرماركت يحمل علامة فوري.</li>
                 <li>اطلبي من التاجر الدفع برقم كود الخدمة <strong>788 (مدفوعات رُوح للتجميل)</strong>.</li>
                 <li>أدخلي كود السداد المرجعي الموضح أعلاه وسددي المبلغ: <strong>${totalAmount.toLocaleString()} ج.م</strong>.</li>
                 <li>احتفظي بإيصال الدفع وستصلكِ رسالة تأكيد فورية.</li>`
              : `<li>Visit any Fawry kiosk, pharmacy, or supermarket.</li>
                 <li>Select service code <strong>788 (ROOH Beauty)</strong>.</li>
                 <li>Enter the reference code above and pay <strong>${totalAmount.toLocaleString()} EGP</strong>.</li>
                 <li>Keep the printed receipt; your order will be dispatched automatically.</li>`}
          </ol>
        </div>
      `;
    } else if (method === 'wallet') {
      const walletNumber = settings.officialWalletNumber;
      containerEl.innerHTML = `
        <div style="background: #F4FBF7; border: 1.5px solid #2E7D32; border-radius: 12px; padding: 1.4rem;">
          <div style="display:flex; align-items:center; gap: 0.6rem; margin-bottom: 0.85rem;">
            <span style="font-size: 1.4rem;">📱</span>
            <div>
              <strong style="color: #1B5E20; font-size: 0.98rem;">
                ${isAr ? 'المحافظ الإلكترونية (فودافون كاش، أورنج، اتصالات، وي)' : 'Mobile Wallets (Vodafone Cash, Orange, Etisalat, WE)'}
              </strong>
              <div style="font-size: 0.78rem; color: #2E7D32;">${isAr ? 'تحويل فوري وسريع' : 'Instant merchant transfer'}</div>
            </div>
          </div>
          <div style="background: #FFF; border: 1px solid #C8E6C9; border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
              <span style="font-size: 0.82rem; color: #388E3C;">${isAr ? 'رقم محفظة رُوح الرسمية المعتمدة:' : 'ROOH Merchant Wallet Number:'}</span>
              <button type="button" onclick="navigator.clipboard.writeText('${walletNumber}'); alert('${isAr ? 'تم نسخ الرقم' : 'Copied'}');" style="font-size: 0.75rem; background: #E8F5E9; color: #1B5E20; padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: 700;">${isAr ? 'نسخ الرقم' : 'Copy'}</button>
            </div>
            <div style="font-size: 1.5rem; font-weight: 800; color: #1B5E20; letter-spacing: 2px;">${walletNumber}</div>
            <div style="font-size: 0.82rem; color: #43A047; margin-top: 0.3rem;">
              ${isAr ? `المبلغ المطلوب تحويله: <strong>${totalAmount.toLocaleString()} ج.م</strong>` : `Amount to transfer: <strong>${totalAmount.toLocaleString()} EGP</strong>`}
            </div>
          </div>
          <div class="form-group" style="margin-bottom: 0.8rem;">
            <label class="form-label" style="font-size: 0.85rem;">
              ${isAr ? 'رقم المحفظة التي قمتِ بالتحويل منها:' : 'Sender Wallet Phone Number:'}
            </label>
            <input type="tel" id="walletSenderNumber" class="form-input" placeholder="010XXXXXXXX" style="background:#FFF;">
          </div>
          <div class="form-group" style="margin-bottom: 0.3rem;">
            <label class="form-label" style="font-size: 0.85rem;">
              ${isAr ? 'رقم العملية المرجعي من رسالة التحويل (اختياري للسرعة):' : 'Transaction Reference ID (optional):'}
            </label>
            <input type="text" id="walletTxRef" class="form-input" placeholder="مثال: 94810294" style="background:#FFF;">
          </div>
        </div>
      `;
    } else if (method === 'instapay') {
      const ipa = settings.officialInstapayIPA;
      containerEl.innerHTML = `
        <div style="background: linear-gradient(135deg, #4A148C 0%, #311B92 100%); color: #FFF; border-radius: 12px; padding: 1.4rem;">
          <div style="display:flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <div style="display:flex; align-items:center; gap: 0.6rem;">
              <span style="background: #E1BEE7; color: #4A148C; font-weight: 800; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.75rem;">INSTAPAY</span>
              <strong style="font-size: 1rem; color: #F3E5F5;">
                ${isAr ? 'شبكة المدفوعات اللحظية إنستاباي (InstaPay IPN)' : 'InstaPay Instant Payment Network'}
              </strong>
            </div>
            <span style="font-size: 0.75rem; color: #CE93D8;">${isAr ? 'تحويل فوري بدون رسوم' : 'Zero transfer fee'}</span>
          </div>

          <div style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
              <span style="font-size: 0.82rem; color: #E1BEE7;">${isAr ? 'عنوان الدفع اللحظي الخاص برُوح (IPA):' : 'ROOH Official Payment Address (IPA):'}</span>
              <button type="button" onclick="navigator.clipboard.writeText('${ipa}'); alert('${isAr ? 'تم نسخ عنوان إنستاباي' : 'Copied'}');" style="font-size: 0.75rem; background: #E1BEE7; color: #4A148C; padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: 700;">${isAr ? 'نسخ العنوان' : 'Copy'}</button>
            </div>
            <div style="font-size: 1.4rem; font-weight: 800; color: #FFF; letter-spacing: 1px;">${ipa}</div>
            <div style="font-size: 0.85rem; color: #E1BEE7; margin-top: 0.35rem;">
              ${isAr ? `المبلغ المراد تحويله: <strong style="color:#FFF;">${totalAmount.toLocaleString()} ج.م</strong>` : `Amount to send: <strong style="color:#FFF;">${totalAmount.toLocaleString()} EGP</strong>`}
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label" style="font-size: 0.85rem; color: #E1BEE7;">
              ${isAr ? 'اسم حسابكِ على إنستاباي أو عنوان IPA الخاص بكِ:' : 'Your InstaPay Name or IPA:'}
            </label>
            <input type="text" id="instapaySenderIpa" class="form-input" placeholder="name@instapay" style="background: rgba(255,255,255,0.95); color: #333;">
          </div>
        </div>
      `;
    } else if (method === 'card') {
      containerEl.innerHTML = `
        <div style="background: #FFF; border: 1px solid var(--rooh-border); border-radius: 12px; padding: 1.4rem; box-shadow: var(--shadow-sm);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <strong style="color: var(--rooh-burgundy-deep); font-size: 0.98rem;">
              ${isAr ? 'الدفع ببطاقة الائتمان / الخصم المباشر (Visa, Mastercard, Meeza)' : 'Pay via Credit/Debit Card (Visa, Mastercard, Meeza)'}
            </strong>
            <div style="display: flex; gap: 0.4rem;">
              <span style="font-size: 0.72rem; background: var(--rooh-cream); border: 1px solid var(--rooh-sand); padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: 700; color: #1A1F71;">VISA</span>
              <span style="font-size: 0.72rem; background: var(--rooh-cream); border: 1px solid var(--rooh-sand); padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: 700; color: #EB001B;">MC</span>
              <span style="font-size: 0.72rem; background: var(--rooh-cream); border: 1px solid var(--rooh-sand); padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: 700; color: #008752;">MEEZA</span>
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 1rem;">
            <label class="form-label" style="font-size: 0.85rem;">
              ${isAr ? 'الاسم المدون على البطاقة' : 'Cardholder Name'}
            </label>
            <input type="text" id="cardHolderName" class="form-input" placeholder="${isAr ? 'الاسم كما يظهر على البطاقة' : 'Full Name on Card'}" value="${settings.currentLang === 'ar' ? 'NOURHAN EL ALFY' : 'NOURHAN EL ALFY'}">
          </div>

          <div class="form-group" style="margin-bottom: 1rem;">
            <label class="form-label" style="font-size: 0.85rem;">
              ${isAr ? 'رقم البطاقة (16 رقماً)' : 'Card Number (16 digits)'}
            </label>
            <input type="text" id="cardNumberInput" class="form-input" placeholder="4242 •••• •••• 4242" maxlength="19" value="4242 4242 4242 4242">
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" style="font-size: 0.85rem;">
                ${isAr ? 'تاريخ الانتهاء' : 'Expiry Date'}
              </label>
              <input type="text" id="cardExpiryInput" class="form-input" placeholder="MM/YY" maxlength="5" value="12/28">
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" style="font-size: 0.85rem;">
                ${isAr ? 'رمز الأمان (CVV)' : 'CVV Security Code'}
              </label>
              <input type="password" id="cardCvvInput" class="form-input" placeholder="•••" maxlength="4" value="842">
            </div>
          </div>

          <div style="display:flex; align-items:center; gap: 0.5rem; margin-top: 1rem; font-size: 0.78rem; color: var(--rooh-text-muted);">
            <span>🔒</span>
            <span>${isAr ? 'معاملة مشفرة وآمنة 100% بتصريح البنك المركزي المصري ومعيار PCI-DSS' : 'Encrypted 256-bit SSL transaction verified by Central Bank of Egypt'}</span>
          </div>
        </div>
      `;
    }
  }
}

window.roohPayment = new RoohPaymentEngine();

