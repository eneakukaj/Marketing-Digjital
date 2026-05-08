import React, { useState } from 'react';
import axios from 'axios';

const UsersTab = ({ users, refreshUsers }) => {

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await axios.delete(`http://localhost:3000/api/users/${id}`);
      await refreshUsers(); 
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleEdit = async (user) => {
    const newName = prompt("Edit name:", user.emri);
    const newSurname = prompt("Edit surname:", user.mbiemri);

    if (!newName || !newSurname) return;

    try {
      await axios.put(`http://localhost:3000/api/users/${user.id}`, {
        emri: newName,
        mbiemri: newSurname,
        statusi: user.statusi
      });

      await refreshUsers();
    } catch (err) {
      alert("Edit failed");
    }
  };

  return (
    <div>

      <div className="flex justify-between mb-6">
        <h3 className="font-bold text-lg">Users</h3>

        <button
          onClick={() => alert("Add User modal")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          + Add User
        </button>
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="text-xs text-gray-400 border-b">
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-b hover:bg-gray-50">

              <td className="py-3 font-medium">
                {user.emri} {user.mbiemri}
              </td>

              <td className="text-gray-500">
                {user.email}
              </td>

              <td>
                <span className={`px-2 py-1 text-xs rounded ${
                  user.statusi === 'aktiv'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-600'
                }`}>
                  {user.statusi}
                </span>
              </td>

              <td className="text-center space-x-4">
                <button
                  onClick={() => handleEdit(user)}
                  className="text-indigo-600 font-bold"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(user.id)}
                  className="text-red-500 font-bold"
                >
                  Delete
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default UsersTab;