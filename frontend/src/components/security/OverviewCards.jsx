import React from 'react';

const OverviewCard = ({ title, value, icon }) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
      <p className="text-2xl font-black text-slate-800">{value}</p>
    </div>
    <div className="text-2xl bg-slate-50 w-12 h-12 flex items-center justify-center rounded-xl">
      {icon}
    </div>
  </div>
);
export default OverviewCard;