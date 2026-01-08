
import React, { useState, useEffect } from 'react';
import { Order, Client, Sneaker, ServiceType, OrderStatus, MembershipTier } from '../types';
import { EMPLOYEES, SNEAKER_BRANDS, PRICING } from '../constants';

interface OrderFormProps {
  onSave: (order: Order, client: Client) => void;
  clients: Client[];
}

const OrderForm: React.FC<OrderFormProps> = ({ onSave, clients }) => {
  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [sneakers, setSneakers] = useState<Partial<Sneaker>[]>([{ brand: '', model: '', type: '', colorway: '' }]);
  const [service, setService] = useState<ServiceType>(ServiceType.BASIC);
  const [assignedEmployee, setAssignedEmployee] = useState(EMPLOYEES[0]);
  const [pickupDate, setPickupDate] = useState('');
  const [existingClient, setExistingClient] = useState<Client | null>(null);

  useEffect(() => {
    const found = clients.find(c => c.phone === phone);
    if (found) {
      setClientName(found.name);
      setEmail(found.email);
      setExistingClient(found);
    } else {
      setExistingClient(null);
    }
  }, [phone, clients]);

  const addSneaker = () => {
    setSneakers([...sneakers, { brand: '', model: '', type: '', colorway: '' }]);
  };

  const removeSneaker = (index: number) => {
    setSneakers(sneakers.filter((_, i) => i !== index));
  };

  const updateSneaker = (index: number, field: keyof Sneaker, value: string) => {
    const newSneakers = [...sneakers];
    newSneakers[index] = { ...newSneakers[index], [field]: value };
    setSneakers(newSneakers);
  };

  const calculateTotal = () => {
    // If client is a member, the per-order fee is waived (pre-paid)
    if (existingClient && existingClient.membership !== MembershipTier.NONE) {
      return 0;
    }
    const count = sneakers.length;
    if (count >= PRICING.BULK_THRESHOLD) {
      return count * PRICING.BULK_RATE;
    }
    return count * PRICING.STANDARD_RATE;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const clientId = existingClient ? existingClient.id : Math.random().toString(36).substr(2, 9);
    const client: Client = {
      id: clientId,
      name: clientName,
      phone,
      email,
      membership: existingClient ? existingClient.membership : MembershipTier.NONE
    };

    const order: Order = {
      id: `JK-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      clientId,
      clientName,
      sneakers: sneakers.map(s => ({ ...s, id: Math.random().toString(36).substr(2, 5) } as Sneaker)),
      dropOffDate: new Date().toISOString(),
      expectedPickupDate: pickupDate,
      serviceType: service,
      assignedEmployee,
      status: OrderStatus.PENDING,
      totalCost: calculateTotal()
    };

    onSave(order, client);
  };

  const isMember = existingClient && existingClient.membership !== MembershipTier.NONE;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-black text-black uppercase tracking-tight font-brand">New Drop Off</h2>
          {isMember && (
            <div className="inline-block mt-2 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full">
              {existingClient?.membership} Active
            </div>
          )}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Client Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Phone</label>
            <input 
              required
              type="tel" 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all" 
              placeholder="070-000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Client Name</label>
            <input 
              required
              type="text" 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all" 
              placeholder="e.g. John Doe"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Pickup Date</label>
            <input 
              required
              type="date" 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
            />
          </div>
        </div>

        {/* Sneaker List */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Sneaker Details</h3>
            <button 
              type="button" 
              onClick={addSneaker}
              className="text-xs px-4 py-2 bg-black text-white rounded-full font-bold hover:bg-slate-800 transition-all uppercase tracking-widest"
            >
              + Add Pair
            </button>
          </div>
          
          <div className="space-y-4">
            {sneakers.map((sneaker, index) => (
              <div key={index} className="p-5 border border-slate-100 rounded-2xl bg-slate-50/50 relative group">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Brand</label>
                    <select 
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm"
                      value={sneaker.brand}
                      onChange={(e) => updateSneaker(index, 'brand', e.target.value)}
                    >
                      <option value="">Select Brand</option>
                      {SNEAKER_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Model</label>
                    <input 
                      type="text" 
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm" 
                      placeholder="e.g. AJ1 High"
                      value={sneaker.model}
                      onChange={(e) => updateSneaker(index, 'model', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Type</label>
                    <input 
                      type="text" 
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm" 
                      placeholder="e.g. Suede/Leather"
                      value={sneaker.type}
                      onChange={(e) => updateSneaker(index, 'type', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Colorway</label>
                    <input 
                      type="text" 
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm" 
                      placeholder="e.g. Chicago"
                      value={sneaker.colorway}
                      onChange={(e) => updateSneaker(index, 'colorway', e.target.value)}
                    />
                  </div>
                </div>
                {sneakers.length > 1 && (
                  <button 
                    type="button"
                    onClick={() => removeSneaker(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Service Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8 border-t border-slate-100">
          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Service Plan</label>
              <select 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                value={service}
                onChange={(e) => setService(e.target.value as ServiceType)}
              >
                {Object.values(ServiceType).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">JULUKA Technician</label>
              <select 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                value={assignedEmployee}
                onChange={(e) => setAssignedEmployee(e.target.value)}
              >
                {EMPLOYEES.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="bg-black text-white p-8 rounded-3xl flex flex-col justify-between shadow-2xl shadow-black/20">
            <div>
              <p className="text-slate-400 text-[10px] mb-1 uppercase tracking-[0.2em] font-black">Price Summary</p>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-black">${calculateTotal().toFixed(2)}</span>
                <span className="text-slate-500 pb-1 font-bold">/ {sneakers.length} pairs</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-3 font-medium">
                {isMember 
                  ? `${existingClient.membership} Plan - Service Fee Waived.`
                  : (sneakers.length < PRICING.BULK_THRESHOLD 
                    ? `Standard Rate ($${PRICING.STANDARD_RATE} ea) active.` 
                    : `JULUKA Bulk Rate ($${PRICING.BULK_RATE} ea) active.`)}
              </p>
            </div>
            <button 
              type="submit"
              className="w-full bg-white hover:bg-slate-100 text-black font-black py-4 rounded-2xl mt-8 transition-all active:scale-95 uppercase tracking-widest text-sm"
            >
              Confirm Drop Off
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;
