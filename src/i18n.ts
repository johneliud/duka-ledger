import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      'nav.dashboard': 'Dashboard',
      'nav.recordSale': 'Record Sale',
      'nav.salesHistory': 'Sales History',
      'nav.products': 'Products',
      'nav.expenses': 'Expenses',
      'nav.debtBook': 'Debt Book',
      'nav.analytics': 'Analytics',
      'nav.settings': 'Settings',
      
      'settings.title': 'Settings',
      'settings.shopInfo': 'Shop Information',
      'settings.shopName': 'Shop Name',
      'settings.inviteCode': 'Invite Code',
      'settings.inviteCodeDesc': 'Share this code with family members to invite them to your shop',
      'settings.inventorySettings': 'Inventory Settings',
      'settings.lowStockThreshold': 'Low Stock Alert Threshold',
      'settings.lowStockDesc': 'Products with stock count below',
			'settings.lowStockDesc2': 'will appear in the "Low Stock Alert" section on your dashboard. This helps you restock items before they run out.',
			'settings.profitMargin': 'Auto-Calculate Profit Margin (%)',
      'settings.profitMarginDesc': 'When enabled, the selling price will auto-calculate based on this margin. You can still manually adjust the price in the product form.',
      'settings.whatThisDoes': 'What this does:',
      'settings.userInfo': 'User Information',
      'settings.name': 'Name',
      'settings.idNumber': 'ID Number',
      'settings.role': 'Role',
      'settings.language': 'Language',
      'settings.appSettings': 'App Settings',
      'settings.restartTour': 'Restart Tour',
      'settings.restartTourDesc': 'Take the guided tour again to learn about Duka Ledger features',
      
      'tour.welcome': 'Welcome to Duka Ledger! Let\'s take a quick tour to help you get started managing your shop.',
      'tour.dashboard': 'View your shop\'s performance at a glance - today\'s sales, top products, and key metrics.',
      'tour.sales': 'Record new sales and view your complete sales history.',
      'tour.inventory': 'Add and manage your products, track stock levels, and set prices.',
      'tour.expenses': 'Track all business expenses to understand your costs and profitability.',
      'tour.debt': 'Manage customer debts and credit transactions in your debt book.',
      'tour.reports': 'Generate detailed analytics and reports to make informed business decisions.',
      'tour.complete': 'That\'s it! You\'re ready to start. All features work offline and sync when you\'re back online.',
      
      // Landing Page
      'landing.hero.title': 'Your Shop\'s Entire',
      'landing.hero.ledger': 'Ledger',
      'landing.hero.digitized': ', Digitized.',
      'landing.hero.subtitle': 'Track sales, manage inventory, and monitor debts effortlessly. Built for the market, designed to work everywhere even without internet.',
      'landing.hero.getStarted': 'Get Started for Free',
      'landing.hero.signIn': 'Sign In',
      'landing.hero.dashboard': 'Proceed to Dashboard',
      
      'landing.carousel.trackSales': 'Track Sales',
      'landing.carousel.trackSalesDesc': 'Record every transaction instantly, even offline',
      'landing.carousel.manageInventory': 'Manage Inventory',
      'landing.carousel.manageInventoryDesc': 'Monitor stock levels and get low stock alerts',
      'landing.carousel.trackExpenses': 'Track Expenses',
      'landing.carousel.trackExpensesDesc': 'Keep tabs on all business expenses in one place',
      'landing.carousel.debtBook': 'Debt Book',
      'landing.carousel.debtBookDesc': 'Manage customer credit and payment tracking',
      
      'landing.features.title': 'Built for the Modern Shop Owner',
      'landing.features.offline': 'Offline-First',
      'landing.features.offlineDesc': 'Never let a poor connection stop your business. Record sales offline and sync automatically when you\'re back online.',
      'landing.features.insights': 'Clear Insights',
      'landing.features.insightsDesc': 'Get a bird\'s-eye view of your profit, expenses, and stock levels. Make informed decisions with real-time data.',
      'landing.features.shopCentric': 'Shop Centric',
      'landing.features.shopCentricDesc': 'Invite staff to your shop. Data stays with the business, ensuring you never lose a record even if someone leaves.',
      
      // Footer
      'footer.tagline': 'Empowering small businesses with a simple, digital, and offline-first ledger for tracking sales and inventory.',
      'footer.rights': 'All rights reserved.',
    },
  },
  sw: {
    translation: {
      'nav.dashboard': 'Dashibodi',
      'nav.recordSale': 'Rekodi Mauzo',
      'nav.salesHistory': 'Historia ya Mauzo',
      'nav.products': 'Bidhaa',
      'nav.expenses': 'Matumizi',
      'nav.debtBook': 'Kitabu cha Madeni',
      'nav.analytics': 'Takwimu',
      'nav.settings': 'Mipangilio',
      
      'settings.title': 'Mipangilio',
      'settings.shopInfo': 'Taarifa za Duka',
      'settings.shopName': 'Jina la Duka',
      'settings.inviteCode': 'Msimbo wa Mwaliko',
      'settings.inviteCodeDesc': 'Shiriki msimbo huu na wanafamilia ili kuwaalika kwenye duka lako',
      'settings.inventorySettings': 'Mipangilio ya Hesabu',
      'settings.lowStockThreshold': 'Kiwango cha Tahadhari ya Bidhaa Chache',
      'settings.lowStockDesc': 'Bidhaa zenye hesabu chini ya',
			'settings.lowStockDesc2': 'zitaonekana katika sehemu ya "Tahadhari ya Bidhaa Chache" kwenye dashibodi yako. Hii inakusaidia kujaza bidhaa kabla hazijaisha.',
			'settings.profitMargin': 'Kokotoa Kiotomatiki Kiwango cha Faida (%)',
      'settings.profitMarginDesc': 'Ikishawezeshwa, bei ya kuuza itajikokotoa kiotomatiki kulingana na kiwango hiki cha faida. Bado unaweza kurekebisha bei wewe mwenyewe kwenye fomu ya bidhaa.',
      'settings.whatThisDoes': 'Hii inafanya nini:',
      'settings.userInfo': 'Taarifa za Mtumiaji',
      'settings.name': 'Jina',
      'settings.idNumber': 'Nambari ya Kitambulisho',
      'settings.role': 'Jukumu',
      'settings.language': 'Lugha',
      'settings.appSettings': 'Mipangilio ya Programu',
      'settings.restartTour': 'Anzisha Ziara Upya',
      'settings.restartTourDesc': 'Chukua ziara ya kuongozwa tena ili kujifunza kuhusu vipengele vya Duka Ledger',
      
      'tour.welcome': 'Karibu Duka Ledger! Hebu tuchukue ziara fupi kukusaidia kuanza kusimamia duka lako.',
      'tour.dashboard': 'Angalia utendaji wa duka lako kwa haraka - mauzo ya leo, bidhaa bora, na takwimu muhimu.',
      'tour.sales': 'Rekodi mauzo mapya na uangalie historia kamili ya mauzo yako.',
      'tour.inventory': 'Ongeza na usimamie bidhaa zako, fuatilia viwango vya hisa, na weka bei.',
      'tour.expenses': 'Fuatilia matumizi yote ya biashara ili kuelewa gharama na faida yako.',
      'tour.debt': 'Simamia madeni ya wateja na miamala ya mkopo katika kitabu chako cha madeni.',
      'tour.reports': 'Tengeneza takwimu na ripoti za kina ili kufanya maamuzi sahihi ya biashara.',
      'tour.complete': 'Hivyo ndivyo! Uko tayari kuanza. Vipengele vyote vinafanya kazi bila mtandao na kusawazisha unapokuwa mtandaoni tena.',
      
      // Landing Page
      'landing.hero.title': 'Kitabu Chako Chote cha',
      'landing.hero.ledger': 'Duka',
      'landing.hero.digitized': ', Kimeandikwa Kidijitali.',
      'landing.hero.subtitle': 'Fuatilia mauzo, simamia hesabu, na angalia madeni bila shida. Imejengwa kwa ajili ya soko, imeundwa kufanya kazi popote—hata bila mtandao.',
      'landing.hero.getStarted': 'Anza Bure',
      'landing.hero.signIn': 'Ingia',
      'landing.hero.dashboard': 'Endelea kwa Dashibodi',
      
      'landing.carousel.trackSales': 'Fuatilia Mauzo',
      'landing.carousel.trackSalesDesc': 'Rekodi kila muamala mara moja, hata bila mtandao',
      'landing.carousel.manageInventory': 'Simamia Hesabu',
      'landing.carousel.manageInventoryDesc': 'Angalia viwango vya hisa na upate tahadhari za bidhaa chache',
      'landing.carousel.trackExpenses': 'Fuatilia Matumizi',
      'landing.carousel.trackExpensesDesc': 'Weka macho kwenye matumizi yote ya biashara mahali pamoja',
      'landing.carousel.debtBook': 'Kitabu cha Madeni',
      'landing.carousel.debtBookDesc': 'Simamia mkopo wa wateja na ufuatiliaji wa malipo',
      
      'landing.features.title': 'Imejengwa kwa Mmiliki wa Duka wa Kisasa',
      'landing.features.offline': 'Bila Mtandao Kwanza',
      'landing.features.offlineDesc': 'Usiwahi kuruhusu muunganisho mbaya kusimamisha biashara yako. Rekodi mauzo bila mtandao na sawazisha moja kwa moja unapokuwa mtandaoni tena.',
      'landing.features.insights': 'Maarifa Wazi',
      'landing.features.insightsDesc': 'Pata mtazamo wa jumla wa faida, matumizi, na viwango vya hisa yako. Fanya maamuzi sahihi kwa data ya wakati halisi.',
      'landing.features.shopCentric': 'Duka Lenye Umuhimu',
      'landing.features.shopCentricDesc': 'Alika wafanyakazi kwenye duka lako. Data inabaki na biashara, ikihakikisha hupotezi rekodi hata kama mtu anaondoka.',
      
      // Footer
      'footer.tagline': 'Kuwezesha biashara ndogo na kifaa rahisi, cha kidijitali, na cha bila mtandao kwa ajili ya kufuatilia mauzo na hesabu.',
      'footer.rights': 'Haki zote zimehifadhiwa.',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
