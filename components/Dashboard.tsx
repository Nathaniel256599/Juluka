
import React, { useEffect, useState } from 'react';
import { Order, OrderStatus } from '../types';
import { getDailyReport } from '../services/geminiService';

interface DashboardProps {
  orders: Order[];
}

const Dashboard: React.FC<DashboardProps> = ({ orders }) => {
  const [aiReport, setAiReport] = useState('Generating daily insight for JULUKA...');

  const stats = {
    totalRevenue: orders.reduce((sum, o) => sum + o.totalCost, 0),
    activeJobs: orders.filter(o => o.status === OrderStatus.PENDING || o.status === OrderStatus.CLEANING).length,
    readyToPick: orders.filter(o => o.status === OrderStatus.READY).length,
    todayJobs: orders.filter(o => new Date(o.dropOffDate).toDateString() === new Date().toDateString()).length
  };

  useEffect(() => {
    const fetchReport = async () => {
      const report = await getDailyReport(stats.todayJobs, stats.totalRevenue);
      setAiReport(report);
    };
    fetchReport();
  }, [stats.todayJobs, stats.totalRevenue]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Total Revenue</p>
          <p className="text-3xl font-black text-black">${stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Active Jobs</p>
          <p className="text-3xl font-black text-black">{stats.activeJobs}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Ready for Pickup</p>
          <p className="text-3xl font-black text-slate-900">{stats.readyToPick}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Dropped Today</p>
          <p className="text-3xl font-black text-black">{stats.todayJobs}</p>
        </div>
      </div>

      <div className="bg-black p-8 rounded-3xl text-white shadow-2xl shadow-black/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
          <h3 className="text-sm font-bold tracking-widest uppercase">JULUKA AI INSIGHT</h3>
        </div>
        <p className="text-slate-200 text-2xl leading-tight font-medium">
          "{aiReport}"
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-black text-lg mb-4 uppercase tracking-tight">Upcoming Pickups</h3>
          <div className="space-y-3">
            {orders
              .filter(o => o.status !== OrderStatus.PICKED_UP)
              .sort((a, b) => new Date(a.expectedPickupDate).getTime() - new Date(b.expectedPickupDate).getTime())
              .slice(0, 5)
              .map(o => (
                <div key={o.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-colors border-l-4 border-black pl-4">
                  <div>
                    <p className="font-bold text-slate-800">{o.clientName}</p>
                    <p className="text-xs text-slate-500">{o.sneakers.length} pairs • {o.serviceType}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-black">Due: {new Date(o.expectedPickupDate).toLocaleDateString()}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      o.status === OrderStatus.READY ? 'bg-black text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {o.status}
                    </span>
                  </div>
                </div>
              ))}
              {orders.length === 0 && <p className="text-slate-400 text-sm">No pending pickups for JULUKA.</p>}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-black text-lg mb-4 uppercase tracking-tight">Revenue Analysis</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-medium">Standard Service ($2.00)</span>
              <span className="font-black">${orders.filter(o => o.sneakers.length < 3).reduce((s, o) => s + o.totalCost, 0).toFixed(2)}</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
               <div className="bg-slate-300 h-full" style={{ width: '60%' }}></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-medium">Bulk Service ($2.50 ea)</span>
              <span className="font-black">${orders.filter(o => o.sneakers.length >= 3).reduce((s, o) => s + o.totalCost, 0).toFixed(2)}</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
               <div className="bg-black h-full" style={{ width: '40%' }}></div>
            </div>
            <p className="text-[10px] text-slate-400 mt-6 pt-6 border-t border-slate-100 font-bold uppercase tracking-widest">
              * Automating cash flow based on JULUKA pricing rules.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
