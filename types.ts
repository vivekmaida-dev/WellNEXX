
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  PARTNER = 'PARTNER',
  ADMIN = 'ADMIN'
}

export enum LedgerEntryType {
  PURCHASE = 'PURCHASE',
  BONUS = 'BONUS',
  BOOKING = 'BOOKING',
  REFUND = 'REFUND',
  EXPIRY = 'EXPIRY'
}

export enum BookingStatus {
  PENDING = 'PENDING',
  ATTENDED = 'ATTENDED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  city: string;
  noShowCount: number;
  bookingCooldownUntil?: string;
  password?: string; // For mock auth
}

export interface Partner {
  id: string;
  ownerUserId: string;
  name: string;
  city: string;
  workoutTypes: string[];
  pricePerSession: number; // in Wellcash
  marginPercentage: number;
  payoutBalance: number;
  isActive: boolean;
  imageUrl?: string;
}

export interface LedgerEntry {
  id: string;
  userId: string;
  amount: number; // Positive for credit, negative for debit
  type: LedgerEntryType;
  isBonus: boolean;
  expiryDate: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  partnerId: string;
  workoutType: string;
  sessionTime: string;
  wellcashUsed: number;
  platformMargin: number;
  partnerPayout: number;
  status: BookingStatus;
  createdAt: string;
}

export interface WellcashPack {
  id: string;
  price: number; // INR
  baseWellcash: number;
  bonusWellcash: number;
  total: number;
}
