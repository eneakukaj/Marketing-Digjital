import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import SecurityModule from '../components/security/SecurityModule';

const CampaignsModule = () => {
  const [subTab, setSubTab] = useState('Overview');
  const subMenus = [
    { id: 'Overview', label: 'All Campaigns' },
    { id: 'Scheduling', label: 'Scheduling' },
    { id: 'Budgets', label: 'Budgets' },
    { id: 'Milestones', label: 'Milestones' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex border-b border-gray-200 gap-8 mb-6">
        {subMenus.map((menu) => (
          <button
            key={menu.id}
            onClick={() => setSubTab(menu.id)}
            className={`pb-4 text-sm font-bold transition-all ${
              subTab === menu.id ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {menu.label}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 min-h-[400px]">
        {subTab === 'Overview' && <h3 className="font-bold text-slate-800">Lista e Kampanjave</h3>}
        {subTab === 'Scheduling' && <h3 className="font-bold text-slate-800">Kalendari i Publikimeve</h3>}
        {subTab === 'Budgets' && <h3 className="font-bold text-slate-800">Menaxhimi i Buxhetit</h3>}
        {subTab === 'Milestones' && <h3 className="font-bold text-slate-800">Objektivat dhe Arritjet</h3>}
      </div>
    </div>
  );
};

const SettingsModule = () => {
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <h3 className="font-black italic text-slate-800 mb-6">PROFILE SETTINGS</h3>
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</label>
            <input type="text" className="w-full mt-1 bg-slate-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="Enea..." />
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</label>
            <input type="email" className="w-full mt-1 bg-slate-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="enea@example.com" />
          </div>
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 transition">Update Profile</button>
        </div>
      </div>
      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <h3 className="font-black italic text-slate-800 mb-6">PREFERENCES</h3>
        <div className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center mb-4">
          <div>
            <p className="text-sm font-bold text-slate-600">Email Notifications</p>
            <p className="text-[10px] text-slate-400">Receive weekly campaign reports</p>
          </div>
          <button 
            onClick={() => setNotifications(!notifications)}
            className={`w-10 h-5 rounded-full relative transition-colors ${notifications ? 'bg-indigo-600' : 'bg-slate-200'}`}
          >
            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${notifications ? 'left-6' : 'left-1'}`}></div>
          </button>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('Dashboard');

  const mainNav = [
    { id: 'Dashboard', label: 'Dashboard' },
    { id: 'Campaigns',  label: 'Campaigns' },
    { id: 'Content', label: 'Content' },
    { id: 'Audience', label: 'Audience' },
    { id: 'Analytics', label: 'Analytics' },
    { id: 'Budget', label: 'Budget' },
  ];

  return (
    <div className="flex min-h-screen bg-[#f1f5f9] text-[#1e293b]">
      
      <aside className="w-64 bg-[#0f172a] text-white flex flex-col fixed h-full">
        <div className="p-8">
          <h2 className="text-2xl font-black tracking-tighter text-white">AdVantage</h2>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {mainNav.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'
              }`}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
          
          <div className="mt-10 pt-4 border-t border-white/5 space-y-2">
            <button
              onClick={() => setActiveTab('Security')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'Security' ? 'bg-white text-indigo-900 shadow-lg' : 'text-gray-400 hover:bg-white/5'
              }`}
            >
               Users & Auth
            </button>

            <button
              onClick={() => setActiveTab('Settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'Settings' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'
              }`}
            >
              Settings
            </button>
          </div>
        </nav>

        <div className="p-6 border-t border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center font-bold uppercase shadow-inner">
            {user?.emri?.[0] || 'E'}
          </div>
          <div className="truncate text-xs font-bold uppercase tracking-widest text-gray-400">
             {user?.emri || 'Enea'}
          </div>
        </div>
      </aside>

      
      <main className="flex-1 ml-64 min-h-screen">
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-10 py-6 sticky top-0 z-10 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-slate-800 uppercase italic tracking-tight">{activeTab}</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Marketing & Performance</p>
          </div>
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
             + New Action
          </button>
        </header>

        <div className="p-10">
          {activeTab === 'Dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <StatCard title="Active Campaigns" value="12" />
                <StatCard title="Total Spend" value="$33,400" />
                <StatCard title="Leads" value="1,842" />
                <StatCard title="ROI" value="240%" />
            </div>
          )}

          {activeTab === 'Campaigns' && <CampaignsModule />}
          {activeTab === 'Security' && <SecurityModule />}
          {activeTab === 'Settings' && <SettingsModule />}
          
          {!['Dashboard', 'Campaigns', 'Security', 'Settings'].includes(activeTab) && (
             <div className="bg-white rounded-[2rem] p-20 text-center border border-dashed border-gray-300">
                <h2 className="text-xl font-bold text-gray-400 italic">Moduli {activeTab} është gati për punë.</h2>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
    <p className="text-3xl font-black text-slate-800">{value}</p>
  </div>
);

export default Dashboard;