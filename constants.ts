
import { WellcashPack } from './types';

export const WELLCASH_PACKS: WellcashPack[] = [
  { id: 'pack_1', price: 999, baseWellcash: 999, bonusWellcash: 51, total: 1050 },
  { id: 'pack_2', price: 2499, baseWellcash: 2499, bonusWellcash: 201, total: 2700 },
  { id: 'pack_3', price: 4999, baseWellcash: 4999, bonusWellcash: 601, total: 5600 },
];

export const WORKOUT_TYPES = [
  'Crossfit', 'Yoga', 'Zumba', 'Strength Training', 'Swimming', 'Boxing', 'MMA', 'Pilates'
];

export const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai'];

export const PLATFORM_CONFIG = {
  DEFAULT_MARGIN_PERCENT: 20,
  CANCELLATION_WINDOW_HOURS: 4,
  MAX_BOOKINGS_PER_DAY: 2,
  MAX_BOOKINGS_PER_WEEK_PER_PARTNER: 10,
  NO_SHOW_LIMIT: 3,
  COOLDOWN_DAYS: 7,
  PURCHASE_EXPIRY_MONTHS: 12,
  BONUS_EXPIRY_MONTHS: 6,
};
