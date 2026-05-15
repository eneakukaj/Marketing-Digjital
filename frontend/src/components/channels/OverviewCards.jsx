import React from 'react';

const OverviewCard = ({ title, value }) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
    </div>
    <div className="text-sm font-black bg-indigo-50 text-indigo-600 h-12 px-4 flex items-center justify-center rounded-xl shrink-0 ml-4 select-none min-w-[3.5rem] whitespace-nowrap">
      {value}
    </div>
  </div>
);

export default OverviewCard;