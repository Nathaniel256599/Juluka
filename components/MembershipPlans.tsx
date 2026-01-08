
import React from 'react';
import { MembershipTier, Client } from '../types';
import { PRICING } from '../constants';

interface MembershipPlansProps {
  clients: Client[];
  onUpdateClient: (client: Client) => void;
}

const MembershipPlans: React.FC<MembershipPlansProps> = ({ clients, onUpdateClient }) => {
  const [selectedPhone, setSelectedPhone] = React.useState('');
  const [activeClient, setActiveClient] = React.useState<Client | null>(null);

  React.useEffect(() => {
    const found = clients.find(c => c.phone === selectedPhone);
    setActiveClient(found || null);
  }, [selectedPhone, clients]);

  const plans = [
    {
      tier: MembershipTier.MONTHLY_BASIC,
      price: PRICING.MEMBERSHIP.BASIC_MONTHLY,
      period: 'Monthly',
      features: ['Bring shoes anytime', 'Standard professional cleaning', 'Priority drop-off'],
      color: 'bg-white text-black'
    },
    {
      tier: MembershipTier.MONTHLY_UNLIMITED,
      price: PRICING.MEMBERSHIP.UNLIMITED_MONTHLY,
      period: 'Monthly',
      features: ['Unlimited shoes per month', 'Special requests included', 'Deep cleaning & protection'],
      color: 'bg-black text-white'
    },
    {
      tier: MembershipTier.VVIP_LIFETIME,
      price: PRICING.MEMBERSHIP.VVIP_LIFETIME,
      period: 'One-time',
      features: ['LIFETIME membership', 'Unlimited everything', 'VVIP dedicated tech', 'Free restorations'],
      color: 'bg-gradient-to-br from-slate-900 to-black text-white border-2 border-yellow-500/30'
    }
  ];

  const handleSubscribe = (tier: MembershipTier) => {
    if (!activeClient) return;
    const updated = { ...activeClient, membership: tier };
    onUpdateClient(updated);
    alert(`${activeClient.name} successfully subscribed to ${tier}!`);
  };

  return (
    <div className="space-y-10">
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="text-xl font-black uppercase tracking-tight mb-6">Client Lookup</h3>
        <div className="flex gap-4">
          <input 
            type="tel" 
            placeholder="Search client phone..." 
            className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-black outline-none"
            value={selectedPhone}
            onChange={(e) => setSelectedPhone(e.target.value)}
          />
        </div>
        {activeClient && (
          <div className="mt-4 p-4 bg-slate-50 rounded-2xl flex justify-between items-center border border-slate-100">
            <div>
              <p className="font-black text-slate-900">{activeClient.name}</p>
              <p className="text-xs text-slate-500 font-bold uppercase">Current: {activeClient.membership}</p>
            </div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.tier} className={`${plan.color} p-8 rounded-3xl flex flex-col justify-between shadow-xl transition-transform hover:scale-[1.02] border border-slate-100`}>
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-4 opacity-70">{plan.period} Package</h4>
              <p className="text-2xl font-black uppercase tracking-tight leading-none mb-2">{plan.tier}</p>
              <div className="flex items-end gap-1 mb-8">
                <span className="text-4xl font-black">${plan.price}</span>
                <span className="text-xs font-bold opacity-60 pb-1">{plan.period === 'Monthly' ? '/ MO' : 'LIFETIME'}</span>
              </div>
              
              <ul className="space-y-3 mb-10">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm font-medium">
                    <span className="mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <button 
              disabled={!activeClient || activeClient.membership === plan.tier}
              onClick={() => handleSubscribe(plan.tier)}
              className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed ${
                plan.color.includes('bg-white') ? 'bg-black text-white' : 'bg-white text-black'
              }`}
            >
              {activeClient?.membership === plan.tier ? 'Active' : 'Assign to Client'}
            </button>
          </div>
        ))}
      </div>

      <div className="text-center p-12">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">JULUKA SNEAKER CARE PREMIUM SERVICES</p>
      </div>
    </div>
  );
};

export default MembershipPlans;
