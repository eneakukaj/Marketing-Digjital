import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OverviewCard from './OverviewCards';
import UsersTab from './UsersTab';
import RolesTab from './RolesTab';
import TokensTab from './TokensTab';

const SecurityModule = () => {
  const [subTab, setSubTab] = useState('Users');
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [tokens, setTokens] = useState([]);
 
  const fetchUsersData = async () => {
  try {
    const token = localStorage.getItem('accessToken'); 
    const res = await axios.get('http://localhost:3000/api/admin/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (Array.isArray(res.data)) {
      setUsers(res.data);
    }
  } catch (err) {
    console.error("API ERROR:", err);
  }
};

const fetchRolesData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.get('http://localhost:3000/api/admin/roles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (Array.isArray(res.data)) {
        setRoles(res.data);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    fetchUsersData();
    fetchRolesData();
  }, [subTab]);

  const fetchTokensData = async () => {
  try {
    const token = localStorage.getItem("accessToken");

    const res = await axios.get(
      "http://localhost:3000/api/admin/tokens",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (Array.isArray(res.data)) {
      setTokens(res.data);
    }
  } catch (err) {
    console.error("Error tokens:", err);
  }
};

useEffect(() => {
  fetchUsersData();
  fetchRolesData();
  fetchTokensData();
}, [subTab]);

  const activeTokens = tokens.filter(
  (t) => !t.revoked && new Date(t.expires) > new Date()
).length;

 
  const stats = [
    { title: "Total Users", value: users.length.toString() },
    { title: "Active Users", value: users.filter(u => u.statusi === 'aktiv').length.toString() },
    { title: "Active Tokens", value: activeTokens.toString() },
    { title: "Total Roles", value: roles.length.toString() }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <OverviewCard key={i} title={stat.title} value={stat.value}/>
        ))}
      </div>

      <div className="flex border-b border-gray-200 gap-8 mb-6">
        {['Users', 'Roles', 'Tokens'].map(tab => (
          <button
            key={tab}
            onClick={() => setSubTab(tab)}
            className={`pb-4 text-sm font-bold transition-all ${
              subTab === tab ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-400'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 min-h-[400px]">
        {subTab === 'Users' && <UsersTab users={users} refreshUsers={fetchUsersData} />}
        {subTab === 'Roles' && <RolesTab />}
        {subTab === 'Tokens' && <TokensTab />}
      </div>
    </div>
  );
};


export default SecurityModule;