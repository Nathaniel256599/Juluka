
import React from 'react';
import { Order, OrderStatus } from '../types';

interface OrderListProps {
  orders: Order[];
  onUpdateStatus: (id: string, status: OrderStatus) => void;
}

const OrderList: React.FC<OrderListProps> = ({ orders, onUpdateStatus }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Job ID</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Client</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Kicks</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Tech</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Revenue</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-12 text-center text-slate-400 font-medium">Pipeline is empty. New drops will appear here.</td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-5">
                    <span className="font-mono text-[10px] font-bold text-slate-300">{order.id}</span>
                  </td>
                  <td className="p-5">
                    <p className="font-black text-slate-900 text-sm tracking-tight">{order.clientName}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Dropped: {new Date(order.dropOffDate).toLocaleDateString()}</p>
                  </td>
                  <td className="p-5">
                    <div className="flex -space-x-2 overflow-hidden">
                      {order.sneakers.map((s, i) => (
                        <div key={i} className="inline-block h-7 w-7 rounded-full bg-black border-2 border-white flex items-center justify-center text-[10px] font-black text-white" title={`${s.brand} ${s.model}`}>
                          {s.brand[0]}
                        </div>
                      ))}
                    </div>
                    <p className="text-[9px] mt-1 text-slate-400 font-black uppercase tracking-wider">{order.sneakers.length} pairs</p>
                  </td>
                  <td className="p-5">
                    <span className="text-xs font-bold text-slate-700">{order.assignedEmployee}</span>
                  </td>
                  <td className="p-5">
                    <select 
                      value={order.status}
                      onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
                      className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest outline-none cursor-pointer border-none transition-all ${
                        order.status === OrderStatus.READY ? 'bg-black text-white' :
                        order.status === OrderStatus.CLEANING ? 'bg-slate-900 text-slate-200' :
                        order.status === OrderStatus.PICKED_UP ? 'bg-slate-100 text-slate-400 line-through' :
                        'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="p-5">
                    <span className="font-black text-slate-900">${order.totalCost.toFixed(2)}</span>
                  </td>
                  <td className="p-5 text-right">
                    <button className="text-slate-300 hover:text-black transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;
