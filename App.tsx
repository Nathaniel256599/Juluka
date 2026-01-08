
import React, { useState, useEffect } from 'react';
import { Order, Client, OrderStatus, MembershipTier } from './types';
import { getOrders, saveOrders, getClients, saveClients } from './lib/storage';
import Dashboard from './components/Dashboard';
import OrderForm from './components/OrderForm';
import OrderList from './components/OrderList';
import MembershipPlans from './components/MembershipPlans';
import { LayoutIcon, PlusIcon, UsersIcon, ListIcon, ShoeIcon } from './components/ui/Icons';
import { EMPLOYEES } from './constants';

type Tab = 'dashboard' | 'new-order' | 'orders' | 'clients' | 'memberships';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  // Initialize data
  useEffect(() => {
    setOrders(getOrders());
    setClients(getClients());
  }, []);

  const handleNewOrder = (order: Order, client: Client) => {
    const updatedOrders = [order, ...orders];
    const existingClientIndex = clients.findIndex(c => c.phone === client.phone);
    let updatedClients = [...clients];
    
    if (existingClientIndex === -1) {
      updatedClients = [client, ...clients];
    } else {
      // Preserve membership status if existing
      const existing = updatedClients[existingClientIndex];
      updatedClients[existingClientIndex] = { ...client, membership: existing.membership };
    }
    
    setOrders(updatedOrders);
    setClients(updatedClients);
    saveOrders(updatedOrders);
    saveClients(updatedClients);
    setActiveTab('orders');
  };

  const handleUpdateStatus = (id: string, status: OrderStatus) => {
    const updated = orders.map(o => o.id === id ? { ...o, status } : o);
    setOrders(updated);
    saveOrders(updated);
  };

  const handleUpdateClient = (updatedClient: Client) => {
    const updated = clients.map(c => c.id === updatedClient.id ? updatedClient : c);
    setClients(updated);
    saveClients(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-64 bg-white border-b md:border-r border-slate-200 p-6 flex flex-col justify-between sticky top-0 h-auto md:h-screen z-10">
        <div>
          <div className="flex flex-col items-center gap-1 mb-10 px-2 text-center">
            <div className="bg-black text-white p-3 rounded-full mb-2">
              <ShoeIcon className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter uppercase text-black font-brand">JULUKA</h1>
            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase -mt-1">Sneaker Care</p>
          </div>

          <div className="space-y-1">
            <NavItem 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')} 
              icon={<LayoutIcon />} 
              label="Overview" 
            />
            <NavItem 
              active={activeTab === 'orders'} 
              onClick={() => setActiveTab('orders')} 
              icon={<ListIcon />} 
              label="Service Pipeline" 
            />
            <NavItem 
              active={activeTab === 'new-order'} 
              onClick={() => setActiveTab('new-order')} 
              icon={<PlusIcon />} 
              label="Drop Off" 
            />
            <NavItem 
              active={activeTab === 'memberships'} 
              onClick={() => setActiveTab('memberships')} 
              icon={<ShoeIcon className="w-5 h-5" />} 
              label="Memberships" 
            />
            <NavItem 
              active={activeTab === 'clients'} 
              onClick={() => setActiveTab('clients')} 
              icon={<UsersIcon />} 
              label="Client Hub" 
            />
          </div>

          {/* On-Duty Staff List */}
          <div className="mt-10 pt-6 border-t border-slate-100 hidden md:block">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 px-2">On-Duty Techs</p>
            <div className="space-y-3 px-2">
              {EMPLOYEES.map(name => (
                <div key={name} className="flex items-center gap-2 group cursor-default">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 group-hover:animate-pulse"></div>
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-black text-xs shadow-lg shadow-black/10">JK</div>
            <div>
              <p className="text-sm font-bold text-slate-900 leading-none">Juluka Admin</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-wider">{EMPLOYEES.length} Total Staff</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-black text-black tracking-tight uppercase font-brand">
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'new-order' && 'Add New Kicks'}
              {activeTab === 'orders' && 'Job Queue'}
              {activeTab === 'clients' && 'Client Database'}
              {activeTab === 'memberships' && 'Special Packages'}
            </h2>
            <p className="text-slate-500 font-medium text-sm">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <button 
            onClick={() => setActiveTab('new-order')}
            className="hidden md:flex items-center gap-2 bg-black hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-black/10"
          >
            <PlusIcon className="w-5 h-5" />
            New Service
          </button>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'dashboard' && <Dashboard orders={orders} />}
          {activeTab === 'new-order' && <OrderForm onSave={handleNewOrder} clients={clients} />}
          {activeTab === 'orders' && <OrderList orders={orders} onUpdateStatus={handleUpdateStatus} />}
          {activeTab === 'memberships' && <MembershipPlans clients={clients} onUpdateClient={handleUpdateClient} />}
          {activeTab === 'clients' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center py-20">
              <UsersIcon className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">Manage {clients.length} Customers</h3>
              <p className="text-slate-500 max-w-sm mx-auto">Access preferences and history for JULUKA's premium client base.</p>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
                {clients.map(client => (
                  <div key={client.id} className="p-4 border border-slate-50 bg-slate-50/30 rounded-xl hover:border-black transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-black transition-colors">{client.name}</p>
                        <p className="text-xs text-slate-500">{client.phone}</p>
                      </div>
                      {client.membership !== MembershipTier.NONE && (
                        <span className="text-[8px] bg-black text-white px-1.5 py-0.5 rounded-full font-black uppercase tracking-widest">
                          {client.membership.split(' ')[0]}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-2 font-medium uppercase tracking-tighter">History: {orders.filter(o => o.clientId === client.id).length} Orders</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Persistent CTA for Mobile */}
      <button 
        onClick={() => setActiveTab('new-order')}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-black rounded-full flex items-center justify-center text-white shadow-2xl z-50 shadow-black/40"
      >
        <PlusIcon />
      </button>
    </div>
  );
};

interface NavItemProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm ${
      active 
        ? 'bg-black text-white shadow-md' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    <div className={`${active ? 'text-white' : 'text-slate-400'}`}>
      {icon}
    </div>
    {label}
  </button>
);

export default App;
