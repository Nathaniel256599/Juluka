
export enum OrderStatus {
  PENDING = 'Pending',
  CLEANING = 'Cleaning',
  READY = 'Ready',
  PICKED_UP = 'Picked Up'
}

export enum ServiceType {
  BASIC = 'Basic Clean',
  DEEP = 'Deep Clean',
  RESTORATION = 'Restoration',
  PROTECTION = 'Waterproof & Protect'
}

export enum MembershipTier {
  NONE = 'None',
  MONTHLY_BASIC = 'Monthly Basic',
  MONTHLY_UNLIMITED = 'Monthly Unlimited',
  VVIP_LIFETIME = 'VVIP Lifetime'
}

export interface Sneaker {
  id: string;
  brand: string;
  model: string;
  type: string;
  colorway: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  membership: MembershipTier;
  notes?: string;
}

export interface Order {
  id: string;
  clientId: string;
  clientName: string;
  sneakers: Sneaker[];
  dropOffDate: string;
  expectedPickupDate: string;
  actualPickupDate?: string;
  serviceType: ServiceType;
  assignedEmployee: string;
  status: OrderStatus;
  totalCost: number;
}

export interface AppState {
  orders: Order[];
  clients: Client[];
}
