
import { Order, Client } from '../types';

const ORDERS_KEY = 'kickcare_orders';
const CLIENTS_KEY = 'kickcare_clients';

export const saveOrders = (orders: Order[]) => {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

export const getOrders = (): Order[] => {
  const data = localStorage.getItem(ORDERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveClients = (clients: Client[]) => {
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
};

export const getClients = (): Client[] => {
  const data = localStorage.getItem(CLIENTS_KEY);
  return data ? JSON.parse(data) : [];
};
