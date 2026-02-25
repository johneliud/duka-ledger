import type { Step } from 'react-joyride';

export const tourSteps: Step[] = [
  {
    target: 'body',
    content: 'Welcome to Duka Ledger! Let\'s take a quick tour to help you get started managing your shop.',
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '[data-tour="dashboard"]',
    content: 'View your shop\'s performance at a glance - today\'s sales, top products, and key metrics.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="sales"]',
    content: 'Record new sales and view your complete sales history.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="inventory"]',
    content: 'Add and manage your products, track stock levels, and set prices.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="expenses"]',
    content: 'Track all business expenses to understand your costs and profitability.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="debt"]',
    content: 'Manage customer debts and credit transactions in your debt book.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="reports"]',
    content: 'Generate detailed analytics and reports to make informed business decisions.',
    placement: 'bottom',
  },
  {
    target: 'body',
    content: 'That\'s it! You\'re ready to start. All features work offline and sync when you\'re back online.',
    placement: 'center',
  },
];

