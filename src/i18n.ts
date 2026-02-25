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
