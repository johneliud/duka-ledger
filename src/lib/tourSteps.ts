import type { Step } from 'react-joyride';
import i18n from '../i18n';

export const getTourSteps = (): Step[] => [
  {
    target: 'body',
    content: i18n.t('tour.welcome'),
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '[data-tour="dashboard"]',
    content: i18n.t('tour.dashboard'),
    placement: 'bottom',
  },
  {
    target: '[data-tour="sales"]',
    content: i18n.t('tour.sales'),
    placement: 'bottom',
  },
  {
    target: '[data-tour="inventory"]',
    content: i18n.t('tour.inventory'),
    placement: 'bottom',
  },
  {
    target: '[data-tour="expenses"]',
    content: i18n.t('tour.expenses'),
    placement: 'bottom',
  },
  {
    target: '[data-tour="debt"]',
    content: i18n.t('tour.debt'),
    placement: 'bottom',
  },
  {
    target: '[data-tour="reports"]',
    content: i18n.t('tour.reports'),
    placement: 'bottom',
  },
  {
    target: 'body',
    content: i18n.t('tour.complete'),
    placement: 'center',
  },
];

