
import { 
  User, Partner, Booking, LedgerEntry, UserRole, 
  BookingStatus, LedgerEntryType 
} from '../types';
import { PLATFORM_CONFIG, CITIES, WORKOUT_TYPES } from '../constants';

const KEYS = {
  USERS: 'wellnexx_users',
  PARTNERS: 'wellnexx_partners',
  BOOKINGS: 'wellnexx_bookings',
  LEDGER: 'wellnexx_ledger',
  LOGGED_USER: 'wellnexx_auth'
};

class MockBackend {
  private users: User[] = [];
  private partners: Partner[] = [];
  private bookings: Booking[] = [];
  private ledger: LedgerEntry[] = [];

  constructor() {
    this.loadData();
    if (this.users.length === 0) this.seedData();
  }

  private loadData() {
    this.users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
    this.partners = JSON.parse(localStorage.getItem(KEYS.PARTNERS) || '[]');
    this.bookings = JSON.parse(localStorage.getItem(KEYS.BOOKINGS) || '[]');
    this.ledger = JSON.parse(localStorage.getItem(KEYS.LEDGER) || '[]');
  }

  private saveData() {
    localStorage.setItem(KEYS.USERS, JSON.stringify(this.users));
    localStorage.setItem(KEYS.PARTNERS, JSON.stringify(this.partners));
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(this.bookings));
    localStorage.setItem(KEYS.LEDGER, JSON.stringify(this.ledger));
  }

  private seedData() {
    console.log("SEEDING COMPREHENSIVE WELLNEXX MARKETPLACE...");
    
    // 1. Super Admin
    this.users.push({
      id: 'admin_1',
      name: 'Super Admin',
      email: 'admin@wellnexx.com',
      role: UserRole.ADMIN,
      city: 'Global',
      noShowCount: 0,
      password: 'admin'
    });

    // 2. Test Customer
    const testCustomer: User = {
      id: 'test_customer_1',
      name: 'Test Customer',
      email: 'test.customer@wellnexx.com',
      role: UserRole.CUSTOMER,
      city: 'Delhi',
      noShowCount: 0,
      password: 'password'
    };
    this.users.push(testCustomer);

    // 3. Mandatory Test Partner
    const testPartnerUser: User = {
      id: 'test_partner_user_1',
      name: 'Test Studio Owner',
      email: 'test.partner@wellnexx.com',
      role: UserRole.PARTNER,
      city: 'Delhi',
      noShowCount: 0,
      password: 'password'
    };
    this.users.push(testPartnerUser);

    this.partners.push({
      id: 'p_test_1',
      ownerUserId: 'test_partner_user_1',
      name: 'Elite Training Hub',
      city: 'Delhi',
      workoutTypes: ['Strength Training', 'Crossfit', 'MMA'],
      pricePerSession: 250,
      marginPercentage: 20,
      payoutBalance: 0,
      isActive: true,
      imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop'
    });

    // 4. Generate Studios for EVERY CITY and EVERY WORKOUT TYPE
    const studioPrefixes = ["Pulse", "Iron", "Zen", "Titan", "Flow", "Apex", "Grit", "Soul", "Peak", "Core", "Forge", "Vibe"];
    let partnerIdCounter = 2;
    let userIdCounter = 3;

    CITIES.forEach((city) => {
      WORKOUT_TYPES.forEach((type) => {
        const prefix = studioPrefixes[Math.floor(Math.random() * studioPrefixes.length)];
        const studioName = `${prefix} ${type} ${city}`;
        const ownerEmail = `partner.${partnerIdCounter}@wellnexx.com`;
        const ownerId = `u_p_${userIdCounter++}`;
        const partnerId = `p_${partnerIdCounter++}`;

        this.users.push({
          id: ownerId,
          name: `${studioName} Manager`,
          email: ownerEmail,
          role: UserRole.PARTNER,
          city: city,
          noShowCount: 0,
          password: 'password'
        });

        this.partners.push({
          id: partnerId,
          ownerUserId: ownerId,
          name: studioName,
          city: city,
          workoutTypes: [type],
          pricePerSession: 150 + (Math.floor(Math.random() * 5) * 50),
          marginPercentage: 20,
          payoutBalance: 0,
          isActive: true,
          imageUrl: `https://images.unsplash.com/photo-${1534438327276 + (partnerIdCounter % 100)}?q=80&w=1000&auto=format&fit=crop`
        });
      });
    });

    this.addLedgerEntry(testCustomer.id, 5000, LedgerEntryType.PURCHASE, false);

    this.saveData();
  }

  login(email: string, password?: string, partnerId?: string) {
    let user;
    if (partnerId) {
      const partner = this.partners.find(p => p.id === partnerId);
      if (!partner) throw new Error('Invalid Partner ID');
      user = this.users.find(u => u.id === partner.ownerUserId);
    } else {
      user = this.users.find(u => u.email === email);
    }
    if (!user || user.password !== password) throw new Error('Invalid credentials');
    return user;
  }

  signup(name: string, email: string, city: string, role: UserRole) {
    if (this.users.find(u => u.email === email)) throw new Error('Email already registered');
    const newUser: User = {
      id: `user_${Date.now()}`,
      name, email, city, role,
      noShowCount: 0,
      password: 'password'
    };
    this.users.push(newUser);
    this.saveData();
    return newUser;
  }

  createPartner(partnerData: { name: string; city: string; pricePerSession: number; workoutTypes: string[] }, ownerData: { name: string; email: string }) {
    if (this.users.find(u => u.email === ownerData.email)) throw new Error('Owner email already registered');
    
    const ownerId = `u_p_${Date.now()}`;
    const newUser: User = {
      id: ownerId,
      name: ownerData.name,
      email: ownerData.email,
      role: UserRole.PARTNER,
      city: partnerData.city,
      noShowCount: 0,
      password: 'password'
    };
    this.users.push(newUser);

    const partnerId = `p_${Date.now()}`;
    const newPartner: Partner = {
      id: partnerId,
      ownerUserId: ownerId,
      name: partnerData.name,
      city: partnerData.city,
      workoutTypes: partnerData.workoutTypes,
      pricePerSession: partnerData.pricePerSession,
      marginPercentage: PLATFORM_CONFIG.DEFAULT_MARGIN_PERCENT,
      payoutBalance: 0,
      isActive: true,
      imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop'
    };
    this.partners.push(newPartner);
    this.saveData();
    return newPartner;
  }

  addLedgerEntry(userId: string, amount: number, type: LedgerEntryType, isBonus: boolean) {
    const months = isBonus ? PLATFORM_CONFIG.BONUS_EXPIRY_MONTHS : PLATFORM_CONFIG.PURCHASE_EXPIRY_MONTHS;
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + months);

    const entry: LedgerEntry = {
      id: `led_${Date.now()}_${Math.random()}`,
      userId, amount, type, isBonus,
      expiryDate: expiry.toISOString(),
      createdAt: new Date().toISOString()
    };
    this.ledger.push(entry);
    this.saveData();
  }

  getUserBalance(userId: string) {
    const now = new Date();
    const userLedger = this.ledger.filter(l => l.userId === userId);
    const credits = userLedger.filter(l => l.amount > 0 && new Date(l.expiryDate) > now);
    const debits = userLedger.filter(l => l.amount < 0);
    const totalCredit = credits.reduce((sum, l) => sum + l.amount, 0);
    const totalDebit = Math.abs(debits.reduce((sum, l) => sum + l.amount, 0));
    const balance = totalCredit - totalDebit;
    const bonusBalance = credits.filter(c => c.isBonus).reduce((sum, l) => sum + l.amount, 0);
    return { 
      total: balance > 0 ? balance : 0, 
      bonus: Math.min(balance > 0 ? balance : 0, bonusBalance)
    };
  }

  createBooking(userId: string, partnerId: string, workoutType: string, sessionTime: string) {
    const user = this.users.find(u => u.id === userId);
    const partner = this.partners.find(p => p.id === partnerId);
    if (!user || !partner) throw new Error('Invalid user or partner');

    const balance = this.getUserBalance(userId);
    if (balance.total < partner.pricePerSession) throw new Error('Insufficient Wellcash balance');

    const margin = Math.floor((partner.pricePerSession * partner.marginPercentage) / 100);
    const payout = partner.pricePerSession - margin;

    const booking: Booking = {
      id: `book_${Date.now()}`,
      userId, partnerId, workoutType, sessionTime,
      wellcashUsed: partner.pricePerSession,
      platformMargin: margin, partnerPayout: payout,
      status: BookingStatus.PENDING,
      createdAt: new Date().toISOString()
    };

    this.bookings.push(booking);
    this.addLedgerEntry(userId, -partner.pricePerSession, LedgerEntryType.BOOKING, false);
    this.saveData();
    return booking;
  }

  updateBookingStatus(bookingId: string, status: BookingStatus) {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (!booking) throw new Error('Booking not found');
    booking.status = status;
    if (status === BookingStatus.ATTENDED) {
      const partner = this.partners.find(p => p.id === booking.partnerId);
      if (partner) partner.payoutBalance += booking.partnerPayout;
    }
    this.saveData();
  }

  getUserBookings(userId: string) { return this.bookings.filter(b => b.userId === userId).sort((a,b) => b.createdAt.localeCompare(a.createdAt)); }
  getPartnerBookings(partnerId: string) { return this.bookings.filter(b => b.partnerId === partnerId).sort((a,b) => b.createdAt.localeCompare(a.createdAt)); }
  getAllPartners() { return this.partners.filter(p => p.isActive); }
  getPartnerById(id: string) { return this.partners.find(p => p.id === id); }
  getPartnerByOwnerId(ownerId: string) { return this.partners.find(p => p.ownerUserId === ownerId); }
  getAllUsers() { return this.users; }
  getAllBookings() { return this.bookings; }
  getDashboardStats() {
    const gmv = this.bookings.reduce((sum, b) => sum + b.wellcashUsed, 0);
    const revenue = this.bookings.reduce((sum, b) => sum + b.platformMargin, 0);
    const activeUsers = this.users.filter(u => u.role === UserRole.CUSTOMER).length;
    const activePartners = this.partners.filter(p => p.isActive).length;
    return { gmv, revenue, activeUsers, activePartners };
  }
}

export const backend = new MockBackend();
