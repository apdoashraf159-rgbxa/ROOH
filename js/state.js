/**
 * ROOH | رُوح — Premium Beauty E-Commerce Platform
 * Core State Management & Data Ecosystem
 * Currency: EGP (Egyptian Pound / ج.م)
 */

const ROOH_STORAGE_KEY = 'ROOH_ECOSYSTEM_STATE_V1';

// Initial Seed Database
const INITIAL_STATE = {
  // Brand Configuration
  settings: {
    brandNameAr: 'رُوح',
    brandNameEn: 'ROOH',
    taglineAr: 'مستحضرات تجميل وعطور فاخرة تلامس روح الجمال',
    taglineEn: 'Haute Parfumerie & Beauté — Pure Luxury Essence',
    currencyAr: 'ج.م',
    currencyEn: 'EGP',
    vatRate: 0.14, // 14% Egyptian VAT
    freeShippingThreshold: 1200, // EGP
    codFee: 20, // EGP
    currentLang: 'ar', // 'ar' or 'en'
    currentRole: 'customer', // 'admin', 'manager', 'inventory', 'support', 'courier', 'customer'
    officialInstapayIPA: 'rooh@instapay',
    officialWalletNumber: '010 2849 5931',
    supportPhone: '+20 102 849 5931',
    supportEmail: 'concierge@roohbeauty.eg',
    roohDeliveryHotline: '19842'
  },

  // Active User Profile
  currentUser: {
    id: 'USR-VIP-101',
    name: 'الأميرة نورهان الألفي',
    nameEn: 'Nourhan El-Alfy',
    email: 'nourhan.alfy@luxury.eg',
    phone: '01019842555',
    tier: 'Diamond VIP',
    avatar: 'assets/images/logo.svg',
    addresses: [
      {
        id: 'ADDR-1',
        title: 'الفيلا الرئيسية - التجمع الخامس',
        governorate: 'القاهرة',
        city: 'القاهرة الجديدة',
        details: 'كمبوند القطامية ديونز، فيلا رقم 42ب',
        isDefault: true
      },
      {
        id: 'ADDR-2',
        title: 'شاليه لوران - الإسكندرية',
        governorate: 'الإسكندرية',
        city: 'الإسكندرية',
        details: 'طريق الكورنيش، برج النورس، الطابق 14',
        isDefault: false
      }
    ]
  },

  // Staff and Employee RBAC System
  staff: [
    {
      id: 'EMP-01',
      name: 'شريف المنشاوي',
      nameEn: 'Sherif El-Menshawy',
      role: 'admin',
      roleTitleAr: 'المدير العام والرئيس التنفيذي',
      roleTitleEn: 'Super Admin & CEO',
      email: 'sherif@roohbeauty.eg',
      phone: '01001122334',
      status: 'active',
      permissions: ['all']
    },
    {
      id: 'EMP-02',
      name: 'نوران الصياد',
      nameEn: 'Nouran El-Sayad',
      role: 'manager',
      roleTitleAr: 'مديرة العمليات وسلاسل الإمداد',
      roleTitleEn: 'Operations & Supply Manager',
      email: 'nouran@roohbeauty.eg',
      phone: '01122334455',
      status: 'active',
      permissions: ['orders', 'inventory', 'shipping', 'partners', 'reports']
    },
    {
      id: 'EMP-03',
      name: 'كريم الباز',
      nameEn: 'Karim El-Baz',
      role: 'inventory',
      roleTitleAr: 'مسؤول المستودع والمخزون',
      roleTitleEn: 'Warehouse & Inventory Supervisor',
      email: 'karim.baz@roohbeauty.eg',
      phone: '01233445566',
      status: 'active',
      permissions: ['inventory', 'restock', 'suppliers']
    },
    {
      id: 'EMP-04',
      name: 'سارة عبد السلام',
      nameEn: 'Sarah Abdel-Salam',
      role: 'support',
      roleTitleAr: 'خبيرة تجميل وخدمة كبار العملاء',
      roleTitleEn: 'Senior Beauty Advisor & Support',
      email: 'sarah@roohbeauty.eg',
      phone: '01544556677',
      status: 'active',
      permissions: ['chat', 'orders_view', 'customer_care']
    },
    {
      id: 'EMP-05',
      name: 'أحمد عبد الرحمن',
      nameEn: 'Ahmed Abdelrahman',
      role: 'courier',
      roleTitleAr: 'كبير مندوبي أسطول شحن رُوح',
      roleTitleEn: 'Lead Courier - ROOH Delivery',
      email: 'ahmed.delivery@roohbeauty.eg',
      phone: '01011223344',
      status: 'active',
      courierId: 'COU-01',
      permissions: ['rooh_delivery_courier']
    }
  ],

  // ROOH Delivery — Independent Logistics Hub
  shipping: {
    companyNameAr: 'شحن رُوح | ROOH Delivery',
    companyNameEn: 'ROOH Delivery Express',
    trackingPrefix: 'ROOH-EGY-',
    governorates: [
      { id: 'cairo', nameAr: 'القاهرة', nameEn: 'Cairo', zone: 'القاهرة الكبرى', fee: 45, transitTime: 'خلال 24 ساعة', active: true },
      { id: 'giza', nameAr: 'الجيزة', nameEn: 'Giza', zone: 'القاهرة الكبرى', fee: 45, transitTime: 'خلال 24 ساعة', active: true },
      { id: 'qalyubia', nameAr: 'القليوبية', nameEn: 'Qalyubia', zone: 'القاهرة الكبرى', fee: 50, transitTime: 'خلال 24-48 ساعة', active: true },
      { id: 'alex', nameAr: 'الإسكندرية', nameEn: 'Alexandria', zone: 'الساحل الشمالي', fee: 55, transitTime: 'خلال 24-48 ساعة', active: true },
      { id: 'beheira', nameAr: 'البحيرة', nameEn: 'Beheira', zone: 'الدلتا', fee: 60, transitTime: '48 ساعة', active: true },
      { id: 'gharbia', nameAr: 'الغربية (طنطا)', nameEn: 'Gharbia (Tanta)', zone: 'الدلتا', fee: 60, transitTime: '48 ساعة', active: true },
      { id: 'dakahlia', nameAr: 'الدقهلية (المنصورة)', nameEn: 'Dakahlia (Mansoura)', zone: 'الدلتا', fee: 60, transitTime: '48 ساعة', active: true },
      { id: 'monufia', nameAr: 'المنوفية', nameEn: 'Monufia', zone: 'الدلتا', fee: 60, transitTime: '48 ساعة', active: true },
      { id: 'sharqia', nameAr: 'الشرقية (الزقازيق)', nameEn: 'Sharqia (Zagazig)', zone: 'الدلتا', fee: 60, transitTime: '48 ساعة', active: true },
      { id: 'kafr', nameAr: 'كفر الشيخ', nameEn: 'Kafr El Sheikh', zone: 'الدلتا', fee: 65, transitTime: '48 ساعة', active: true },
      { id: 'damietta', nameAr: 'دمياط', nameEn: 'Damietta', zone: 'الدلتا', fee: 65, transitTime: '48 ساعة', active: true },
      { id: 'port_said', nameAr: 'بورسعيد', nameEn: 'Port Said', zone: 'القناة', fee: 65, transitTime: '48 ساعة', active: true },
      { id: 'ismailia', nameAr: 'الإسماعيلية', nameEn: 'Ismailia', zone: 'القناة', fee: 65, transitTime: '48 ساعة', active: true },
      { id: 'suez', nameAr: 'السويس', nameEn: 'Suez', zone: 'القناة', fee: 65, transitTime: '48 ساعة', active: true },
      { id: 'fayoum', nameAr: 'الفيوم', nameEn: 'Fayoum', zone: 'شمال الصعيد', fee: 75, transitTime: '48 ساعة', active: true },
      { id: 'beni_suef', nameAr: 'بني سويف', nameEn: 'Beni Suef', zone: 'شمال الصعيد', fee: 75, transitTime: '48-72 ساعة', active: true },
      { id: 'minya', nameAr: 'المنيا', nameEn: 'Minya', zone: 'الصعيد', fee: 80, transitTime: '48-72 ساعة', active: true },
      { id: 'assiut', nameAr: 'أسيوط', nameEn: 'Assiut', zone: 'الصعيد', fee: 80, transitTime: '48-72 ساعة', active: true },
      { id: 'sohag', nameAr: 'سوهاج', nameEn: 'Sohag', zone: 'جنوب الصعيد', fee: 85, transitTime: '72 ساعة', active: true },
      { id: 'qena', nameAr: 'قنا', nameEn: 'Qena', zone: 'جنوب الصعيد', fee: 85, transitTime: '72 ساعة', active: true },
      { id: 'luxor', nameAr: 'الأقصر', nameEn: 'Luxor', zone: 'جنوب الصعيد', fee: 90, transitTime: '3-4 أيام', active: true },
      { id: 'aswan', nameAr: 'أسوان', nameEn: 'Aswan', zone: 'جنوب الصعيد', fee: 95, transitTime: '3-4 أيام', active: true },
      { id: 'red_sea', nameAr: 'البحر الأحمر والغردقة', nameEn: 'Red Sea & Hurghada', zone: 'الساحل الشرقي', fee: 100, transitTime: '3-4 أيام', active: true },
      { id: 's_sinai', nameAr: 'جنوب سيناء وشرم الشيخ', nameEn: 'South Sinai & Sharm', zone: 'سيناء', fee: 100, transitTime: '3-4 أيام', active: true },
      { id: 'matrouh', nameAr: 'مطروح والساحل الشمالي', nameEn: 'Matrouh & North Coast', zone: 'الساحل الشمالي', fee: 95, transitTime: '3-4 أيام', active: true }
    ],
    couriers: [
      {
        id: 'COU-01',
        nameAr: 'أحمد عبد الرحمن',
        nameEn: 'Ahmed Abdelrahman',
        phone: '01011223344',
        vehicleAr: 'فان مرسيدس مبردة - شحن رُوح',
        vehicleEn: 'Refrigerated ROOH Van',
        assignedZones: ['القاهرة', 'الجيزة'],
        activeOrdersCount: 6,
        totalDelivered: 412,
        rating: 4.96,
        codBalanceCollected: 6420, // EGP currently in his custody
        status: 'on_duty'
      },
      {
        id: 'COU-02',
        nameAr: 'طارق محمود',
        nameEn: 'Tarek Mahmoud',
        phone: '01122334455',
        vehicleAr: 'سيارة توزيع مكيفة - شحن رُوح',
        vehicleEn: 'Air-Conditioned Delivery Car',
        assignedZones: ['الإسكندرية', 'البحيرة'],
        activeOrdersCount: 4,
        totalDelivered: 320,
        rating: 4.88,
        codBalanceCollected: 4150,
        status: 'on_duty'
      },
      {
        id: 'COU-03',
        nameAr: 'حسام حسن',
        nameEn: 'Hossam Hassan',
        phone: '01233445566',
        vehicleAr: 'فان توزيع سريع - شحن رُوح',
        vehicleEn: 'Express ROOH Van',
        assignedZones: ['الغربية (طنطا)', 'الدقهلية (المنصورة)', 'الشرقية (الزقازيق)'],
        activeOrdersCount: 5,
        totalDelivered: 289,
        rating: 4.91,
        codBalanceCollected: 5100,
        status: 'on_duty'
      },
      {
        id: 'COU-04',
        nameAr: 'محمود الصعيدي',
        nameEn: 'Mahmoud El-Saidi',
        phone: '01544556677',
        vehicleAr: 'شاحنة نقل فاخرة ومبردة',
        vehicleEn: 'Luxury Climate-Controlled Truck',
        assignedZones: ['المنيا', 'أسيوط', 'سوهاج', 'الأقصر'],
        activeOrdersCount: 3,
        totalDelivered: 198,
        rating: 4.85,
        codBalanceCollected: 3900,
        status: 'on_duty'
      }
    ]
  },

  // Category Tree with Subcategories
  categories: [
    {
      id: 'skincare',
      nameAr: 'العناية بالبشرة',
      nameEn: 'Skincare',
      icon: 'sparkles',
      descriptionAr: 'تركيبات طبيعية نقية معززة بالذهب والورود والأحماض الحيوية لتوهج مخملي',
      descriptionEn: 'Pure natural formulas enriched with gold, roses, and bio-acids for velvet radiance',
      subcategories: [
        { id: 'facial_cleansers', nameAr: 'غسول الوجه المنقي', nameEn: 'Facial Cleansers' },
        { id: 'toners', nameAr: 'تونر توازن البشرة', nameEn: 'Toners' },
        { id: 'serums', nameAr: 'السيرومات المركزة', nameEn: 'Serums' },
        { id: 'moisturizers', nameAr: 'المرطبات الفاخرة', nameEn: 'Moisturizers' },
        { id: 'sunscreens', nameAr: 'واقيات الشمس المخملية', nameEn: 'Sunscreens' },
        { id: 'face_masks', nameAr: 'أقنعة النضارة الفورية', nameEn: 'Face Masks' },
        { id: 'exfoliators', nameAr: 'المقشرات الحريرية', nameEn: 'Exfoliators' },
        { id: 'lip_care', nameAr: 'عناية وتغذية الشفاه', nameEn: 'Lip Care' },
        { id: 'eye_care', nameAr: 'كريمات محيط العين', nameEn: 'Eye Care' }
      ]
    },
    {
      id: 'haircare',
      nameAr: 'العناية بالشعر',
      nameEn: 'Haircare',
      icon: 'feather',
      descriptionAr: 'علاجات ملكية بالكافيار والكيراتين العضوي وزيوت الأرجان المعصورة على البارد',
      descriptionEn: 'Royal treatments with caviar, botanical keratin, and cold-pressed argan oils',
      subcategories: [
        { id: 'shampoos', nameAr: 'شامبوهات خالية من السلفات', nameEn: 'Shampoos' },
        { id: 'conditioners', nameAr: 'بلسم الترطيب العميق', nameEn: 'Conditioners' },
        { id: 'hair_masks', nameAr: 'أقنعة الترميم المكثف', nameEn: 'Hair Masks' },
        { id: 'hair_oils', nameAr: 'زيوت الشعر النقية', nameEn: 'Hair Oils' },
        { id: 'hair_serums', nameAr: 'سيرومات الحماية واللمعان', nameEn: 'Hair Serums' },
        { id: 'styling_creams', nameAr: 'كريمات التصفيف المخملية', nameEn: 'Styling Creams' },
        { id: 'scalp_care', nameAr: 'عناية منبت وبصيلات الشعر', nameEn: 'Scalp Care' },
        { id: 'hair_treatments', nameAr: 'علاجات الكافيار والكيراتين', nameEn: 'Hair Treatments' }
      ]
    },
    {
      id: 'body',
      nameAr: 'العناية بالجسم',
      nameEn: 'Body Care',
      icon: 'droplets',
      descriptionAr: 'زبدة الشيا الإفريقية الخام مع أملاح البحر الميت ونفحات العود والعنبر الملكي',
      descriptionEn: 'Raw African shea butter with Dead Sea minerals and whispers of royal oud & amber',
      subcategories: [
        { id: 'shower_gels', nameAr: 'جل استحمام حريري', nameEn: 'Shower Gels' },
        { id: 'body_lotions', nameAr: 'لوشن الجسم المعطر', nameEn: 'Body Lotions' },
        { id: 'body_butters', nameAr: 'زبدة الجسم الغنية', nameEn: 'Body Butters' },
        { id: 'body_scrubs', nameAr: 'مقشرات الجسم الطبيعية', nameEn: 'Body Scrubs' },
        { id: 'hand_creams', nameAr: 'كريمات اليدين الفاخرة', nameEn: 'Hand Creams' },
        { id: 'foot_creams', nameAr: 'كريمات راحة القدمين', nameEn: 'Foot Creams' },
        { id: 'deodorants', nameAr: 'مزيلات عرق طبيعية فاخرة', nameEn: 'Deodorants' }
      ]
    },
    {
      id: 'makeup',
      nameAr: 'المكياج الفاخر',
      nameEn: 'Makeup',
      icon: 'eye',
      descriptionAr: 'ألوان صبغية غنية بملمس مخملي يدوم طويلاً، معززة بفيتامين E وحبيبات الذهب',
      descriptionEn: 'Rich velvety pigments with long-wearing comfort infused with vitamin E and gold',
      subcategories: [
        { id: 'foundations', nameAr: 'كريمات الأساس الحريرية', nameEn: 'Foundations' },
        { id: 'concealers', nameAr: 'كونسيلر التغطية المثالية', nameEn: 'Concealers' },
        { id: 'lipsticks', nameAr: 'أحمر شفاه مات ومخملي', nameEn: 'Lipsticks' },
        { id: 'mascaras', nameAr: 'ماسكارا الكثافة الحريرية', nameEn: 'Mascaras' },
        { id: 'blushes', nameAr: 'أحمر خدود متوهج', nameEn: 'Blushes' },
        { id: 'powders', nameAr: 'بودرة التثبيت الفاخرة', nameEn: 'Powders' },
        { id: 'eyeshadows', nameAr: 'باليتات ظلال العيون', nameEn: 'Eyeshadows' },
        { id: 'makeup_tools', nameAr: 'فُرش وأدوات المكياج الفاخرة', nameEn: 'Makeup Tools' }
      ]
    },
    {
      id: 'fragrances',
      nameAr: 'العطور الفاخرة',
      nameEn: 'Fragrances',
      icon: 'flame',
      descriptionAr: 'توليفات شرقية وعالمية حصرية من أندر أنواع العود والورد الطائفي والمسك الأبيض',
      descriptionEn: 'Exclusive oriental and global compositions of rare oud, Taif rose, and white musk',
      subcategories: [
        { id: 'women_perfumes', nameAr: 'عطور نسائية ملكية', nameEn: "Women's Perfumes" },
        { id: 'men_perfumes', nameAr: 'عطور رجالية فاخرة', nameEn: "Men's Perfumes" },
        { id: 'unisex_fragrances', nameAr: 'عطور راقية للجنسين', nameEn: 'Unisex Fragrances' },
        { id: 'body_mists', nameAr: 'ميست معطر للجسم والشعر', nameEn: 'Body Mists' }
      ]
    },
    {
      id: 'men',
      nameAr: 'العناية بالرجل',
      nameEn: "Men's Grooming",
      icon: 'shield',
      descriptionAr: 'روتين عناية راقٍ للرجل العصري: زيوت لحية ملكية، غسول فحم نشط وعطور كلاسيكية',
      descriptionEn: 'Refined grooming for the modern gentleman: beard oils, detox face wash & classic perfumes',
      subcategories: [
        { id: 'men_cleansers', nameAr: 'غسول الوجه بالفحم والزنك', nameEn: "Men's Cleansers" },
        { id: 'men_moisturizers', nameAr: 'مرطبات ما بعد الحلاقة', nameEn: "Men's Moisturizers" },
        { id: 'beard_oils', nameAr: 'زيوت اللحية بخشب الأرز', nameEn: 'Beard Oils' },
        { id: 'men_hair', nameAr: 'مستحضرات تصفيف شعر الرجل', nameEn: "Men's Hair Products" },
        { id: 'shaving', nameAr: 'كريمات ورغوة الحلاقة الحريرية', nameEn: 'Shaving Essentials' },
        { id: 'men_deodorants', nameAr: 'مزيلات عرق رجالية منعشة', nameEn: "Men's Deodorants" },
        { id: 'men_perfumes_grooming', nameAr: 'عطور رجالية خاصة', nameEn: "Men's Signature Scents" }
      ]
    }
  ],

  // 24 Full Catalog Products
  products: [
    {
      id: 1,
      sku: 'ROOH-SKN-001',
      nameAr: 'سيروم رويال روز — الهيالورونيك المركّز والورد الدمشقي',
      nameEn: 'Royal Rose Intensive Hyaluronic Serum',
      category: 'skincare',
      subcategory: 'serums',
      price: 850,
      originalPrice: 1100,
      costPrice: 320,
      volume: '50 مل / 1.7 أونصة',
      volumeEn: '50 ml / 1.7 fl. oz.',
      stock: 34,
      lowStockThreshold: 10,
      image: 'assets/images/product-1.svg',
      rating: 4.95,
      reviewCount: 128,
      badge: 'الأكثر مبيعاً',
      badgeEn: 'Bestseller',
      descriptionAr: 'إكسير مكثف غني بحمض الهيالورونيك متعدد الأوزان الجزيئية ومقطر الورد الجوري الدمشقي الفاخر. يروي أعماق البشرة، يشد الخطوط التعبيرية ويمنح وجهك توهجاً لؤلؤياً مخملياً يدوم طوال اليوم.',
      descriptionEn: 'An intensive elixir infused with multi-molecular hyaluronic acid and royal Damask rose distillate. Quenches skin thirst, plumps fine lines, and imparts a luminous pearl glow.',
      ingredientsAr: 'حمض الهيالورونيك النقي (3 مستويات)، ماء الورد الجوري النقي 100%، نياسيناميد 5%، ببتيدات الذهب، فيتامين B5 وخلاصة الصبار الأورجانيك.',
      ingredientsEn: 'Triple Molecular Hyaluronic Acid, 100% Pure Damask Rose Distillate, Niacinamide 5%, Gold Peptides, Provitamin B5, Organic Aloe Barbadensis.',
      howToUseAr: 'ضعي 3-4 قطرات صباحاً ومساءً على بشرة نظيفة ورطبة قليلاً، ودلكي برفق بحركات دائرية تصاعدية حتى يمتصه الجلد تماماً قبل وضع المرطب.',
      howToUseEn: 'Apply 3-4 drops morning and night to clean, damp skin. Gently massage upward until fully absorbed before your moisturizer.',
      suitabilityAr: 'مثالي لجميع أنواع البشرة، خاصة البشرة المجهدة، الجافة والحساسة.',
      suitabilityEn: 'Suitable for all skin types, especially dehydrated, fatigued, and sensitive skin.'
    },
    {
      id: 2,
      sku: 'ROOH-SKN-002',
      nameAr: 'غسول الذهب عيار 24 النقي للتنقية وإشراقة النضارة',
      nameEn: '24K Pure Gold Deep Purifying Cleanser',
      category: 'skincare',
      subcategory: 'facial_cleansers',
      price: 680,
      originalPrice: 850,
      costPrice: 240,
      volume: '150 مل',
      volumeEn: '150 ml',
      stock: 45,
      lowStockThreshold: 10,
      image: 'assets/images/product-2.svg',
      rating: 4.88,
      reviewCount: 94,
      badge: 'جديد',
      badgeEn: 'New',
      descriptionAr: 'غسول رغوي فاخر معزز برقائق الذهب عيار 24 الحقيقية ومستخلصات الشاي الأبيض. ينظف المسام بعمق من الشوائب والترسبات دون تجريد البشرة من حاجز الترطيب الطبيعي.',
      descriptionEn: 'A lavish foaming gel cleanser enriched with genuine 24K gold flakes and white tea extracts. Cleanses deeply while preserving natural lipid barrier.',
      ingredientsAr: 'رقائق الذهب عيار 24، مستخلص الشاي الأبيض العضوي، جليسيرين نباتي، ألانتوين، وحمض الهيدروكسي المهدئ.',
      ingredientsEn: '24K Gold Flakes, Organic White Tea Extract, Botanical Glycerin, Allantoin, Chamomile Hydrosol.',
      howToUseAr: 'دلكي كمية صغيرة على بشرة مبللة بحركات دائرية لطيفة حتى تتكون رغوة كريمية غنية، ثم اشطفي بالماء الفاتر.',
      howToUseEn: 'Massage a dime-sized amount onto damp face in circular motions until a rich lather forms, then rinse with lukewarm water.',
      suitabilityAr: 'مناسب للبشرة العادية، المختلطة والدهنية.',
      suitabilityEn: 'Ideal for normal, combination, and oily skin.'
    },
    {
      id: 3,
      sku: 'ROOH-SKN-003',
      nameAr: 'كريم لوميير لتجديد وتفتيح محيط العين بالريتينول المغلف',
      nameEn: 'Lumière Retinol Eye Renewal Cream',
      category: 'skincare',
      subcategory: 'eye_care',
      price: 920,
      originalPrice: 1250,
      costPrice: 380,
      volume: '30 مل',
      volumeEn: '30 ml',
      stock: 19,
      lowStockThreshold: 8,
      image: 'assets/images/product-3.svg',
      rating: 4.92,
      reviewCount: 76,
      badge: 'عضوي 100%',
      badgeEn: '100% Organic',
      descriptionAr: 'تركيبة مصممة بعناية فائقة لمنطقة محيط العين الرقيقة. تجمع بين الريتينول المغلف الدقيق والكافيين ومستخلص الطحالب البحرية لمكافحة الهالات السوداء والانتفاخ وتجاعيد زوايا العين.',
      descriptionEn: 'An exquisite eye treatment featuring micro-encapsulated retinol, caffeine, and marine algae to diminish dark circles, puffiness, and crow’s feet.',
      ingredientsAr: 'ريتينول مغلف 0.5%، كافيين نقي 3%، ببتيد Matrixyl 3000، مستخلص البابونج، زبدة الكاكاو النقية.',
      ingredientsEn: 'Micro-encapsulated Retinol 0.5%, Pure Caffeine 3%, Matrixyl 3000 Peptides, Marine Algae, Chamomile Extract.',
      howToUseAr: 'ربتي بلطف بأطراف البنصر حول عظمة محيط العين ليلاً، وتجنبي ملامسة الجفون مباشرة.',
      howToUseEn: 'Gently pat a tiny amount around the orbital bone at night using your ring finger. Avoid direct eyelid contact.',
      suitabilityAr: 'لجميع أنواع البشرة التي تعاني من الإرهاق أو الخطوط الدقيقة.',
      suitabilityEn: 'All skin types experiencing tiredness or fine expression lines.'
    },
    {
      id: 4,
      sku: 'ROOH-SKN-004',
      nameAr: 'تونر الورد الجوري والنياسيناميد المنقي للمسام',
      nameEn: 'Damask Rose & Niacinamide Balancing Toner',
      category: 'skincare',
      subcategory: 'toners',
      price: 520,
      originalPrice: 650,
      costPrice: 180,
      volume: '200 مل',
      volumeEn: '200 ml',
      stock: 52,
      lowStockThreshold: 15,
      image: 'assets/images/product-4.svg',
      rating: 4.85,
      reviewCount: 88,
      badge: 'حصري',
      badgeEn: 'Exclusive',
      descriptionAr: 'تونر نقي منعش يعيد التوازن الحمضي الطبيعي للبشرة، يقلص مظهر المسام الواسعة ويهدئ الاحمرار بفضل قوة ماء الورد الجوري الطبيعي ونسبة مدروسة من النياسيناميد.',
      descriptionEn: 'Refreshes and balances skin pH, minimizes visible pores, and calms redness with pure Damask Rose water and clarifying niacinamide.',
      ingredientsAr: 'ماء ورد طائفي نقي، نياسيناميد 4%، مستخلص شجرة الشاي المهدئ، حمض الهيالورونيك، خلاصة الخيار.',
      ingredientsEn: 'Pure Taif Rose Hydrosol, Niacinamide 4%, Witch Hazel Distillate, Botanical Hyaluronic Acid, Cucumber Fruit Extract.',
      howToUseAr: 'بللي قطنة نظيفة ومرريها بلطف على الوجه والرقبة بعد التنظيف، أو رشي مباشرة كرذاذ منعش في أي وقت.',
      howToUseEn: 'Sweep gently across face and neck with a cotton pad after cleansing, or mist directly for an instant boost.',
      suitabilityAr: 'رائع للبشرة الدهنية والمختلطة والمعرضة للمسام الواسعة.',
      suitabilityEn: 'Ideal for oily, combination, and pore-prone skin.'
    },
    {
      id: 5,
      sku: 'ROOH-SKN-005',
      nameAr: 'مرطب الحرير الملكي المخملي بحمض الببتيد والسيراميد',
      nameEn: 'Velvet Silk Peptide Day Moisturizer',
      category: 'skincare',
      subcategory: 'moisturizers',
      price: 790,
      originalPrice: 990,
      costPrice: 290,
      volume: '60 مل',
      volumeEn: '60 ml',
      stock: 28,
      lowStockThreshold: 10,
      image: 'assets/images/product-5.svg',
      rating: 4.97,
      reviewCount: 110,
      badge: 'الأكثر طلباً',
      badgeEn: 'Top Rated',
      descriptionAr: 'قوام حريري فاخر يذوب في البشرة كبتلات الزهور. غني بسيراميدات البناء الطبيعي وسداسي الببتيدات التي تحافظ على ليونة ومرونة البشرة طوال 48 ساعة.',
      descriptionEn: 'A velvety cocoon of moisture melting like flower petals. Infused with natural barrier ceramides and hexapeptides to lock in 48-hour suppleness.',
      ingredientsAr: 'سيراميد 1، 3، 6، ببتيدات الحرير الطبيعي، زبدة الكاريتيه العضوية، سكوالان الزيتون النباتي، وفيتامين E.',
      ingredientsEn: 'Ceramides NP/AP/EOP, Natural Silk Peptides, Organic Shea Butter, Olive Squalane, Tocopherol (Vitamin E).',
      howToUseAr: 'وزعي كمية بحجم حبة البازلاء على الوجه والرقبة كل صباح بعد السيروم.',
      howToUseEn: 'Smooth a pea-sized amount over face and neck every morning following your serum.',
      suitabilityAr: 'ممتاز للبشرة الجافة، العادية والمختلطة في كل الفصول.',
      suitabilityEn: 'Ideal for normal to dry and sensitive skin.'
    },
    {
      id: 6,
      sku: 'ROOH-SKN-006',
      nameAr: 'واقي الشمس الشفاف بريق اللؤلؤ SPF 50+ المقاوم للماء',
      nameEn: 'Pearl Glow Invisible SPF 50+ Sunscreen',
      category: 'skincare',
      subcategory: 'sunscreens',
      price: 640,
      originalPrice: 800,
      costPrice: 220,
      volume: '75 مل',
      volumeEn: '75 ml',
      stock: 60,
      lowStockThreshold: 15,
      image: 'assets/images/product-6.svg',
      rating: 4.90,
      reviewCount: 142,
      badge: 'حماية فائقة',
      badgeEn: 'Broad Spectrum',
      descriptionAr: 'جل واقٍ من أشعة الشمس خفيف للغاية، لا يترك أي أثر أبيض ولا يسبب لمعاناً دهنياً. يحمي من الأشعة فوق البنفسجية UVA/UVB والضوء الأزرق الصادر من الشاشات.',
      descriptionEn: 'Ultra-lightweight invisible sun shield without white cast or greasy finish. Protects against UVA/UVB and HEV blue light.',
      ingredientsAr: 'فلاتر شمسية متطورة واسعة المدى SPF 50+ PA++++، مستخلص مسحوق اللؤلؤ الطبيعي، حمض الهيالورونيك، ومضادات الأكسدة.',
      ingredientsEn: 'Modern Broad Spectrum Filters SPF 50+ PA++++, Natural Pearl Powder, Hyaluronic Acid, Centella Asiatica.',
      howToUseAr: 'ضعيه بسخاء قبل التعرض للشمس بـ 15 دقيقة كخطوة أخيرة في روتين العناية، وجددي كل ساعتين عند التعرض المباشر.',
      howToUseEn: 'Apply generously 15 minutes before sun exposure as final skincare step. Reapply every 2 hours when outdoors.',
      suitabilityAr: 'لكافة أنواع البشرة وألوانها، ومثالي كأساس للمكياج.',
      suitabilityEn: 'Universal for all skin tones and types; flawless under makeup.'
    },

    // Haircare Products (7 - 10)
    {
      id: 7,
      sku: 'ROOH-HAIR-007',
      nameAr: 'إكسير زيت الأرجان المغربي العضوي المعصور على البارد',
      nameEn: 'Cold-Pressed Moroccan Argan Miracle Oil',
      category: 'haircare',
      subcategory: 'hair_oils',
      price: 720,
      originalPrice: 950,
      costPrice: 260,
      volume: '100 مل',
      volumeEn: '100 ml',
      stock: 40,
      lowStockThreshold: 12,
      image: 'assets/images/product-7.svg',
      rating: 4.94,
      reviewCount: 115,
      badge: 'أصلي 100%',
      badgeEn: '100% Pure',
      descriptionAr: 'زيت أرجان نقي معصور على البارد من جبال أطلس المغربية. يغذي أطراف الشعر المجهدة، يمنحه لمعاناً زجاجياً مبشراً ويسيطر على التطاير والهيشان دون إثقال الخصلات.',
      descriptionEn: 'Pure cold-pressed Moroccan Argan oil from the Atlas mountains. Restores damaged ends with high-gloss mirror shine without greasiness.',
      ingredientsAr: 'زيت أرجان نقي 100%، زيت الجوجوبا الذهبي، زيت بذور الكاميليا، وفيتامين E المركز.',
      ingredientsEn: '100% Pure Argania Spinosa Kernel Oil, Golden Simmondsia Chinensis Oil, Camellia Seed Oil, Natural Vitamin E.',
      howToUseAr: 'وزعي 2-3 قطرات على راحتي يديك ومرريها على الشعر المبلل أو الجاف من منتصف الطول حتى الأطراف.',
      howToUseEn: 'Rub 2-3 drops between palms and work through damp or dry hair from mid-lengths to ends.',
      suitabilityAr: 'للشعر الجاف، التالف، المصبوغ، والمجعد.',
      suitabilityEn: 'Dry, damaged, color-treated, or frizz-prone hair.'
    },
    {
      id: 8,
      sku: 'ROOH-HAIR-008',
      nameAr: 'قناع الكافيار لإصلاح الشعر التالف والترميم الفائق',
      nameEn: 'Imperial Caviar Intensive Hair Repair Mask',
      category: 'haircare',
      subcategory: 'hair_masks',
      price: 980,
      originalPrice: 1350,
      costPrice: 390,
      volume: '250 مل',
      volumeEn: '250 ml',
      stock: 22,
      lowStockThreshold: 8,
      image: 'assets/images/product-8.svg',
      rating: 4.98,
      reviewCount: 89,
      badge: 'علاج صالونات',
      badgeEn: 'Salon Elite',
      descriptionAr: 'علاج فاخر مكثف مستوحى من طقوس العناية الملكية. مشبع بخلاصة الكافيار الأسود والبروتينات الحيوية لترميم ألياف الشعر المتضررة من الصبغات والحرارة الشديدة.',
      descriptionEn: 'An opulent restorative treatment infused with black caviar extract and bio-peptides to rebuild keratin bonds broken by heat and coloring.',
      ingredientsAr: 'مستخلص الكافيار الأسود الفرنسي، كولاجين بحري متحلل، زبدة المانجو، كيراتين نباتي، وأحماض أوميغا 3 و 6.',
      ingredientsEn: 'French Black Caviar Extract, Hydrolyzed Marine Collagen, Mango Seed Butter, Botanical Keratin, Omega 3 & 6.',
      howToUseAr: 'بعد غسل الشعر بالشامبو، وزعي القناع بسخاء واتركيه لمدة 10-15 دقيقة ثم اشطفي جيداً بالماء البارد لإغلاق المسام.',
      howToUseEn: 'After shampooing, distribute generously through lengths, leave for 10-15 minutes, then rinse with cool water.',
      suitabilityAr: 'للشعر المعالج كيميائياً، المصبوغ والشديد التلف.',
      suitabilityEn: 'Chemically treated, bleached, and severely stressed hair.'
    },
    {
      id: 9,
      sku: 'ROOH-HAIR-009',
      nameAr: 'سيروم الكيراتين النباتي المقوي ضد التقصف وحرارة التصفيف',
      nameEn: 'Botanical Keratin Anti-Breakage Serum',
      category: 'haircare',
      subcategory: 'hair_serums',
      price: 580,
      originalPrice: 750,
      costPrice: 195,
      volume: '90 مل',
      volumeEn: '90 ml',
      stock: 35,
      lowStockThreshold: 10,
      image: 'assets/images/product-9.svg',
      rating: 4.86,
      reviewCount: 67,
      badge: 'حماية حرارية',
      badgeEn: 'Heat Protectant',
      descriptionAr: 'درع وقاية متطور يحمي ألياف الشعر حتى درجة حرارة 230 مئوية. يغلف الخصلات بطبقة حريرية تمنع التقصف وتسهل تصفيف الشعر بالسيشوار أو المكواة.',
      descriptionEn: 'Advanced thermal defense shielding strands up to 230°C / 450°F. Coats fibers in a featherweight silk mantle resisting breakage.',
      ingredientsAr: 'كيراتين مستخلص من القمح وفول الصويا، بروتين الحرير، زيت المارولا النقي، وبانثينول.',
      ingredientsEn: 'Wheat & Soy Botanical Keratin, Hydrolyzed Silk, Pure Marula Oil, D-Panthenol.',
      howToUseAr: 'ضعي ضخة واحدة على الشعر الرطب قبل استخدام مجفف الشعر أو مكواة السيراميك.',
      howToUseEn: 'Apply 1 pump to damp hair before blow-drying or heat styling.',
      suitabilityAr: 'لجميع أنواع الشعر قبل التعرض للحرارة.',
      suitabilityEn: 'All hair types prior to heat styling.'
    },
    {
      id: 10,
      sku: 'ROOH-HAIR-010',
      nameAr: 'شامبو الباباسو وزبدة المانجو المنقي الخالي من السلفات',
      nameEn: 'Sulfate-Free Babassu & Mango Clarifying Shampoo',
      category: 'haircare',
      subcategory: 'shampoos',
      price: 490,
      originalPrice: 620,
      costPrice: 160,
      volume: '350 مل',
      volumeEn: '350 ml',
      stock: 58,
      lowStockThreshold: 15,
      image: 'assets/images/product-10.svg',
      rating: 4.89,
      reviewCount: 104,
      badge: 'خالٍ من السلفات',
      badgeEn: 'Sulfate-Free',
      descriptionAr: 'رغوة ناعمة مخملية تنظف فروة الرأس بعمق دون تجفيف الخصلات. خالي تماماً من السلفات والبارابين والسيليكون، ليترك الشعر منتعشاً بحجم حيوي طبيعي.',
      descriptionEn: 'A creamy sulfate-free lather that purifies the scalp while conditioning lengths with babassu oil and mango seed butter.',
      ingredientsAr: 'زيت الباباسو الأمازوني، زبدة بذور المانجو، صوديوم كوكويل إيسيثيونات اللطيف، ماء الروزماري المنشط للدورة الدموية.',
      ingredientsEn: 'Amazonian Babassu Oil, Mango Seed Butter, Gentle Coconut Cleansers, Rosemary Hydrosol.',
      howToUseAr: 'دلكي كمية وفيرة على فروة الرأس المبللة بأطراف الأصابع بحركات دائرية، ثم اشطفي بالماء الفاتر.',
      howToUseEn: 'Massage into wet scalp with fingertips in circles, working down the lengths, then rinse well.',
      suitabilityAr: 'آمن للشعر المصبوغ والمعالج بالبروتين والفلير.',
      suitabilityEn: 'Safe for color-treated, keratin-treated, and sensitive scalps.'
    },

    // Body Care Products (11 - 14)
    {
      id: 11,
      sku: 'ROOH-BODY-011',
      nameAr: 'جل استحمام العود الملكي والعنبر الحريري المعطر',
      nameEn: 'Royal Oud & Silk Amber Bath Gel',
      category: 'body',
      subcategory: 'shower_gels',
      price: 480,
      originalPrice: 600,
      costPrice: 150,
      volume: '300 مل',
      volumeEn: '300 ml',
      stock: 46,
      lowStockThreshold: 12,
      image: 'assets/images/product-11.svg',
      rating: 4.93,
      reviewCount: 82,
      badge: 'عطر يدوم 24 ساعة',
      badgeEn: '24h Scent',
      descriptionAr: 'تجربة استحمام ملكية تفوح بعبير العود الطبيعي المعتق ونفحات العنبر الدافئة. رغوة غنية تترك بشرتك ناعمة كالحرير ومعطرة لساعات طويلة.',
      descriptionEn: 'A majestic bathing experience drenched in aged oriental oud and warm golden amber. Leaves skin satin-soft and delicately perfumed.',
      ingredientsAr: 'زيت العود الكمبودي النقي، عنبر الحوت النباتي، زيت اللوز الحلو، جلسرين نقي وخلاصة العسل الملكي.',
      ingredientsEn: 'Pure Cambodian Oud Oil, Golden Amber Essence, Sweet Almond Oil, Royal Honey Extract.',
      howToUseAr: 'ضعي كمية على ليفة الاستحمام الرطبة، دلكي كامل الجسم حتى تتكون رغوة عبقة، ثم اشطفي بالماء الدافئ.',
      howToUseEn: 'Lather onto a damp sponge or loofah, massage over whole body, and rinse thoroughly.',
      suitabilityAr: 'مناسب لجميع أنواع البشرة للجنسين.',
      suitabilityEn: 'Suitable for all skin types, unisex appeal.'
    },
    {
      id: 12,
      sku: 'ROOH-BODY-012',
      nameAr: 'زبدة الجسم بالباتشولي والشيا الخام الإفريقية المخملية',
      nameEn: 'Raw Shea & Patchouli Velvet Body Butter',
      category: 'body',
      subcategory: 'body_butters',
      price: 540,
      originalPrice: 700,
      costPrice: 175,
      volume: '200 مل',
      volumeEn: '200 ml',
      stock: 32,
      lowStockThreshold: 10,
      image: 'assets/images/product-12.svg',
      rating: 4.96,
      reviewCount: 97,
      badge: 'ترطيب عميق',
      badgeEn: 'Intense Moisture',
      descriptionAr: 'قوام زبدي كثيف وغني يذوب فور ملامسته حرارة الجسم. يعالج جفاف الكوعين والركبتين الشديد ويمنح الجلد مرونة ونعومة استثنائية مع نفحات الباتشولي الأرضي الهادئ.',
      descriptionEn: 'Rich, whipped body balm melting instantly on skin contact. Banishes stubborn roughness on elbows and knees with hypnotic patchouli notes.',
      ingredientsAr: 'زبدة الشيا الغانية الخام 100%، زيت جوز الهند البكر، زيت الباتشولي الإندونيسي، زبدة الكاكاو، وفيتامين E.',
      ingredientsEn: 'Unrefined Ghanaian Shea Butter, Virgin Coconut Oil, Indonesian Patchouli Leaf Oil, Cocoa Butter, Vitamin E.',
      howToUseAr: 'دلكي بسخاء على بشرة نظيفة وجافة أو رطبة بعد الاستحمام مباشرة لحبس الرطوبة.',
      howToUseEn: 'Massage generously onto clean skin right after shower or bath to lock in deep hydration.',
      suitabilityAr: 'ممتاز للبشرة شديدة الجفاف والمتشققة.',
      suitabilityEn: 'Ideal for very dry, winter-chapped, or cracked skin.'
    },
    {
      id: 13,
      sku: 'ROOH-BODY-013',
      nameAr: 'مقشر البحر الميت بالقهوة العربية وزيت اللوز الحلو',
      nameEn: 'Dead Sea & Arabica Coffee Body Scrub',
      category: 'body',
      subcategory: 'body_scrubs',
      price: 510,
      originalPrice: 650,
      costPrice: 165,
      volume: '280 مل',
      volumeEn: '280 ml',
      stock: 29,
      lowStockThreshold: 10,
      image: 'assets/images/product-13.svg',
      rating: 4.91,
      reviewCount: 75,
      badge: 'تجديد الخلايا',
      badgeEn: 'Cell Renew',
      descriptionAr: 'مقشر طازج يجمع بين حبيبات البن العربي المحمص وأملاح البحر الميت الغنية بـ 21 معدناً نادراً. ينشط الدورة الدموية، يحارب مظهر السيلوليت ويجدد خلايا الجلد الميتة.',
      descriptionEn: 'Freshly roasted Arabica grounds blended with 21 Dead Sea minerals. Stimulates circulation, targets cellulite, and polishes away dull dead cells.',
      ingredientsAr: 'حبيبات قهوة أرابيكا محمصة ومطحونة، أملاح البحر الميت النقية، زيت اللوز الحلو، زيت القرفة المهدئ، زيت البرتقال.',
      ingredientsEn: 'Ground Arabica Coffee, Dead Sea Salt Crystals, Sweet Almond Oil, Cinnamon Leaf Oil, Sweet Orange Essential Oil.',
      howToUseAr: 'دلكي بحركات دائرية على بشرة مبللة مع التركيز على المناطق الجافة لمدة 5 دقائق، ثم اشطفي بالماء الفاتر.',
      howToUseEn: 'Massage in firm circles over damp skin focusing on thighs, elbows, and heels. Rinse with warm water.',
      suitabilityAr: 'لجميع أنواع البشرة مرتين أسبوعياً.',
      suitabilityEn: 'All skin types, recommended 2x weekly.'
    },
    {
      id: 14,
      sku: 'ROOH-BODY-014',
      nameAr: 'كريم اليدين الفاخر بزهر البرتقال وزيت بذور العنب',
      nameEn: 'Neroli Blossom Luxury Hand Treatment',
      category: 'body',
      subcategory: 'hand_creams',
      price: 360,
      originalPrice: 450,
      costPrice: 110,
      volume: '80 مل',
      volumeEn: '80 ml',
      stock: 65,
      lowStockThreshold: 15,
      image: 'assets/images/product-14.svg',
      rating: 4.88,
      reviewCount: 56,
      badge: 'امتصاص سريع',
      badgeEn: 'Fast Absorbing',
      descriptionAr: 'عناية فائقة لراحة اليدين والأظافر. تركيبة غير دهنية تمتص فوراً لترطيب البشرة وحماية الأظافر من التكسر، مع عبير زهر البرتقال المصري النقي.',
      descriptionEn: 'Quick-absorbing, non-greasy luxury hand therapy that strengthens nail beds while scenting hands with delicate Egyptian neroli blossom.',
      ingredientsAr: 'مستخلص زهر البرتقال النقي، زيت بذور العنب المضاد للأكسدة، بانثينول، زبدة الكاريتيه المخففة.',
      ingredientsEn: 'Egyptian Neroli Blossom Distillate, Grapeseed Oil, Provitamin B5, Whipped Shea, Keratin Boosters.',
      howToUseAr: 'ضعي كمية صغيرة ودلكي اليدين والأصابع وقواعد الأظافر عند الحاجة وخصوصاً قبل النوم.',
      howToUseEn: 'Massage a small amount into hands, cuticles, and wrists whenever needed, especially at bedtime.',
      suitabilityAr: 'مناسب لجميع أنواع البشرة واليدين المعرضة للماء والصابون المتكرر.',
      suitabilityEn: 'Universal hand and cuticle care.'
    },

    // Makeup Products (15 - 18)
    {
      id: 15,
      sku: 'ROOH-MKP-015',
      nameAr: 'أحمر شفاه رُوح المخملي مات — درجة رويال بورغندي (05)',
      nameEn: 'ROOH Velvet Matte Lipstick - Royal Burgundy',
      category: 'makeup',
      subcategory: 'lipsticks',
      price: 620,
      originalPrice: 780,
      costPrice: 190,
      volume: '3.8 جم',
      volumeEn: '3.8 g',
      stock: 48,
      lowStockThreshold: 12,
      image: 'assets/images/product-15.svg',
      rating: 4.97,
      reviewCount: 139,
      badge: 'اللون الأيقوني',
      badgeEn: 'Signature Shade',
      descriptionAr: 'اللون المميز لدار رُوح: لون بورغندي ملكي عميق بتمريرة واحدة فقط. تركيبة مات مخملية غنية لا تجفف الشفاه وتدوم حتى 12 ساعة بثبات مذهل.',
      descriptionEn: 'ROOH’s signature shade: deep regal burgundy in a single velvet stroke. Non-drying matte formula with comfortable 12-hour staying power.',
      ingredientsAr: 'أصباغ معدنية نقية، زبدة المانجو، زيت بذور الورد، حمض الهيالورونيك، فيتامين E.',
      ingredientsEn: 'Pure Mineral Pigments, Mango Butter, Rosehip Seed Oil, Hyaluronic Spheres, Vitamin E Acetate.',
      howToUseAr: 'مرري أحمر الشفاه مباشرة من الرصاصة بدءاً من منتصف الشفة العليا باتجاه الأطراف، ثم كرري على الشفة السفلية.',
      howToUseEn: 'Glide directly onto lips starting from cupid’s bow outward toward the corners.',
      suitabilityAr: 'ملائم لجميع ألوان البشرة لإطلالة كلاسيكية ساحرة.',
      suitabilityEn: 'Universally flattering across all skin undertones.'
    },
    {
      id: 16,
      sku: 'ROOH-MKP-016',
      nameAr: 'كريم أساس الحرير السائل بتغطية مثالية وإشراقة طبيعية',
      nameEn: 'Luminous Silk Liquid Foundation SPF 20',
      category: 'makeup',
      subcategory: 'foundations',
      price: 950,
      originalPrice: 1200,
      costPrice: 350,
      volume: '40 مل',
      volumeEn: '40 ml',
      stock: 30,
      lowStockThreshold: 10,
      image: 'assets/images/product-16.svg',
      rating: 4.91,
      reviewCount: 92,
      badge: 'تغطية بدون وزن',
      badgeEn: 'Weightless Coverage',
      descriptionAr: 'كريم أساس سائل فائق النعومة يوفر تغطية قابلة للبناء من متوسطة إلى كاملة مع لمسة نهائية متألقة كالحرير. يوحد لون البشرة ويخفي العيوب دون تكتل.',
      descriptionEn: 'Featherlight liquid silk foundation delivering medium-to-full buildable coverage with a luminous, natural skin-like finish.',
      ingredientsAr: 'بوليمرات الحرير الدقيقة، مرشحات ضوئية، حمض الهيالورونيك، فيتامين C، عامل حماية SPF 20 معدني.',
      ingredientsEn: 'Micro-Silk Polymers, Optical Light Diffusers, Hyaluronic Acid, Vitamin C Glucoside, Mineral SPF 20.',
      howToUseAr: 'رجي العبوة جيداً وضعي 1-2 ضخة على ظهر يدك ثم وزعي بفرشاة الأساس أو الإسفنجة المبللة من المركز نحو الخارج.',
      howToUseEn: 'Shake well and blend 1-2 pumps using a buffing brush or damp beauty sponge from center outward.',
      suitabilityAr: 'لجميع أنواع البشرة ويدوم حتى 16 ساعة دون أكسدة.',
      suitabilityEn: 'All skin types, 16h oxidation-resistant wear.'
    },
    {
      id: 17,
      sku: 'ROOH-MKP-017',
      nameAr: 'ماسكارا الكثافة الدرامية بألياف الحرير الطبيعي المقاومة للتلطخ',
      nameEn: 'Dramatic Silk Volume & Length Mascara',
      category: 'makeup',
      subcategory: 'mascaras',
      price: 490,
      originalPrice: 620,
      costPrice: 140,
      volume: '12 مل',
      volumeEn: '12 ml',
      stock: 50,
      lowStockThreshold: 15,
      image: 'assets/images/product-17.svg',
      rating: 4.87,
      reviewCount: 84,
      badge: 'سواد كربوني',
      badgeEn: 'Carbon Black',
      descriptionAr: 'فرشاة بتصميم الساعة الرملية المبتكر تلتقط كل رمش من الجذور حتى الأطراف. تمنحك كثافة ثلاثية الأبعاد وطولاً ساحراً كرموش الصالونات دون تكتل أو تلطخ.',
      descriptionEn: 'Hourglass bristle wand catching every individual lash for 3D extreme volume and dramatic length without flaking.',
      ingredientsAr: 'شمع النحل الطبيعي، ألياف الحرير النباتية، زيت الخروع لتقوية الرموش، صبغة الكربون الأسود الطبيعية.',
      ingredientsEn: 'Natural Cera Alba, Plant Silk Fibers, Castor Seed Oil for Lash Growth, Ultra Carbon Pigments.',
      howToUseAr: 'حركي الفرشاة بتموجات خفيفة من منبت الرموش للأعلى، وضعي طبقة ثانية لكثافة مسائية درامية.',
      howToUseEn: 'Wiggle brush from base to lash tips in a zig-zag motion. Layer for extra drama.',
      suitabilityAr: 'آمنة للعيون الحساسة ومستخدمي العدسات اللاصقة.',
      suitabilityEn: 'Ophthalmologist tested, contact lens safe.'
    },
    {
      id: 18,
      sku: 'ROOH-MKP-018',
      nameAr: 'باليت ظلال العيون كليوباترا — 12 لوناً مخملياً وذهبياً ملكياً',
      nameEn: 'Cleopatra 12-Pan Luxury Eyeshadow Palette',
      category: 'makeup',
      subcategory: 'eyeshadows',
      price: 1150,
      originalPrice: 1500,
      costPrice: 420,
      volume: '18 جم (12 لون)',
      volumeEn: '18 g (12 shades)',
      stock: 18,
      lowStockThreshold: 6,
      image: 'assets/images/product-18.svg',
      rating: 4.99,
      reviewCount: 112,
      badge: 'إصدار محدود',
      badgeEn: 'Limited Edition',
      descriptionAr: 'مستوحاة من سحر الحضارة المصرية القديمة: توليفة فاخرة من 6 درجات مات مخملية و 6 درجات ميتاليك براقة بالذهب البرونزي والبورغندي العميق. ملمس ناعم كالحرير وسهولة دمج استثنائية.',
      descriptionEn: 'Inspired by ancient royal opulence: 6 rich velvet mattes and 6 high-foil metallics in antique gold and deep burgundy.',
      ingredientsAr: 'ميكا معدنية فائقة النقاء، زيت الجوجوبا العضوي، مستخلص زهرة اللوتس المصرية، فيتامين E.',
      ingredientsEn: 'Ultra-Refined Mineral Mica, Jojoba Esters, Blue Lotus Extract, Vitamin E, Zinc Stearate.',
      howToUseAr: 'استخدمي الدرجات المات على كسرة العين والدرجات الميتاليك بالضغط بأطراف الأصابع على منتصف الجفن لبريق مذهل.',
      howToUseEn: 'Blend mattes into socket and crease; press metallics onto center lid with fingertips for maximum payoff.',
      suitabilityAr: 'لجميع ألوان العيون والمناسبات الفاخرة.',
      suitabilityEn: 'All eye colors and professional makeup artists.'
    },

    // Fragrances (19 - 22)
    {
      id: 19,
      sku: 'ROOH-PERF-019',
      nameAr: 'عطر "رُوح الشرق" — خشب الصندل والعنبر الأسود (الخلطة الخاصة)',
      nameEn: 'Rooh Al Sharq Eau de Parfum (Private Blend)',
      category: 'fragrances',
      subcategory: 'unisex_fragrances',
      price: 2450,
      originalPrice: 3100,
      costPrice: 850,
      volume: '100 مل / 3.4 أونصة',
      volumeEn: '100 ml / 3.4 fl. oz.',
      stock: 25,
      lowStockThreshold: 8,
      image: 'assets/images/product-19.svg',
      rating: 5.0,
      reviewCount: 156,
      badge: 'التحفة العطرية',
      badgeEn: 'Masterpiece',
      descriptionAr: 'الجوهرة الأبرز في دار رُوح: افتتاحية من الهيل الغواتيمالي والزعفران الإيراني النقي، يتبعها قلب عطري من خشب الصندل الميسوري والورد الدمشقي، وتستقر القاعدة على عنبر أسود معتق وفانيليا بوربون.',
      descriptionEn: 'The pinnacle of ROOH: notes of Guatemalan cardamom and pure saffron, leading to Mysore sandalwood and Bourbon vanilla amber.',
      ingredientsAr: 'كحول عطور فرنسي نقي، زيوت عطرية طبيعية مركزة 28% (Parfum Extrait)، دهن عود تراد معتق، زيت الصندل النقي.',
      ingredientsEn: 'French Perfumery Alcohol, 28% Concentrated Pure Extrait Oils, Aged Trat Oud, Mysore Sandalwood Oil.',
      howToUseAr: 'رشي على نقاط النبض: خلف الأذنين، جانبي الرقبة، المعصمين وداخل المرفقين لثبات يدوم أكثر من 36 ساعة.',
      howToUseEn: 'Mist onto pulse points: behind ears, neck base, wrists, and inner elbows for 36+ hour longevity.',
      suitabilityAr: 'عطر أرستقراطي راقٍ للجنسين يناسب السهرات والمناسبات الكبرى.',
      suitabilityEn: 'Aristocratic unisex fragrance for memorable evenings.'
    },
    {
      id: 20,
      sku: 'ROOH-PERF-020',
      nameAr: 'عطر "أميرة الزهور" — ورد الطائف والياسمين الدمشقي النسائي',
      nameEn: 'Amirat Al Zohoor - Taif Rose & Jasmine EDP',
      category: 'fragrances',
      subcategory: 'women_perfumes',
      price: 2100,
      originalPrice: 2650,
      costPrice: 720,
      volume: '100 مل',
      volumeEn: '100 ml',
      stock: 31,
      lowStockThreshold: 10,
      image: 'assets/images/product-20.svg',
      rating: 4.96,
      reviewCount: 98,
      badge: 'أنثوي ساحر',
      badgeEn: 'Feminine Icon',
      descriptionAr: 'سيمفونية زهرية مفعمة بالأنوثة والفخامة. يلتقي فيها عبير ورد الطائف النادر مع الياسمين المصري وبتلات زهر البرتقال مع لمسات ناعمة من المسك الأبيض وخشب الأرز.',
      descriptionEn: 'A breathtaking floral symphony marrying rare mountain Taif rose with Egyptian jasmine, white musk, and cedarwood.',
      ingredientsAr: 'زيت ورد الطائف المقطر، خلاصة ياسمين الصعيد، مسك أبيض بلوري، كشميران، وفانيليا مدغشقر.',
      ingredientsEn: 'Taif Rose Essence, Egyptian Jasmine Sambac Absolute, Crystal White Musk, Cashmeran, Madagascar Vanilla.',
      howToUseAr: 'رشي بعد الاستحمام على البشرة الدافئة لانتشار فواح وجذاب لا ينسى.',
      howToUseEn: 'Spray liberally over warm skin after bathing for unforgettable trail and sillage.',
      suitabilityAr: 'للمرأة الباحثة عن التميز والجاذبية الملكية.',
      suitabilityEn: 'For women seeking royal poise and magnetic elegance.'
    },
    {
      id: 21,
      sku: 'ROOH-PERF-021',
      nameAr: 'عطر "مسك الليل" للجنسين — مسك أبيض وفانيليا مدغشقر السوداء',
      nameEn: 'Misk Al Layl Obsidian Unisex Perfume',
      category: 'fragrances',
      subcategory: 'unisex_fragrances',
      price: 1850,
      originalPrice: 2300,
      costPrice: 610,
      volume: '100 مل',
      volumeEn: '100 ml',
      stock: 27,
      lowStockThreshold: 8,
      image: 'assets/images/product-21.svg',
      rating: 4.94,
      reviewCount: 89,
      badge: 'الأكثر جاذبية',
      badgeEn: 'Enchanting',
      descriptionAr: 'عطر دافئ غامض ينبض بالراحة والأناقة الهادئة. يعانق المسك الأبيض الحريري حبوب التونكا المحمصة وفصوص الفانيليا السوداء مع لمحة بلسمية من البنزوين.',
      descriptionEn: 'A warm, hypnotic aura of comfort and quiet luxury. Silky white musk embraced by roasted tonka bean and dark Madagascar vanilla.',
      ingredientsAr: 'مسك أبيض فاخر، مستخلص حبوب التونكا، فانيليا سوداء نقية، خشب الجاياك، بلسم البيرو.',
      ingredientsEn: 'Rare White Musk Accord, Roasted Tonka Bean, Dark Vanilla Caviar, Guaiac Wood, Balsam of Peru.',
      howToUseAr: 'رذاذ خفيف على الملابس والياقات ونقاط النبض يمنحك هالة مريحة وجذابة.',
      howToUseEn: 'Light mist on collars, scarves, and wrists creates an enchanting comforting cloud.',
      suitabilityAr: 'عطر مثالي للجنسين في فصلي الخريف والشتاء وأمسيات الاسترخاء.',
      suitabilityEn: 'Unisex perfection for autumn, winter, and intimate gatherings.'
    },
    {
      id: 22,
      sku: 'ROOH-PERF-022',
      nameAr: 'ميست معطر للجسم والشعر برايد فيلفيت بنفحات اللافندر والمسك',
      nameEn: 'Pride Velvet Shimmering Body & Hair Mist',
      category: 'fragrances',
      subcategory: 'body_mists',
      price: 680,
      originalPrice: 850,
      costPrice: 210,
      volume: '250 مل',
      volumeEn: '250 ml',
      stock: 44,
      lowStockThreshold: 12,
      image: 'assets/images/product-22.svg',
      rating: 4.89,
      reviewCount: 63,
      badge: 'بريق مخملي',
      badgeEn: 'Shimmering',
      descriptionAr: 'رذاذ معطر للجسم والشعر بتركيبة خفيفة خالية من الكحول المجفف، معزز ببريق ذهبي دقيق يضفي لمسة توهج حريري على البشرة وأطراف الشعر.',
      descriptionEn: 'A weightless conditioning body and hair mist infused with micro-gold radiance and French lavender pearls without drying alcohols.',
      ingredientsAr: 'ماء الصبار العضوي، زيت الأرجان القابل للذوبان، لافندر بروفانس الفرنسي، رقائق بريق الميكا الذهبية، فيتامين B5.',
      ingredientsEn: 'Organic Aloe Water, Water-Soluble Argan, French Provence Lavender, Golden Mica Shimmer, Provitamin B5.',
      howToUseAr: 'رجي العبوة لتنشيط البريق الذهبي، ورشي بسخاء على كامل الجسم والشعر من مسافة 20 سم.',
      howToUseEn: 'Shake well to activate golden shimmer particles. Spray across hair and body from 20 cm away.',
      suitabilityAr: 'آمن لجميع أنواع الشعر والبشرة، ومثالي للحفلات والشواطئ.',
      suitabilityEn: 'Safe for colored hair and sensitive body skin.'
    },

    // Men's Grooming (23 - 24)
    {
      id: 23,
      sku: 'ROOH-MEN-023',
      nameAr: 'زيت اللحية الفاخر بخشب الأرز البري ونجيل الهند للرجال',
      nameEn: 'Imperial Cedarwood & Vetiver Beard Conditioning Oil',
      category: 'men',
      subcategory: 'beard_oils',
      price: 590,
      originalPrice: 750,
      costPrice: 180,
      volume: '60 مل',
      volumeEn: '60 ml',
      stock: 36,
      lowStockThreshold: 10,
      image: 'assets/images/product-23.svg',
      rating: 4.92,
      reviewCount: 71,
      badge: 'للرجل الأنيق',
      badgeEn: 'Gentleman Choice',
      descriptionAr: 'تركيبة غنية بالزيوت العضوية الخفيفة التي تنعم شعر اللحية الخشن وترطب البشرة تحته لتمنع الحكة وقشور الجفاف، مع رائحة خشبية دخانية رجولية آسرة.',
      descriptionEn: 'A conditioning blend of cold-pressed oils softening coarse facial hair while soothing skin beneath with notes of Atlas cedar and smoky vetiver.',
      ingredientsAr: 'زيت الجوجوبا الذهبي، زيت بذور العنب، زيت خشب الأرز الأطلسي، زيت نجيل الهند الهايتي، زيت اللوز وفيتامين E.',
      ingredientsEn: 'Golden Jojoba Oil, Grapeseed Oil, Atlas Cedarwood Oil, Haitian Vetiver, Sweet Almond, Vitamin E.',
      howToUseAr: 'ضعي 3-5 قطرات في راحة يدك، دلكي اللحية من الجذور حتى الأطراف ثم مشطها بمشط خشبي.',
      howToUseEn: 'Warm 3-5 drops between palms, massage into beard and underlying skin, then comb through.',
      suitabilityAr: 'لجميع أطوال وأنواع اللحية والشارب.',
      suitabilityEn: 'All beard lengths and textures.'
    },
    {
      id: 24,
      sku: 'ROOH-MEN-024',
      nameAr: 'عطر "الفارس" الرجالي الفاخر — توباكو غواتيمالا وجلود توسكانا',
      nameEn: 'Al Faris Eau de Parfum - Tobacco & Tuscan Leather',
      category: 'men',
      subcategory: 'men_perfumes_grooming',
      price: 2200,
      originalPrice: 2800,
      costPrice: 750,
      volume: '100 مل / 3.4 أونصة',
      volumeEn: '100 ml / 3.4 fl. oz.',
      stock: 24,
      lowStockThreshold: 8,
      image: 'assets/images/product-24.svg',
      rating: 4.97,
      reviewCount: 114,
      badge: 'الهيبة والفخامة',
      badgeEn: 'Prestige & Power',
      descriptionAr: 'عطر رجالي مهيب يعكس حضور الرجل القيادي الواثق. نفحات افتتاحية من ورق التوباكو الفاخر والميرمية، يعقبها قلب من الجلود التوسكانية الفاخرة وخشب الغاياك، وقاعدة من العنبر الأسود.',
      descriptionEn: 'A commanding fragrance projecting confidence and timeless prestige: rich cured tobacco leaf, Tuscan leather, guaiac wood, and black amber.',
      ingredientsAr: 'زيوت توباكو نقية، جلود فاخرة، هيل أسود، زنجبيل طازج، باتشولي معتق، كحول فرنسي.',
      ingredientsEn: 'Cured Tobacco Absolute, Tuscan Leather Accord, Black Cardamom, Guaiac Wood, Aged Patchouli.',
      howToUseAr: 'رشتان إلى ثلاث رشات على جانبي الرقبة وأساور القميص لحضور قوي يدوم اليوم بأكمله.',
      howToUseEn: '2-3 sprays on collar and neck for all-day commanding presence.',
      suitabilityAr: 'لعشاق العطور الرجالية الفخمة والثقيلة ذات الثبات الخارق.',
      suitabilityEn: 'For gentlemen appreciating heavy, enduring sillage.'
    }
  ],

  // Active Orders (Simulated Real Orders with ROOH Delivery Tracking)
  orders: [
    {
      id: 'ROOH-EGY-98214',
      orderDate: '2026-10-30T19:30:00Z',
      customerName: 'الأميرة نورهان الألفي',
      customerPhone: '01019842555',
      governorate: 'القاهرة',
      shippingAddress: 'كمبوند القطامية ديونز، فيلا رقم 42ب، التجمع الخامس',
      paymentMethod: 'instapay', // 'cod', 'fawry', 'wallet', 'instapay', 'card'
      paymentStatus: 'paid',
      paymentRef: 'IPN-ROOH-8742910',
      status: 'out_for_delivery', // 'pending', 'processing', 'dispatched', 'out_for_delivery', 'delivered', 'returned'
      courierId: 'COU-01',
      courierName: 'أحمد عبد الرحمن',
      courierPhone: '01011223344',
      subtotal: 3300,
      vat: 462,
      shippingFee: 0, // Free over threshold
      total: 3762,
      items: [
        { productId: 19, nameAr: 'عطر "رُوح الشرق" — خشب الصندل والعنبر', price: 2450, quantity: 1, image: 'assets/images/product-19.svg' },
        { productId: 1, nameAr: 'سيروم رويال روز — الهيالورونيك المركّز', price: 850, quantity: 1, image: 'assets/images/product-1.svg' }
      ],
      timeline: [
        { time: '2026-10-30 19:30', titleAr: 'تم تسجيل الطلب وتأكيد دفع إنستاباي بنجاح', titleEn: 'Order placed & InstaPay payment confirmed' },
        { time: '2026-10-30 20:15', titleAr: 'تم تجهيز الشحنة والتغليف الفاخر بمستودع رُوح الرئيسي', titleEn: 'Packaged with luxury gift wrapping' },
        { time: '2026-10-30 21:00', titleAr: 'تم تسليم الشحنة لمندوب شحن رُوح (أحمد عبد الرحمن)', titleEn: 'Handed over to ROOH Delivery Courier' },
        { time: '2026-10-30 22:30', titleAr: 'الشحنة في طريقها للتوصيل الآن (التجمع الخامس)', titleEn: 'Out for delivery' }
      ]
    },
    {
      id: 'ROOH-EGY-98213',
      orderDate: '2026-10-30T17:10:00Z',
      customerName: 'د. ياسمين فوزي',
      customerPhone: '01149203841',
      governorate: 'الإسكندرية',
      shippingAddress: 'طريق الكورنيش، لوران، برج النورس، الطابق 14',
      paymentMethod: 'cod',
      paymentStatus: 'pending_collection',
      paymentRef: 'COD-CASH-COLLECT',
      status: 'dispatched',
      courierId: 'COU-02',
      courierName: 'طارق محمود',
      courierPhone: '01122334455',
      subtotal: 1960,
      vat: 274.4,
      shippingFee: 0,
      codFee: 20,
      total: 2254.4,
      items: [
        { productId: 8, nameAr: 'قناع الكافيار لإصلاح الشعر التالف', price: 980, quantity: 2, image: 'assets/images/product-8.svg' }
      ],
      timeline: [
        { time: '2026-10-30 17:10', titleAr: 'تم استلام الطلب بنظام الدفع عند الاستلام', titleEn: 'Order placed via Cash on Delivery' },
        { time: '2026-10-30 18:00', titleAr: 'تم تأكيد هاتفياً من فريق خدمة العملاء وتجهيز الطرد', titleEn: 'Confirmed by customer care' },
        { time: '2026-10-30 19:40', titleAr: 'خرجت الشحنة من القاهرة باتجاه مركز شحن رُوح بالإسكندرية', titleEn: 'In transit to Alexandria hub' }
      ]
    },
    {
      id: 'ROOH-EGY-98212',
      orderDate: '2026-10-29T14:20:00Z',
      customerName: 'م. طارق السعدني',
      customerPhone: '01229481726',
      governorate: 'الدقهلية (المنصورة)',
      shippingAddress: 'شارع المشاية السفلية، المنصورة، برج الجزيرة',
      paymentMethod: 'wallet',
      paymentStatus: 'paid',
      paymentRef: 'VF-CASH-7839210',
      status: 'delivered',
      courierId: 'COU-03',
      courierName: 'حسام حسن',
      courierPhone: '01233445566',
      subtotal: 2790,
      vat: 390.6,
      shippingFee: 0,
      total: 3180.6,
      items: [
        { productId: 24, nameAr: 'عطر "الفارس" الرجالي الفاخر', price: 2200, quantity: 1, image: 'assets/images/product-24.svg' },
        { productId: 23, nameAr: 'زيت اللحية الفاخر بخشب الأرز', price: 590, quantity: 1, image: 'assets/images/product-23.svg' }
      ],
      timeline: [
        { time: '2026-10-29 14:20', titleAr: 'تم تسجيل الطلب وتأكيد تحويل فودافون كاش', titleEn: 'Vodafone Cash payment verified' },
        { time: '2026-10-29 16:30', titleAr: 'تم الشحن عبر أسطول شحن رُوح الدلتا', titleEn: 'Dispatched via ROOH Delivery Delta' },
        { time: '2026-10-30 13:15', titleAr: 'تم تسليم الشحنة للعميل بنجاح واستلام التوقيع', titleEn: 'Delivered successfully with customer signature' }
      ]
    },
    {
      id: 'ROOH-EGY-98211',
      orderDate: '2026-10-29T11:00:00Z',
      customerName: 'مدام جيهان السويدي',
      customerPhone: '01099887766',
      governorate: 'الجيزة',
      shippingAddress: 'مدينة الشيخ زايد، كمبوند الياسمين، فيلا 18',
      paymentMethod: 'card',
      paymentStatus: 'paid',
      paymentRef: 'VISA-AUTH-992144',
      status: 'delivered',
      courierId: 'COU-01',
      courierName: 'أحمد عبد الرحمن',
      courierPhone: '01011223344',
      subtotal: 2360,
      vat: 330.4,
      shippingFee: 0,
      total: 2690.4,
      items: [
        { productId: 15, nameAr: 'أحمر شفاه رُوح المخملي مات — رويال بورغندي', price: 620, quantity: 2, image: 'assets/images/product-15.svg' },
        { productId: 18, nameAr: 'باليت ظلال العيون كليوباترا 12 لوناً', price: 1150, quantity: 1, image: 'assets/images/product-18.svg' }
      ],
      timeline: [
        { time: '2026-10-29 11:00', titleAr: 'تم الدفع ببطاقة فيزا الائتمانية', titleEn: 'Visa transaction successful' },
        { time: '2026-10-29 12:45', titleAr: 'تم تسليم الشحنة لمندوب شحن رُوح', titleEn: 'Assigned to Ahmed Abdelrahman' },
        { time: '2026-10-29 18:20', titleAr: 'تم التوصيل للعميلة بنجاح', titleEn: 'Package delivered' }
      ]
    }
  ],

  // Brand Partners & Supply Chain Ecosystem
  partners: [
    {
      id: 'PART-01',
      nameAr: 'مزارع الورد الطائفي الملكي',
      nameEn: 'Taif Royal Rose Farms & Distillery',
      category: 'raw_materials',
      categoryAr: 'توريد الزيوت العطرية النقية والمقطرات',
      contactPerson: 'الشيخ عبد الله القرشي',
      phone: '+966 50 123 4567',
      balanceDue: 145000, // EGP
      status: 'active',
      deliveriesCount: 18,
      contractTier: 'Strategic Partner'
    },
    {
      id: 'PART-02',
      nameAr: 'معاصر أرجان سوس أغادير التعاونية',
      nameEn: 'Agadir Pure Argan Co-op',
      category: 'raw_materials',
      categoryAr: 'توريد زيوت الأرجان المعصورة على البارد',
      contactPerson: 'فاطمة الزهراء الإدريسي',
      phone: '+212 66 987 6543',
      balanceDue: 92000,
      status: 'active',
      deliveriesCount: 14,
      contractTier: 'Certified Organic Supplier'
    },
    {
      id: 'PART-03',
      nameAr: 'مصنع كريستال الشرق للعبوات الفاخرة',
      nameEn: 'Orient Crystal Glass & Packaging Ltd.',
      category: 'packaging',
      categoryAr: 'تصنيع قوارير العطور والبرطمانات الكريستالية الفاخرة',
      contactPerson: 'م. حسام بدر الدين',
      phone: '+20 100 456 7890',
      balanceDue: 68500,
      status: 'active',
      deliveriesCount: 26,
      contractTier: 'Exclusive Packaging Partner'
    },
    {
      id: 'PART-04',
      nameAr: 'بوتيك الفصول الأربعة الفاخر — نايل بلازا',
      nameEn: 'Four Seasons Nile Plaza Luxury Boutique',
      category: 'retail_partner',
      categoryAr: 'شريك توزيع وبيع تجزئة راقٍ',
      contactPerson: 'كريستين يوسف',
      phone: '+20 2 2791 7000',
      balanceDue: -84000, // They owe ROOH 84,000 EGP for consigned inventory
      status: 'active',
      deliveriesCount: 9,
      contractTier: 'Diamond Retail Partner'
    }
  ],

  // Live Concierge Chat & Voice Notes Database
  chatMessages: [
    {
      id: 'MSG-01',
      sender: 'bot',
      authorAr: 'سارة — خبيرة التجميل برُوح',
      authorEn: 'Sarah — ROOH Beauty Advisor',
      type: 'text',
      contentAr: 'أهلاً بكِ في عالم رُوح الفاخر 🌹. كيف يمكنني مساعدة جمالكِ اليوم؟ يمكنكِ مراسلتي كتابياً أو إرسال رسالة صوتية وسأكون سعيدة بمساعدتكِ فوراً.',
      contentEn: 'Welcome to the world of ROOH 🌹. How may I assist your beauty journey today? Feel free to write or record a voice note for personalized advice.',
      time: '19:40'
    },
    {
      id: 'MSG-02',
      sender: 'user',
      authorAr: 'أنتِ',
      authorEn: 'You',
      type: 'text',
      contentAr: 'مساء الخير، أبحث عن روتين ليلي مناسب للبشرة المختلطة التي تعاني من الجفاف في فصل الشتاء.',
      contentEn: 'Good evening! Looking for a night routine suitable for combination skin with winter dryness.',
      time: '19:42'
    },
    {
      id: 'MSG-03',
      sender: 'bot',
      authorAr: 'سارة — خبيرة التجميل برُوح',
      authorEn: 'Sarah — ROOH Beauty Advisor',
      type: 'voice',
      audioDuration: '0:24',
      audioWaveform: [30, 45, 80, 65, 90, 40, 75, 95, 60, 85, 50, 70, 90, 65, 40],
      transcriptAr: 'سارة تنصحكِ: أنصحكِ بالبدء بتونر الورد الجوري لموازنة الإفرازات الدهنية، ثم وضع 3 قطرات من سيروم رويال روز الهيالورونيك، وختام الروتين بمرطب الحرير المخملي لحبس الرطوبة دون لمعان دهني.',
      transcriptEn: 'Sarah recommends starting with the Damask Rose Toner, followed by 3 drops of Royal Rose Hyaluronic Serum, locked with Velvet Silk Day Cream.',
      time: '19:43'
    }
  ],

  // Active Cart State
  cart: [
    { productId: 1, quantity: 1 },
    { productId: 15, quantity: 1 }
  ],

  // Customer Wishlist
  wishlist: [19, 8, 3]
};

// State Manager Class
class RoohStateStore {
  constructor() {
    this.data = this.loadState();
    this.listeners = [];
  }

  loadState() {
    try {
      const saved = localStorage.getItem(ROOH_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure products and settings structure are intact
        return { ...INITIAL_STATE, ...parsed };
      }
    } catch (e) {
      console.warn('Could not read state from localStorage, falling back to initial seed data.', e);
    }
    return JSON.parse(JSON.stringify(INITIAL_STATE));
  }

  saveState() {
    try {
      localStorage.setItem(ROOH_STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn('Could not save state to localStorage', e);
    }
    this.notifyListeners();
  }

  resetToDefault() {
    this.data = JSON.parse(JSON.stringify(INITIAL_STATE));
    this.saveState();
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notifyListeners() {
    this.listeners.forEach(cb => {
      try { cb(this.data); } catch (err) { console.error(err); }
    });
  }

  // --- Cart Operations ---
  addToCart(productId, quantity = 1) {
    const existing = this.data.cart.find(item => item.productId === productId);
    const prod = this.getProductById(productId);
    if (!prod) return;

    if (existing) {
      existing.quantity = Math.min(prod.stock, existing.quantity + quantity);
    } else {
      this.data.cart.push({ productId, quantity: Math.min(prod.stock, quantity) });
    }
    this.saveState();
  }

  updateCartQuantity(productId, quantity) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    const item = this.data.cart.find(i => i.productId === productId);
    const prod = this.getProductById(productId);
    if (item && prod) {
      item.quantity = Math.min(prod.stock, quantity);
      this.saveState();
    }
  }

  removeFromCart(productId) {
    this.data.cart = this.data.cart.filter(item => item.productId !== productId);
    this.saveState();
  }

  clearCart() {
    this.data.cart = [];
    this.saveState();
  }

  getCartItems() {
    return this.data.cart.map(item => {
      const product = this.getProductById(item.productId);
      return {
        ...item,
        product
      };
    }).filter(i => i.product);
  }

  getCartTotals(selectedGovernorateId = 'cairo', isCod = false) {
    const items = this.getCartItems();
    const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const vat = subtotal * this.data.settings.vatRate;
    
    // Shipping calculation via ROOH Delivery
    let shippingFee = 0;
    if (subtotal > 0 && subtotal < this.data.settings.freeShippingThreshold) {
      const gov = this.data.shipping.governorates.find(g => g.id === selectedGovernorateId);
      shippingFee = gov ? gov.fee : 45;
    }
    const codFee = (isCod && subtotal > 0) ? this.data.settings.codFee : 0;
    const total = subtotal + vat + shippingFee + codFee;

    return {
      subtotal,
      vat,
      shippingFee,
      codFee,
      total,
      itemCount: items.reduce((count, item) => count + item.quantity, 0),
      isFreeShipping: subtotal >= this.data.settings.freeShippingThreshold
    };
  }

  // --- Wishlist Operations ---
  toggleWishlist(productId) {
    const index = this.data.wishlist.indexOf(productId);
    if (index > -1) {
      this.data.wishlist.splice(index, 1);
    } else {
      this.data.wishlist.push(productId);
    }
    this.saveState();
    return this.isInWishlist(productId);
  }

  isInWishlist(productId) {
    return this.data.wishlist.includes(productId);
  }

  // --- Product Helpers ---
  getProductById(id) {
    return this.data.products.find(p => p.id === Number(id));
  }

  getProductsByCategory(catId) {
    if (!catId || catId === 'all') return this.data.products;
    return this.data.products.filter(p => p.category === catId);
  }

  searchProducts(query, category = 'all') {
    let list = this.getProductsByCategory(category);
    if (!query || !query.trim()) return list;
    const q = query.trim().toLowerCase();
    return list.filter(p => 
      p.nameAr.toLowerCase().includes(q) ||
      p.nameEn.toLowerCase().includes(q) ||
      p.descriptionAr.toLowerCase().includes(q) ||
      p.ingredientsAr.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q)
    );
  }

  // --- Order Placement ---
  createOrder(orderData) {
    const orderId = `${this.data.shipping.trackingPrefix}${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
      id: orderId,
      orderDate: new Date().toISOString(),
      status: 'processing',
      courierId: 'COU-01',
      courierName: 'أحمد عبد الرحمن',
      courierPhone: '01011223344',
      timeline: [
        {
          time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
          titleAr: 'تم تسجيل الطلب وتأكيد العملية بنجاح',
          titleEn: 'Order placed & confirmed'
        },
        {
          time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
          titleAr: 'جاري التجهيز والتغليف الفاخر بمستودع رُوح المركزي',
          titleEn: 'Being prepared & packaged with luxury wrapping'
        }
      ],
      ...orderData
    };

    // Deduct stock
    newOrder.items.forEach(item => {
      const prod = this.getProductById(item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
      }
    });

    this.data.orders.unshift(newOrder);
    this.clearCart();
    this.saveState();
    return newOrder;
  }

  // --- Admin Operations ---
  updateOrderStatus(orderId, status, note = '') {
    const order = this.data.orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      const statusLabels = {
        processing: 'قيد التجهيز بمستودع رُوح',
        dispatched: 'تم تسليمها لأسطول شحن رُوح',
        out_for_delivery: 'الشحنة مع المندوب وفي طريقها للعميل',
        delivered: 'تم التوصيل بنجاح واستلام القيمة',
        returned: 'مرتجع / تم تأجيل الموعد'
      };
      order.timeline.push({
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        titleAr: statusLabels[status] || status,
        titleEn: `Status changed to: ${status}`,
        note
      });
      this.saveState();
    }
  }

  assignCourierToOrder(orderId, courierId) {
    const order = this.data.orders.find(o => o.id === orderId);
    const courier = this.data.shipping.couriers.find(c => c.id === courierId);
    if (order && courier) {
      order.courierId = courier.id;
      order.courierName = courier.nameAr;
      order.courierPhone = courier.phone;
      order.timeline.push({
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        titleAr: `تم إسناد الشحنة لمندوب شحن رُوح: ${courier.nameAr} (${courier.phone})`,
        titleEn: `Assigned to ROOH Delivery Courier: ${courier.nameEn}`
      });
      this.saveState();
    }
  }

  saveProduct(product) {
    if (product.id) {
      // Edit
      const index = this.data.products.findIndex(p => p.id === product.id);
      if (index > -1) {
        this.data.products[index] = { ...this.data.products[index], ...product };
      }
    } else {
      // Create new
      const newId = Math.max(...this.data.products.map(p => p.id), 0) + 1;
      const newProduct = {
        id: newId,
        sku: product.sku || `ROOH-NEW-${newId.toString().padStart(3, '0')}`,
        rating: 5.0,
        reviewCount: 1,
        image: product.image || 'assets/images/product-1.svg',
        ...product
      };
      this.data.products.push(newProduct);
    }
    this.saveState();
  }

  deleteProduct(productId) {
    this.data.products = this.data.products.filter(p => p.id !== productId);
    this.saveState();
  }

  restockProduct(productId, additionalStock) {
    const prod = this.getProductById(productId);
    if (prod) {
      prod.stock += Number(additionalStock);
      this.saveState();
    }
  }

  // --- Financial Analytics Helper ---
  getFinancialSummary() {
    const orders = this.data.orders;
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;
    const completedOrders = orders.filter(o => o.status === 'delivered');
    const completedRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
    
    // Estimate cost of goods sold (COGS)
    let totalCogs = 0;
    orders.forEach(order => {
      order.items.forEach(item => {
        const prod = this.getProductById(item.productId);
        if (prod && prod.costPrice) {
          totalCogs += prod.costPrice * item.quantity;
        } else {
          totalCogs += (item.price * 0.35) * item.quantity; // estimate 35% cost
        }
      });
    });

    const grossProfit = totalRevenue - totalCogs;
    const profitMargin = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : 0;
    
    // Pending COD with couriers
    const pendingCod = orders
      .filter(o => o.paymentMethod === 'cod' && o.status !== 'delivered')
      .reduce((sum, o) => sum + o.total, 0);

    const collectedCod = this.data.shipping.couriers.reduce((sum, c) => sum + (c.codBalanceCollected || 0), 0);

    return {
      totalRevenue,
      totalOrders,
      completedOrdersCount: completedOrders.length,
      completedRevenue,
      totalCogs,
      grossProfit,
      profitMargin,
      pendingCod,
      collectedCod,
      averageOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0
    };
  }
}

// Global Store Instance
window.roohStore = new RoohStateStore();

